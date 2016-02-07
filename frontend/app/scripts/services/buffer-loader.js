'use strict';

function BufferLoader(context, urlList,callback, callbackFinishedLoading) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.finishedLoading = callbackFinishedLoading;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url,index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.responseType = "arraybuffer";
  var loader = this;
  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        console.log("In bufferLoader.onload bufferList size is " + loader.bufferList.length + " index =" + index);
        $( "#progressbar" ).progressbar( "option", "value", loader.loadCount+1 );
        $( '#songID' ).html(loader.urlList[loader.loadCount].substring(22));
        if (++loader.loadCount == loader.urlList.length){
          loader.onload(loader.bufferList, loader.finishedLoading);
        }
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onprogress = function(e) {
    //console.log("loaded : " + e.loaded + " total : " + e.total);
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  // M.BUFFA added these two lines.
  this.bufferList = new Array();
  this.loadCount = 0;
  console.log("BufferLoader.prototype.load urlList size = " + this.urlList.length);
  for (var i = 0; i < this.urlList.length; ++i){
    this.loadBuffer(this.urlList[i], i);
  }
};

