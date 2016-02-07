'use strict';

angular.module('frontendApp')
  .factory('mix', function (CONFIG,$window, $http, $q, notification) {

    var context, tracks = [], buffers = [], samples = [];
    var lastTime = 0, currentTime, elapsedTimeSinceStart = 0, paused = true;
    var masterVolumeSlider, masterVolumeNode, masterSlideNode, masterSlider;
    var listsongs = null;
    var bufferLoader;
    var trackVolumeNodesL = [], trackVolumeNodesR = [], splitter= [];
    var canvas,ctx,analyser, fbc_array,bars,bar_x,bar_width,bar_height ;
    var pannerNode= [];
    var gainNode = [];
    var compressor = [];
    var compressorNode = [];
    var filter = [];
    var sources = [];

    //================================================================================
    // INIT
    //================================================================================

    function init(callback) {
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

      //masterVolumeSlider = document.querySelector("#masterVolume");
      masterSlider = document.querySelector("#slide");


      lastTime = 0;
      context = initAudioContext();
      analyser = [];

      canvas = document.getElementById('analyser');
      ctx =canvas.getContext('2d');
      var listsongs = loadSongs(callback);
      animateTime();

      return listsongs;
    };



    function initAudioContext() {
      // Initialise the Audio Context : There can be only one!
      var audioContext = $window.AudioContext || $window.webkitAudioContext;
      var ctx = new audioContext();
      if(ctx === undefined) { throw new Error('AudioContext is not supported. :('); }
      return ctx;
    };




    //================================================================================
    // LOADING SONGS
    //================================================================================


    function loadSongs(callback) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET',CONFIG.baseUrlApi + "/track", true);

      xhr.onload = function(e) {
        callback(JSON.parse(this.response));
      };

      xhr.send();
    };



    function resetAllBeforeLoadingANewSong() {
      // reset array of tracks. If we don't do this we just add new samples to existing
      // ones... playing two songs at the same time etc.
      tracks = [];
      stopAllTracks();
      /*
       samples.forEach(function(s) {
       s.stop(0);
       s.disconnect(0);
       });*/
    };


    function loadAllSoundSamples(tracks, callbackFinishedLoading) {
      $( "#progressbar" ).progressbar( "option", "max", tracks.length );

      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading,
        callbackFinishedLoading
      );
      bufferLoader.load();
    };


    function finishedLoading(bufferList, callback) {
      buffers = bufferList;
      callback(buffers);
    };


    function loadTrackList(songName, callback, callbackFinishedLoading) {

      resetAllBeforeLoadingANewSong(); // stop all tracks

      console.log('NOM ' +songName);

      var xhr = new XMLHttpRequest();
      xhr.open('GET', CONFIG.baseUrlApi +"/track/" + songName, true);
      xhr.onload = function(e) {

        var i = 0;
        var track = JSON.parse(this.response);
        track.instruments.forEach(function(instrument) {
          var url = CONFIG.baseUrlApi + "/track/" + songName + "/sound/" + instrument.sound;
          tracks.push(url);
          i++;
        });

        callback(track);

        // resize canvas depending on number of samples
        //resizeSampleCanvas(track.instruments.length);
        // var i = 0;

        loadAllSoundSamples(tracks,callbackFinishedLoading);
      };
      xhr.send();
    };


    //================================================================================
    //  ALL TRACKS MANAGE
    //================================================================================


    function playAllTracks(startTime) {
      console.log("ply= " + buffers.length);
      buildGraph(buffers);
      playFrom(startTime);
    }


    function pauseAllTracks() {
        // Then stop playing
        samples.forEach(function(s) {
          // destroy the nodes
          s.stop(0);
        });
        paused = true;
    }

    function pauseReplayAllTracks() {
        paused = false;
        //playFrom(elapsedTimeSinceStart);
        playAllTracks(elapsedTimeSinceStart);
    }


    function stopAllTracks() {
      samples.forEach(function(s) {
        // destroy the nodes
        s.stop(0);
      });
      elapsedTimeSinceStart = 0;
      paused = true;
    };



    return {

      init: function(callback){
        buffers = [];
        listsongs = init(callback);
      },

      playAT :function (b,startTime) {
        buffers = b;
        playAllTracks(startTime);
        console.log("plyAT= " + buffers.length);
        //return buffers;
      },

      pauseAT:  function (b) {
        buffers = b;
        console.log("pauAT= " + buffers.length);
        pauseAllTracks();
      },

      pauseReplayAllTracks : function(b) {
        buffers = b;
        pauseReplayAllTracks();
      },

      stopAT: function (b) {
        buffers = b;
        stopAllTracks();
        console.log("pauAT= " + buffers.length);
      },

      getAllTrackList : function(songName, callback, callbackFinishedLoading) {
        buffers = [];
        loadTrackList(songName, callback, callbackFinishedLoading);
        return buffers;
      },


      muteUnmuteTrack:  function (trackNumber) {
          // AThe mute / unmute button
        if (trackVolumeNodes[trackNumber].gain.value == 1) {
          trackVolumeNodes[trackNumber].gain.value = 0;
        } else {
          trackVolumeNodes[trackNumber].gain.value = 1;
        }
      },

      changeRS : function (num) {
        jumpTo2(num);
      },


      setGain : function (i,val) {
        setGain(i,val);
      },
      setMonoR : function (i,val) {
        setMonoR(i,val);
      },
      setMonoL : function (i,val) {
        setMonoL(i,val);
      },
      setFilterFrequency : function(i,val) {
        setFilterFrequency(i,val);
      }
      /**
       setMasterGain : function (val) {
        setMasterGain(val);
      },
       setMasterStereo : function (val) {
        setMasterStereo(val);
      },
       setCompressor : function(i){
        setCompressor(i);
      },

      setFilterDetune : function(i,val) {
        setFilterDetune(i,val);
      },
      setFilterQuality: function(i,val) {
        setFilterQ(i,val);
      },
      setFilterType : function(i,val) {
        setFilterType(i,val);
      }**/
    };


    function setGain(i , val) {
      var fraction = parseInt(masterVolumeSlider.value) / parseInt(masterVolumeSlider.max);
      // Let's use an x*x curve (x-squared) since simple linear (x) does not
      // sound as good.
      if( masterVolumeNode != undefined)
        masterVolumeNode.gain.value = fraction * fraction;
    }

    function setMonoL(i,val) {
      trackVolumeNodes[i].gain.value = val;
      console.log("volume "+trackVolumeNodes[i].gain.value);

    }

    function setMonoR(i,val) {
      trackVolumeNodesL[i].gain.value = val;
      console.log("volumeL "+trackVolumeNodes[i].gain.value);
    }

    function setFilterFrequency(i,val) {
      //filter[i].frequency.value = parseFloat(val);
      filter[i].gain.value = val;
      console.log("Freq "+filter[i].gain.value);
    }




    function setMasterGain(val) {
      var myL = gainNode.length;
      for(var i = 0; i < myL; i++){
        gainNode[i].gain.value = val;
      }
    };

    function setMasterStereo(val) {
      var myL = pannerNode.length;
      for(var i = 0; i < myL; i++){
        pannerNode[i].pan.value = val;
      }
    };


    function setFilterDetune(i,val) {
      filter[i].detune.value = parseFloat(val);
    }

    function setFilterQ(i,val) {
      filter[i].Q.value = parseFloat(val);
    }

    function setFilterType(i,val) {
      filter[i].type = val;
    }

    function setCompressor(i) {
      if(compressor[i]) {
        compressorNode[i].disconnect(context.destination);
        gainNode[i].disconnect(compressorNode[i]);
        gainNode[i].connect(context.destination);
      }  else {
        // compressor was off, we connect the gain to the compressor
        // and the compressor to the destination
        gainNode[i].disconnect(context.destination);
        gainNode[i].connect(compressorNode[i]);
        compressorNode[i].connect(context.destination);
      }
      compressor[i] = !compressor[i];
    };



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


    /*******************
     * *****************
     *      GRAPH
     * ******************
     ********************/

    var merger=[];
    var trackVolumeNodes= [];

    function buildGraph(bufferList) {
      var sources = [];
      trackVolumeNodes= [];
      trackVolumeNodesL= [];
      compressor=[];
      filter=[];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      masterSlideNode = context.createGain();
      //var leftDelay = context.createDelayNode();
      //var rightDelay = context.createDelayNode();
      samples = [];
      var b = bufferList.concat();
      var splitter =[];
      merger=[];
      console.log("in build graph, bufferList.size = " + bufferList.length);

      buffers.forEach(function(sample, i) {
        // each sound sample is the  source of a graph
        console.log("buffers "+i);
        sources[i] = context.createBufferSource();
        sources[i].buffer = sample;
        //var trackVolumeNodes2 = [];
        //trackVolumeNodes = trackVolumeNodes2;
        filter[i] = context.createBiquadFilter();
        filter[i].type = filter[i].LOWPASS;
        filter[i].frequency.value = 5000;
        //sources[i].connect(filter[i]);
        // connect each sound sample to a vomume node
        trackVolumeNodes[i] = context.createGain();
        trackVolumeNodesL[i] = context.createGain();
        compressor[i] = context.createDynamicsCompressor();
        analyser[i] = context.createAnalyser();
        // Connect the sound sample to its volume node

        //sources[i].connect(trackVolumeNodes[i]);
        merger[i] = context.createChannelMerger(2);

        splitter[i] = context.createChannelSplitter(2);
        //sources[i].connect(splitter[i],0,0);
        sources[i].connect(trackVolumeNodes[i]);
        sources[i].connect(trackVolumeNodesL[i]);
        sources[i].connect(analyser[i]);

        trackVolumeNodes[i].connect(merger[i], 0, 0);
        trackVolumeNodesL[i].connect(merger[i], 0, 1);
        sources[i].connect(merger[i]);
        //trackVolumeNodes[i].gain.value= -1;
        //trackVolumeNodesL[i].gain.value =0;
        //merger[i].connect(masterVolumeNode);
        analyser[i].connect(merger[i]);

        //sources[i].connect(compressor[i]);
        //merger[i].connect(compressor[i]);
        //compressor[i].connect(filter[i]);
        merger[i].connect(filter[i]);
        filter[i].connect(context.destination);
        //merger[i].connect(context.destination);
        // Connects all track volume nodes a single master volume node
        //trackVolumeNodes[i].connect(context.destination);
        //trackVolumeNodes[i].connect(masterVolumeNode);
        // Connect the master volume to the speakers
        //masterVolumeNode.connect(context.destination);
        //masterSlideNode.connect(context.destination);

        console.log('volume'+ trackVolumeNodes[i]);
        // On active les boutons start et stop
        samples = sources;
      });
      //source = context.createMediaElementSource(buffers[0]);
      //samples[0].connect(analyser);
      //analyser.connect(context.destination);
      console.log("in build graph, bufferList.size = " + buffers.length);
    }




    //** Load track list
    /**=========================**/

    function loadAllTrackList(songName, callback) {
      var tackList = loadTrackList(songName, callback);
      return trackList;
    }



    /*******************
     * *****************
     *      ANIMATION
     * ******************
     ********************/


    function animateTime() {
      if (!paused) {
        // Draw the time on the front canvas
        currentTime = context.currentTime;
        var delta = currentTime - lastTime;

        var totalTime;

        if (buffers[0] != undefined) {

          elapsedTimeSinceStart += delta;
          lastTime = currentTime;

          fbc_array = new Uint8Array(analyser[0].frequencyBinCount);
          analyser[0].getByteFrequencyData(fbc_array);
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




    // Same as previous one except that we not rebuild the graph. Useful for jumping from one
    // part of the song to another one, i.e. when we click the mouse on the sample graph
    function playFrom(startTime) {

      samples.forEach(function(s) {
      // First parameter is the delay before playing the sample
      // second one is the offset in the song, in seconds, can be 2.3456
        s.start(0, startTime);
      });

      // TODO : setMasterVolume();

      // Note : we memorise the current time, context.currentTime always
      // goes forward, it's a high precision timer
      lastTime = context.currentTime;
      paused = false;
    };




  });






/**

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

//}


/**


 function mix(bs) {
      /*if (buffer1.numberOfChannels != buffer2.numberOfChannels) {
       console.log("number of channels is not the same!");
       return null;
       }

       if (buffer1.sampleRate != buffer2.sampleRate) {
       console.log("sample rates don't match!");
       return null;
       }*/

/**
var lens = 0;
bs.forEach(function (s, i) {
  lens += s.length;
});
var len = bs[0].length;
var tmp = context.createBuffer(bs[0].numberOfChannels, len, bs[0].sampleRate);

for (var i = 0; i < tmp.numberOfChannels; i++) {
  var data = tmp.getChannelData(i);
  var cd, cds = [];
  cds = bs[0].getChannelData(i);
  if (bs.length > 1) {
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

**/
