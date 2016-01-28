'use strict';

/**
 * Created by user on 17/01/16.
 */
/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # user
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('mix', function (CONFIG,$window, $http, $q, notification) {

    var context;
// Les echantillons prêts à être joués, de toutes les pistes
    var tracks = [];
    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes

// Master volume
    var masterVolumeNode;
    var buttonPlay, buttonStop, buttonPause;
    var masterVolumeSlider;
// List of tracks and mute buttons
    var divTrack;

// Useful for memorizing when we paused the song
    var lastTime = 0;
    var currentTime;

    var elapsedTimeSinceStart = 0;

    var paused = true;

// requestAnim shim layer by Paul Irish, like that canvas animation works
// in all browsers

    return {
      combine: function(b){
        //var bell = new Wad({source : 'sine'});
        console.log('play Wad');
        //bell.play();
        //bell.stop();
        //buildGraph(b);
        //context = initAudioContext();

        var bb= mix(b);
        var bbs =[];
        bbs.push(bb);
        buffers =bbs;
        buildGraph(buffers);

        playFrom(0);
        //var tmp = context.createBuffer(buffers[0].numberOfChannels, buffers[0].length, buffers[0].sampleRate);
        //var blob = new Blob([buffers[0]], {type: 'wav'});
        //var mediaStreamSource = context.createMediaStreamSource(buffers[0]);

        /*var rec = new Recorder(tmp, {
          // pass the path to recorderWorker.js file here
          workerPath: '../../../bower_components/Wad/src/Recorderjs/recorderWorker.js'
        });
        var blob = new Blob(buffers[0], {type: "audio/mp3"});
        //rec.record();
        rec.exportWAV(function(e){
        */  //rec.clear();
         // Recorder.forceDownload(blob, "output.wav");
        //});

       /*var xhr = new XMLHttpRequest();
        xhr.open("POST", CONFIG.baseUrlApi + '/mixed', true);
        //xhr.setRequestHeader("content-type", "audio/mp3");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        var formData = new FormData();
        formData.append('mix', buffers[0]);
        xhr.onload = function(e) {
          // Handle the response.
        };
        xhr.send(formData);
        /*var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/mixed', buffers[0])
          .success(function (data) {
            console.log(data);
            notification.writeNotification(data);
            deferred.resolve(data);
          }).error(function (data) {
            notification.writeNotification(data);
            deferred.reject(false);
          });
        return deferred.promise;*/

        //fileSystem.writeArrayBuffer('output',buffers[0] ,'wav');

      },

      init: function(b){
        //var buf;
        init(b);
      },

    playAT :function (startTime) {
      playAllTracks(startTime);
      console.log("plyAT= " + buffers.length);
      return buffers;
    },
      loadOS :function (name) {
        //loadSong(name);
        loadTrackList(songName);
      },
      pauseAT:  function (b) {
        buffers = b;
        console.log("pauAT= " + buffers.length);
        pauseAllTracks();
    },

      stopAT: function (b) {
        buffers = b;
        stopAllTracks();
    },

    changeMasterVolume : function () {
      setMasterVolume();
    },
    muteUnmuteTrack:  function (trackNumber) {
        // AThe mute / unmute button
      var b = document.querySelector("#mute" + trackNumber);
      if (trackVolumeNodes[trackNumber].gain.value == 1) {
        trackVolumeNodes[trackNumber].gain.value = 0;
        b.innerHTML = "Unmute";
      } else {
        trackVolumeNodes[trackNumber].gain.value = 1;
        b.innerHTML = "Mute";
      }
    },
      changeRS : function (num) {
          jumpTo2(num);
      }

    };

    function mix(bs) {
      /*if (buffer1.numberOfChannels != buffer2.numberOfChannels) {
        console.log("number of channels is not the same!");
        return null;
      }

      if (buffer1.sampleRate != buffer2.sampleRate) {
        console.log("sample rates don't match!");
        return null;
      }*/
      var lens = 0;
        bs.forEach(function(s, i) {
          lens += s.length;
      });
      var len =bs[0].length;
      var tmp = context.createBuffer(bs[0].numberOfChannels, len, bs[0].sampleRate);

      for (var i=0; i<tmp.numberOfChannels; i++) {
        var data = tmp.getChannelData(i);
        var cd,cds=[];
        cds = bs[0].getChannelData(i);
        if(bs.length > 1) {
          for (var j = 1; j < bs.length; j++) {
            cd = bs[j].getChannelData(i);
            for (var k = 0; k < cd.length; k++) {
              cds[k] += cd[k];
            }
          }
        }
        data.set(cds);
        //data.set(buffer1.getChannelData(i));
        //data.set(buffer2.getChannelData(i),buffer1.length);
      }
      return tmp;


    }
    var canvas,ctx,analyser;
    var masterSlider;
    function init(b) {
      // Get handles on buttons
      window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
          };
      })();
      buffers = b;
      lastTime = 0;
      buttonPlay = document.querySelector("#bplay");
      buttonPause = document.querySelector("#bpause");
      buttonStop = document.querySelector("#bstop");

      divTrack = document.getElementById("tracks");


      // Master volume slider
      masterVolumeSlider = document.querySelector("#masterVolume");
      masterSlider = document.querySelector("#slide");

      // Init audio context
      context = initAudioContext();
      analyser = context.createAnalyser();
      canvas = document.getElementById('analyser');
      //canvas = $('#analyser');
      //canvas.width = 20;
      ctx = canvas.getContext('2d');

      console.log('init');
      // Get the list of the songs available on the server and build a
      // drop down menu
      var listsongs = loadSongList();

      animateTime();

      return listsongs;
    }
