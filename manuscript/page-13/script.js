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
                offsetY: 0,
                lastX: 0,
                lastY: 0
              };
var windowLoaded = pen = false;
var dbase;
var pageRef = 'page-13';
var cdnWait = setInterval(dbLoad, 1000);

window.addEventListener("load", offsetCalcs, false);
window.addEventListener("resize", offsetCalcs, false);
canvas2.name.addEventListener("mousedown", penDown, false);
canvas2.name.addEventListener("mouseup", penUp, false);
canvas2.name.addEventListener("mousemove", getPen, false);
canvas2.name.addEventListener("touchstart", penDown, false);
canvas2.name.addEventListener("touchend", penUp, false);
canvas2.name.addEventListener("touchcancel", penUp, false);
canvas2.name.addEventListener("touchmove", getPen, false);

function drawButton(action) {
  var ctx = canvas1.ctx;
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
  var ctx = canvas1.ctx;
  var someNoise = document.getElementById(e.target.id);
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
  e.preventDefault();
  someNoise.addEventListener("timeupdate", progressMeter, false);
  if (e.targetTouches) {
    if (e.targetTouches.length == 1) {
      var touch = e.targetTouches.item(0);
      displayX = touch.pageX - canvas1.offsetX;
      displayY = touch.pageY - canvas1.offsetY;
    }
  } else {
    displayX = e.pageX - canvas1.offsetX;
    displayY = e.pageY - canvas1.offsetY;
  }
  var modelX = Math.round(displayX * (canvas1.name.width / (canvas1.name.offsetWidth - canvas1.styleBorderLeft * 2)));
  var modelY = Math.round(displayY * (canvas1.name.height / (canvas1.name.offsetHeight - canvas1.styleBorderTop * 2)));
  if ((someNoise.readyState >= 2) && (dist(modelX, modelY, 250, 250) <= 250)) {
    if ((someNoise.currentTime == 0) || (someNoise.paused)) {
      someNoise.play();
      drawButton('pause');
    } else {
      someNoise.pause();
      drawButton('play');
    }
  }
}

function offsetCalcs() {
  canvasOffset(canvas1);
  canvasOffset(canvas2);
  windowLoaded = true;
  drawButton('play');
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

function penDown(e) {
  if (windowLoaded) {
    e.preventDefault();
    pen = true;
    if (e.targetTouches) {
      if (e.targetTouches.length == 1) {
        getPen(e);
      }
    } else {
      getPen(e);
    }
  }
}

function penUp(e) {
  e.preventDefault();
  pen = false;
  canvas2.lastX = canvas2.lastY = 0;
}

function getPen(e) {
  if (windowLoaded) {
    e.preventDefault();
    var displayX, displayY;
    if (e.targetTouches) {
      if (e.targetTouches.length == 1) {
        var touch = e.targetTouches.item(0);
        displayX = touch.pageX - canvas2.offsetX;
        displayY = touch.pageY - canvas2.offsetY;
      }
    } else {
      displayX = e.pageX - canvas2.offsetX;
      displayY = e.pageY - canvas2.offsetY;
    }
    if (pen) {
      drawSomething(displayX, displayY);
    }
  }
}

function drawSomething(displayX, displayY) {
  var modelX = Math.round(displayX * (canvas2.name.width / (canvas2.name.offsetWidth - canvas2.styleBorderLeft * 2)));
  var modelY = Math.round(displayY * (canvas2.name.height / (canvas2.name.offsetHeight - canvas2.styleBorderTop * 2)));
  var ctx = canvas2.ctx;
  ctx.lineWidth = "30";
  ctx.lineCap="round";
  if ((canvas2.lastX == 0) && (canvas2.lastY == 0)) {
    ctx.beginPath();
    ctx.arc(modelX,modelY,15,0,2*Math.PI);
    ctx.fill();
    canvas2.lastX = modelX;
    canvas2.lastY = modelY;
  } else {
    if (dist(canvas2.lastX, canvas2.lastY, modelX, modelY) > 20) {
      ctx.beginPath();
      ctx.moveTo(canvas2.lastX, canvas2.lastY);
      ctx.lineTo(modelX, modelY);
      ctx.stroke();
      canvas2.lastX = modelX;
      canvas2.lastY = modelY;
    }
  }
}

function dist(a, b, c, d) {
  return Math.sqrt(Math.pow((a-c),2) + Math.pow((b-d),2));
}

function clearCanvas(canvasId) {
  if (windowLoaded) {
    var ctx = canvas2.ctx;
    var button = document.getElementById("button2");
    button.style.opacity = "0.6";
    button.style.cursor = "not-allowed";
    ctx.clearRect(0,0,canvas2.name.width,canvas2.name.height);
    saveCanvas(canvasId);
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}

function dbLoad(){
  if ((dbase = localforage.createInstance({name: "ant-and-dove"})) && (windowLoaded)) {
    var ctx = canvas2.ctx;
    clearInterval(cdnWait);
    dbase.getItem(pageRef + 'canvas2', function(err, imgData){
      if (imgData) {
        ctx.putImageData(imgData, 0, 0);
      }
    });
    var button2 = document.getElementById("button2");
    var button3 = document.getElementById("button3");
    button2.style.opacity = "1";
    button2.style.cursor = "pointer";
    button3.style.opacity = "1";
    button3.style.cursor = "pointer";
  }
}

function saveCanvas(canvasId) {
  if (windowLoaded) {
    var ctx = canvas2.ctx;
    var button2 = document.getElementById("button2");
    var button3 = document.getElementById("button3");
    if (button2.style.opacity = "1") {
      button3.style.opacity = "0.6";
      button3.style.cursor = "not-allowed";
    }
    var canvasPx = ctx.getImageData(0, 0, canvas2.name.width, canvas2.name.height);
    dbase.setItem(pageRef + canvasId, canvasPx, function() {
    });
    button3.style.opacity = "1";
    button3.style.cursor = "pointer";
  }
}
