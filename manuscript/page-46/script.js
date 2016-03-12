var canvas, canvasDiv, dbase, video, track;
/*var constraints = {audio: false, video: {width: 800, height: 600}};*/
var constraints = {audio: false, video: true};
var pageRef = 'page-46';
var cdnWait = setInterval(dbLoad, 1000);

navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

if ((MediaStreamTrack) && (MediaStreamTrack.getSources)) {
  MediaStreamTrack.getSources(mediaHardware);
} else {
  constraints.video.facingMode = "environment";
};

function mediaHardware(mediaList) {
  var videoList = [];
  var n = 0;
  for (var i = 0; i < mediaList.length; ++i) {
    if (mediaList[i].kind == 'video') {
      videoList[n] = [mediaList[i].facing, mediaList[i].id];
      ++n;
    }
  }
  for (var i = 0; i < videoList.length; ++i) {
    if (videoList[i][0] == 'environment') {
      constraints.video.sourceId = videoList[i][1];
    }
  }
  if ((!constraints.video.sourceId) && (videoList.length > 0)) {
    constraints.video.sourceId = videoList[0][1];
  }
}

function dbLoad(){
  if ((dbase = localforage.createInstance({name: "ant-and-dove"})) && (document.readyState === 'complete')) {
    clearInterval(cdnWait);
    /*dbase.getItem(pageRef + 'canvas1', function(err, imgData){
      if (imgData) {
        canvas = document.getElementById('canvas1');
        canvas.height = Math.round(canvas.width*3/4);
        canvas.getContext('2d').putImageData(imgData, 0, 0);
      }
    });*/
  }
}

function snap(canvasDivId, canvasId) {
  canvas = document.getElementById(canvasId);
  canvasDiv = document.getElementById(canvasDivId);
  /*canvas.height = Math.round(canvas.width*3/4);*/
  console.log('Canvas w h: ', canvas.width, canvas.height);
  console.log('Video w h: ', video.width, video.height);
  canvasDiv.style.zIndex = "1";
  canvas.getContext('2d').drawImage(video, 0, 0, 800, 600);
  track.stop();
  var canvasPx = canvas.getContext("2d").getImageData(0, 0, 800, 600);
  /*dbase.setItem(pageRef + canvasId, canvasPx, function() {
  });*/
}

function grabVideo(canvasDivId, canvasId, videoId) {
  if(navigator.getMedia) {
    canvas = document.getElementById(canvasId);
    window.URL = (window.URL || window.webkitURL);
    canvasDiv = document.getElementById(canvasDivId);
    video = document.getElementById(videoId);
    navigator.getMedia(constraints,
      function (stream) {
        if (navigator.webkitGetUserMedia) {
          if (window.URL) {
            video.src = window.URL.createObjectURL(stream);
          } else {
            video.src = stream;
          }
        } else {
          video.srcObject = stream;
        }
        track = stream.getTracks()[0];
        canvasDiv.style.zIndex = "-1";
        video.play();
        console.log('Canvas w h: ', canvas.width, canvas.height);
        console.log('Video w h: ', video.width, video.height);
      },
      function (error) {
        console.log('navigator.getUserMedia error: ', error);
      }
    );
    /*video.play();*/
  }
}

function playAudio(id) {
  var someNoise = document.getElementById(id);
    someNoise.play();
}

function pauseAudio(id) {
  var someNoise = document.getElementById(id);
    someNoise.pause();
}