// ######### SONGS
    var button;
    function loadSongList() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET',CONFIG.baseUrlApi + "/track", true);

      // Menu for song selection
      var s = $("<select/>");
      s.appendTo("#songs");
      s.change(function(e) {
        console.log("You chose : " + $(this).val());
        loadTrackList($(this).val());
      });
      var songList ;
      xhr.onload = function(e) {
        songList = JSON.parse(this.response);

        songList.forEach(function(songName) {
          console.log(songName);

          $("<option />", {value: songName, text: songName}).appendTo(s);

          /* var list = angular.element(document.getElementById("songs"));
           var li = angular.element(document.createElement('li'));
           li.textContent = songName;
          button = document.createElement('button')
            button.setAttribute("ng-click", "loadOneSong('" + songName + "')");
          button.textContent = "load";
           button = angular.element(button);
           //button.attr("ng-click", "loadOneSong('" + songName + "')");

          angular.element(li.append(button));
          angular.element(list.append(li));*/
        });
      };
      xhr.send();

      return songList;
    }

    function initAudioContext() {
      // Initialise the Audio Context
      // There can be only one!
      var audioContext = window.AudioContext || window.webkitAudioContext;

      var ctx = new audioContext();

      if(ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }

      return ctx;
    }
// SOUNDS AUDIO ETC.


    function resetAllBeforeLoadingANewSong() {
      // Marche pas, c'est pour tester...
      console.log('resetAllBeforeLoadingANewSong');
      // reset array of tracks. If we don't do this we just add new samples to existing
      // ones... playing two songs at the same time etc.
      tracks = [];
      stopAllTracks();
      buttonPlay.disabled = true;
      divTrack.innerHTML="";
      /*
       samples.forEach(function(s) {
       s.stop(0);
       s.disconnect(0);
       });*/
    }

    var bufferLoader;

    function loadAllSoundSamples(tracks) {


      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading
      );
      bufferLoader.load();
    }

    function finishedLoading(bufferList) {
      console.log("finished loading");

      buffers = bufferList;
      buffers.forEach(function(i){

      });
      buttonPlay.disabled = false;
    }

    var trackVolumeNodes = [];
    var masterSlideNode;
    var source;
    function buildGraph(bufferList) {
      var sources = [];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      masterSlideNode = context.createGain();
      samples = [];
      var b = bufferList.concat();
      console.log("in build graph, bufferList.size = " + bufferList.length);

      buffers.forEach(function(sample, i) {
// each sound sample is the  source of a graph
        sources[i] = context.createBufferSource();
        sources[i].buffer = sample;
        var trackVolumeNodes2 = [];
        trackVolumeNodes = trackVolumeNodes2;

        // connect each sound sample to a vomume node
       trackVolumeNodes[i] = context.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect(trackVolumeNodes[i]);
        // Connects all track volume nodes a single master volume node
        trackVolumeNodes[i].connect(masterVolumeNode);
        // Connect the master volume to the speakers
        masterVolumeNode.connect(context.destination);
        masterSlideNode.connect(context.destination);
        console.log('volume'+ trackVolumeNodes[0]);
        // On active les boutons start et stop
        samples = sources;

      });
      //source = context.createMediaElementSource(buffers[0]);
      samples[0].connect(analyser);
      analyser.connect(context.destination);
      console.log("in build graph, bufferList.size = " + buffers.length);
    }

