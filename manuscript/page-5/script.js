var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext("2d");
var someNoise, styleBorderLeft, styleBorderTop;
var offsetX = offsetY = displayX = displayY = 0;
var noise1 = document.getElementById("noise1");

window.addEventListener("load", offsetCalcs, false);
window.addEventListener("resize", offsetCalcs, false);
noise1.addEventListener("ended", playEnded, false);

function playEnded(e) {
  drawButton('play');
}

function drawButton(action) {
  ctx.font="140px ABeeZee";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  if (action == 'play') {
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.arc(250,250,250,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("play",250,250);
  } else {
    ctx.fillStyle = "#ff1a1a";
    ctx.beginPath();
    ctx.arc(250,250,250,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("pause",250,250);
  }
}

function progressMeter(e) {
  var progress;
  ctx.lineWidth = "30";
  progress = someNoise.currentTime/someNoise.duration*2*Math.PI - 0.5*Math.PI;
  ctx.strokeStyle="#4dd2ff";
  ctx.beginPath();
  ctx.arc(250,250,235,1.5*Math.PI,progress);
  ctx.stroke();
}

function offsetCalcs() {
  var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
  var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
  styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
  styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
  var html = document.body.parentNode;
  var htmlTop = html.offsetTop;
  var htmlLeft = html.offsetLeft;
  var element = canvas;
  offsetX = offsetY = 0;
  if (element.offsetParent !== undefined) {
      do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
  }
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;
  drawButton('play');
}

function dist(a, b, c, d) {
  return Math.sqrt(Math.pow((a-c),2) + Math.pow((b-d),2));
}

function playAudio(e, id) {
  e.preventDefault();
  someNoise = document.getElementById(id);
  someNoise.addEventListener("timeupdate", progressMeter, false);
  if (e.targetTouches) {
    if (e.targetTouches.length == 1) {
      var touch = e.targetTouches.item(0);
      displayX = touch.pageX - offsetX;
      displayY = touch.pageY - offsetY;
    }
  } else {
    displayX = e.pageX - offsetX;
    displayY = e.pageY - offsetY;
  }
  var modelX = Math.round(displayX * (canvas.width / (canvas.offsetWidth - styleBorderLeft * 2)));
  var modelY = Math.round(displayY * (canvas.height / (canvas.offsetHeight - styleBorderTop * 2)));
  if ((someNoise.readyState >= 2) && (dist(modelX, modelY, 250, 250) <= 250)) {
    if ((someNoise.currentTime == 0) || (someNoise.paused)) {
      drawButton('pause');
      someNoise.play();
    } else {
      drawButton('play');
      someNoise.pause();
    }
  }
}
