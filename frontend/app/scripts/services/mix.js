'use strict';

angular.module('frontendApp')
  .factory('mix', function (CONFIG, $window, $http, $q, notification, auth) {

    var context, tracks = [], buffers = [], samples = [];
    var lastTime = 0, currentTime, elapsedTimeSinceStart = 0, paused = true;
    var masterSlider, listsongs = null;
    var bufferLoader, trackVolumeNodes = [], trackVolumeNodesL = [];
    var canvas, ctx, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
    var compressor = [], filter = [], merger = [], sources = [];

    var mixedInfo = {
      'name_new': '',
      'name': '',
      'info': {},
      'author': {
        _id: auth.id,
        full_name: auth.full_name
      }
    };


    return {

      init: function (callback) {
        buffers = [];
        listsongs = init(callback);
      },

      playAT: function (b, startTime) {
        playAllTracks(startTime);
      },

      pauseAT: function (b) {
        buffers = b;

        samples.forEach(function (s) {
          s.stop(0);
        });
        disconn();

        paused = true;
      },

      pauseReplayAllTracks: function (b) {
        buffers = b;
        paused = false;
        playAllTracks(elapsedTimeSinceStart);
      },

      stopAT: function (b) {
        buffers = b;
        stopAllTracks();
      },

      savemixed: function (s) {
        if (s == '' || s == undefined) {
        }
        else {
          mixedInfo.name_new = s;
          var deferred = $q.defer();
          $http.post(CONFIG.baseUrlApi + '/savemixed', {mixed: mixedInfo})
            .success(function (data) {
              notification.writeNotification(data);
              deferred.resolve(data);
            }).error(function (data) {
              notification.writeNotification(data);
              deferred.reject(false);
            });
          return deferred.promise;
        }
      },

      getAllTrackList: function (songName, callback, callbackFinishedLoading) {
        buffers = [];
        loadTrackList(songName, callback, callbackFinishedLoading);
        return buffers;
      },

      changeRS: function (num) {
        stopAllTracks();
        var totalTime = buffers[0].duration;
        var startTime = (num * totalTime) / 100;
        elapsedTimeSinceStart = startTime;
        playAllTracks(startTime);
      },

      setGain: function (i, val) {
        trackVolumeNodes[i].gain.value = val;
        trackVolumeNodesL[i].gain.value = val;
      },

      setMonoR: function (i, val) {
        trackVolumeNodesL[i].gain.value = val;
        mixedInfo.info[i].right = val;
      },

      setMonoL: function (i, val) {
        trackVolumeNodes[i].gain.value = val;
        mixedInfo.info[i].left = val;
      },

      setFilterFrequency: function (i, val) {
        filter[i].frequency.value = val;
        mixedInfo.info[i].frequancy = val;
      }

    };





    //================================================================================
    //   INIT : context & audio
    //================================================================================

    //** Init context
    /** =============== **/
    function init(callback) {
      window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
          };
      })();

      masterSlider = document.querySelector("#slide");
      lastTime = 0;
      context = initAudioContext();
      analyser = [];
      canvas = document.getElementById('analyser');
      ctx = canvas.getContext('2d');
      var listsongs = loadSongs(callback);
      animateTime();

      return listsongs;
    };


    //** Init Audio context
    /** =============== **/
    function initAudioContext() {
      var audioContext = $window.AudioContext || $window.webkitAudioContext;
      var ctx = new audioContext();
      if (ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }
      return ctx;
    };





    //================================================================================
    //  MANAGEMENT OF TRACKS (play, stop, pause)
    //================================================================================

    //** Play all tracks
    /** =============== **/
    function playAllTracks(startTime) {
      buildGraph(buffers);
      playFrom(startTime);
    }

    //** Play from time
    /** =============== **/
    function playFrom(startTime) {
      samples.forEach(function (s) {
        s.start(0, startTime);
      });

      lastTime = context.currentTime;
      paused = false;
    };


    //** Stop all tracks
    /** =============== **/
    function stopAllTracks() {
      samples.forEach(function (s) {
        // destroy the nodes
        s.stop(0);
      });
      elapsedTimeSinceStart = 0;
      paused = true;
    };





    //================================================================================
    // LOADING SONGS (songs, tracks, list, finished loading)
    //================================================================================

    //** Load songs
    /** =============== **/
    function loadSongs(callback) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', CONFIG.baseUrlApi + "/track", true);

      xhr.onload = function (e) {
        callback(JSON.parse(this.response));
      };

      xhr.send();
    };


    //** Load all sound samples
    /** =============== **/
    function loadAllSoundSamples(tracks, callbackFinishedLoading) {
      // update progress bar length
      $("#progressbar").progressbar("option", "max", tracks.length);

      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading,
        callbackFinishedLoading
      );

      bufferLoader.load();
    };


    //** Load all track list
    /** =============== **/
    function loadAllTrackList(songName, callback) {
      var tackList = loadTrackList(songName, callback);
      return trackList;
    }


    //** Load track list
    /** =============== **/
    function loadTrackList(songName, callback, callbackFinishedLoading) {

      resetAllBeforeLoadingANewSong(); // stop all tracks

      mixedInfo.name = songName;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', CONFIG.baseUrlApi + "/track/" + songName, true);
      xhr.onload = function (e) {
        var infos = [];
        var i = 0;
        var track = JSON.parse(this.response);

        track.instruments.forEach(function (instrument) {
          var url = CONFIG.baseUrlApi + "/track/" + songName + "/sound/" + instrument.sound;
          tracks.push(url);

          infos.push({'name': "" + instrument.sound, 'left': -2, 'right': 1, 'frequancy': 5000});
          i++;
        });
        mixedInfo.info = infos;

        callback(track);

        loadAllSoundSamples(tracks, callbackFinishedLoading);
      };
      xhr.send();
    };


    //** Reset all variable before loading new song
    /** =============== **/
    function resetAllBeforeLoadingANewSong() {
      tracks = [];
      stopAllTracks();
    };


    //** Finish loading all tracks
    /** =============== **/
    function finishedLoading(bufferList, callback) {
      buffers = bufferList;
      var conf = callback(buffers);
      sources = [];
      trackVolumeNodes = [];
      trackVolumeNodesL = [];
      compressor = [];
      filter = [];
      samples = [];
      merger = [];

      buffers.forEach(function (sample, i) {

        filter[i] = context.createBiquadFilter();
        filter[i].type = filter[i].LOWPASS;
        trackVolumeNodes[i] = context.createGain();
        trackVolumeNodesL[i] = context.createGain();

        compressor[i] = context.createDynamicsCompressor();
        analyser[i] = context.createAnalyser();

        merger[i] = context.createChannelMerger(2);

        if (conf) {
          filter[i].frequency.value = conf.info[i].frequancy;
          trackVolumeNodes[i].gain.value = conf.info[i].right;
          trackVolumeNodesL[i].gain.value = conf.info[i].left;
        }
      });
    };




    //================================================================================
    //  BUILD GRAPH
    //================================================================================


    //** Build graph
    /**=========================**/
    function buildGraph(bufferList) {

      buffers.forEach(function (sample, i) {

        sources[i] = context.createBufferSource();
        sources[i].buffer = sample;
        sources[i].connect(trackVolumeNodes[i]);
        sources[i].connect(trackVolumeNodesL[i]);
        sources[i].connect(analyser[i]);

        trackVolumeNodes[i].connect(merger[i], 0, 0);
        trackVolumeNodesL[i].connect(merger[i], 0, 1);
        sources[i].connect(merger[i]);

        analyser[i].connect(merger[i]);

        merger[i].connect(filter[i]);
        filter[i].connect(context.destination);

        samples = sources;
      });
    }





    //================================================================================
    //  DISCONNECT ALL
    //================================================================================

    //** Disconnect
    /**=========================**/
    function disconn() {
      buffers.forEach(function (sample, i) {
        sources[i].disconnect(trackVolumeNodes[i]);
        sources[i].disconnect(trackVolumeNodesL[i]);
        sources[i].disconnect(analyser[i]);

        trackVolumeNodes[i].disconnect(merger[i], 0, 0);
        trackVolumeNodesL[i].disconnect(merger[i], 0, 1);
        sources[i].disconnect(merger[i]);
        analyser[i].disconnect(merger[i]);

        merger[i].disconnect(filter[i]);
        filter[i].disconnect(context.destination);
        samples = sources;
      });
    }





    //================================================================================
    //  CANVAS DRAWER
    //================================================================================

    //** Draw canvas
    /**=========================**/
    function animateTime() {
      if (!paused) {
        currentTime = context.currentTime;
        var delta = currentTime - lastTime;

        var totalTime;

        if (buffers[0] != undefined) {

          elapsedTimeSinceStart += delta;
          lastTime = currentTime;

          fbc_array = new Uint8Array(analyser[0].frequencyBinCount);
          analyser[0].getByteFrequencyData(fbc_array);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFFFFF';
          bars = 100;
          for (var i = 0; i < bars; i++) {
            bar_x = i * 3;
            bar_width = 2;
            bar_height = -(fbc_array[i] / 2);
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
          }
        }

        var totalTime = buffers[0].duration;
        var x = elapsedTimeSinceStart * 100 / totalTime;
        masterSlider.value = x;
      }
      requestAnimFrame(animateTime);
    }


  });