// ######## TRACKS
    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function getTrackName(elem) {
// returns the name without the suffix
      var n = elem.lastIndexOf(".");
      return elem.slice(0, n + 1);
    }

    function loadTrackList(songName) {
      resetAllBeforeLoadingANewSong();

      var xhr = new XMLHttpRequest();
      xhr.open('GET', CONFIG.baseUrlApi +"/track/" + songName, true);
      xhr.onload = function(e) {
        var track = JSON.parse(this.response);
        // resize canvas depending on number of samples
        //resizeSampleCanvas(track.instruments.length);
        var i = 0;

        track.instruments.forEach(function(instrument, trackNumber) {
          // Image
          console.log("on a une image");
          // Render HTMl
          var span = document.createElement('span');
          var imageURL = CONFIG.baseUrlApi +"/track/" + songName + "/visualisation/" + instrument.visualisation;

          span.innerHTML = instrument.name +
          "<button id='mute" + trackNumber + "' ng-click='muteUnmuteTrack(" + trackNumber + ");'>Mute</button><br/>"
          /*
           +
           "<img class='sample' src='" + imageURL + "'/><br/>";
           */
          //drawSampleImage(imageURL, trackNumber, instrument.name);
          divTrack.appendChild(span);

          // Audio
          console.log("on a un fichier audio");
          // load audio dans un tableau...
          var url = CONFIG.baseUrlApi+ "/track/" + songName + "/sound/" + instrument.sound;

          tracks.push(url);
          console.log("Ajout piste audio " + instrument.name);

        });
        loadAllSoundSamples(tracks);
      };
      xhr.send();
    }

    function jumpTo2(num) {
      console.log("in jumpTo x = " + num );
      // width - totalTime
      // x - ?
      stopAllTracks();
      var totalTime = buffers[0].duration;
      console.log("totalTime = " + totalTime);
      var startTime = (num * totalTime) / 100;
      elapsedTimeSinceStart = startTime;
      playAllTracks(startTime);
    }
    var fbc_array,bars,bar_x,bar_width,bar_height ;
    function animateTime() {
      if (!paused) {
        // Draw the time on the front canvas
        currentTime = context.currentTime;
        var delta = currentTime - lastTime;

        var totalTime;

        //console.log("dans animate");
        //var bb= [];
        //buffers = bb;
        // at least one track has been loaded
        if (buffers[0] != undefined) {

          //var totalTime = buffers[0].duration;
          //var x = elapsedTimeSinceStart * 100 / totalTime;

          elapsedTimeSinceStart += delta;
          lastTime = currentTime;

          fbc_array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(fbc_array);
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle ='#FFFFFF';
          bars = 100;
          for(var i =0; i< bars; i++){
            bar_x = i *3;
            bar_width = 2;
            bar_height = -(fbc_array[i]/2);
            ctx.fillRect(bar_x,canvas.height, bar_width,bar_height);
          }

        }
        var totalTime = buffers[0].duration;
        var x = elapsedTimeSinceStart * 100 / totalTime;

        masterSlider.value=x;
      }


      requestAnimFrame(animateTime);
    }


    function loadSong(song) {
      loadTrackList(song);
    }

     function playAllTracks(startTime) {
       console.log("ply= " + buffers.length);
     var bb =   buffers.concat() ;
       console.log("ply= " + buffers.length);
      buildGraph(buffers);

      playFrom(startTime);

       console.log("ply9= " + buffers.length);
    }

// Same as previous one except that we not rebuild the graph. Useful for jumping from one
// part of the song to another one, i.e. when we click the mouse on the sample graph
    function playFrom(startTime) {
      // Read current master volume slider position and set the volume
      samples.forEach(function(s) {
// First parameter is the delay before playing the sample
// second one is the offset in the song, in seconds, can be 2.3456
// very high precision !
        s.start(0, startTime);
        console.log("playform= " + buffers.length);
      });
      setMasterVolume();


      console.log("playform= " + buffers.length);
      buttonPlay.disabled = true;
      buttonStop.disabled = false;
      buttonPause.disabled = false;

      // Note : we memorise the current time, context.currentTime always
      // goes forward, it's a high precision timer
      console.log("start all tracks startTime =" + startTime);
      lastTime = context.currentTime;
      paused = false;
      console.log("playform9= " + buffers.length);
    }

    function stopAllTracks() {
      samples.forEach(function(s) {
// destroy the nodes
        s.stop(0);
      });
      buttonStop.disabled = true;
      buttonPause.disabled = true;
      buttonPlay.disabled = false;
      elapsedTimeSinceStart = 0;
      paused = true;
    }
    function pauseAllTracks() {
      console.log("stp0= " + buffers.length);
      if (!paused) {
        // Then stop playing
        samples.forEach(function(s) {
// destroy the nodes
          console.log("stp= " + buffers.length);
          s.stop(0);
        });
        console.log("stop = " + buffers.length);
        paused = true;
        console.log("elapsedTimeSinceStart0= " + elapsedTimeSinceStart);
        buttonPause.innerHTML = "Resume";
      } else {
        paused = false;
// we were in pause, let's start again from where we paused
        playAllTracks(elapsedTimeSinceStart);
        console.log("elapsedTimeSinceStart1= " + elapsedTimeSinceStart);
        buttonPause.innerHTML = "Pause";
      }
    }

    function setMasterVolume() {

      var fraction = parseInt(masterVolumeSlider.value) / parseInt(masterVolumeSlider.max);
      // Let's use an x*x curve (x-squared) since simple linear (x) does not
      // sound as good.
      if( masterVolumeNode != undefined)
        masterVolumeNode.gain.value = fraction * fraction;
    }
    function changeMasterVolume() {
      setMasterVolume();
    }


  });
