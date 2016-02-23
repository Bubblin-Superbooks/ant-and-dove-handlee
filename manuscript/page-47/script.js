var canvas, canvasDiv, dbase, video, track;

navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

var cdnWait = setInterval(dbLoad, 3000);
var pageRef = 'page-47';

function dbLoad(){
  if (dbase = localforage.createInstance({name: "ant-and-dove"})){
    clearInterval(cdnWait);
    dbase.getItem(pageRef + 'canvas1', function(err, imgData){
      if (imgData) {
        canvas = document.getElementById('canvas1');
        canvas.height = Math.round(canvas.width*3/4);
        canvas.getContext('2d').putImageData(imgData, 0, 0);
      }
    });
    dbase.getItem(pageRef + 'canvas2', function(err, imgData){
      if (imgData) {
        canvas = document.getElementById('canvas2');
        canvas.height = Math.round(canvas.width*3/4);
        canvas.getContext('2d').putImageData(imgData, 0, 0);
      }
    });
  }
}

function snap(canvasDivId, canvasId) {
  canvas = document.getElementById(canvasId);
  canvasDiv = document.getElementById(canvasDivId);
  canvas.height = Math.round(canvas.width*3/4);
  canvasDiv.style.zIndex = "1";
  canvas.getContext('2d').
    drawImage(video, 0, 0, canvas.width, canvas.height);
  track.stop();
  var canvasPx = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  dbase.setItem(pageRef + canvasId, canvasPx, function() {
  });
}

function successCallback(stream) {
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
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function grabVideo(canvasDivId, canvasId, videoId) {
  if(navigator.getMedia) {
    canvas = document.getElementById(canvasId);
    var constraints = {audio: false, video: {width: canvas.width, height: Math.round(canvas.width*3/4), facingMode: "environment"}};
    canvasDiv = document.getElementById(canvasDivId);
    video = document.getElementById(videoId);
    navigator.getMedia(constraints, successCallback, errorCallback);
  }
}
