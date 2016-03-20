var canvas1 = { name: document.getElementById("canvas1"),
                ctx: document.getElementById("canvas1").getContext("2d"),
                styleBorderLeft: 0,
                styleBorderTop: 0,
                offsetX: 0,
                offsetY: 0
              };
var canvas2 = { name: document.getElementById("canvas2"),
                ctx: document.getElementById("canvas2").getContext("2d"),
                styleBorderLeft: 0,
                styleBorderTop: 0,
                offsetX: 0,
                offsetY: 0
              };
var noise1 = document.getElementById("noise1");
var noise2 = document.getElementById("noise2");

window.addEventListener("load", offsetCalcs, false);
window.addEventListener("resize", offsetCalcs, false);
noise1.addEventListener("timeupdate", progressMeter, false);
noise2.addEventListener("timeupdate", progressMeter, false);
noise1.addEventListener("ended", playEnded, false);
noise2.addEventListener("ended", playEnded, false);

function drawButton(canvas, action) {
  var ctx = canvas.ctx;
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

function playEnded(e) {
  if (e.target.id == "noise1") {
    drawButton(canvas1, 'play');
  } else {
    drawButton(canvas2, 'play');
  }
}

function progressMeter(e) {
  if (e.target.id == "noise1") {
    var ctx = canvas1.ctx;
  } else {
    var ctx = canvas2.ctx;
  }
  var someNoise = e.target;
  var progress;
  ctx.lineWidth = "30";
  progress = someNoise.currentTime/someNoise.duration*2*Math.PI - 0.5*Math.PI;
  ctx.strokeStyle="#4dd2ff";
  ctx.beginPath();
  ctx.arc(250,250,235,1.5*Math.PI,progress);
  ctx.stroke();
}

function playAudio(e, id) {
  var displayX, displayY;
  var someNoise = document.getElementById(id);
  var canvas;
  if (canvas1.name.id == e.target.id) {
    canvas = canvas1;
  } else {
    canvas = canvas2;
  }
  e.preventDefault();
  if (e.targetTouches) {
    if (e.targetTouches.length == 1) {
      var touch = e.targetTouches.item(0);
      displayX = touch.pageX - canvas.offsetX;
      displayY = touch.pageY - canvas.offsetY;
    }
  } else {
    displayX = e.pageX - canvas.offsetX;
    displayY = e.pageY - canvas.offsetY;
  }
  var modelX = Math.round(displayX * (canvas.name.width / (canvas.name.offsetWidth - canvas.styleBorderLeft * 2)));
  var modelY = Math.round(displayY * (canvas.name.height / (canvas.name.offsetHeight - canvas.styleBorderTop * 2)));
  if ((someNoise.readyState >= 2) && (dist(modelX, modelY, 250, 250) <= 250)) {
    if ((someNoise.currentTime == 0) || (someNoise.paused)) {
      drawButton(canvas, 'pause');
      someNoise.play();
    } else {
      drawButton(canvas, 'play');
      someNoise.pause();
    }
  }
}

function offsetCalcs() {
  canvasOffset(canvas1);
  canvasOffset(canvas2);
  drawButton(canvas1, 'play');
  drawButton(canvas2, 'play');
}

function canvasOffset(canvas) {
  var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas.name, null)['paddingLeft'], 10) || 0;
  var stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas.name, null)['paddingTop'], 10) || 0;
  var styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas.name, null)['borderLeftWidth'], 10) || 0;
  var styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas.name, null)['borderTopWidth'], 10) || 0;
  var html = document.body.parentNode;
  var htmlTop = html.offsetTop;
  var htmlLeft = html.offsetLeft;
  var element = canvas.name;
  var offsetX = offsetY = 0;
  if (element.offsetParent !== undefined) {
      do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
  }
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;
  canvas.styleBorderLeft = styleBorderLeft;
  canvas.styleBorderTop = styleBorderTop;
  canvas.offsetX = offsetX;
  canvas.offsetY = offsetY;
}

function dist(a, b, c, d) {
  return Math.sqrt(Math.pow((a-c),2) + Math.pow((b-d),2));
}
