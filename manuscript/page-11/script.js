var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var windowLoaded = pen = false;
var styleBorderLeft, styleBorderTop;
var offsetX = offsetY = displayX = displayY = lastX = lastY = 0;
var dbase;
var pageRef = 'page-11';
var cdnWait = setInterval(dbLoad, 1000);

function playAudio(id) {
  var someNoise = document.getElementById(id);
    someNoise.play();
}

function pauseAudio(id) {
  var someNoise = document.getElementById(id);
    someNoise.pause();
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
  windowLoaded = true;
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
  lastX = lastY = 0;
}

function getPen(e) {
  if (windowLoaded) {
    e.preventDefault();
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
    if (pen) {
      drawSomething();
    }
  }
}

function drawSomething() {
  var modelX = Math.round(displayX * (canvas.width / (canvas.offsetWidth - styleBorderLeft * 2)));
  var modelY = Math.round(displayY * (canvas.height / (canvas.offsetHeight - styleBorderTop * 2)));
  ctx.lineWidth = "30";
  ctx.lineCap="round";
  if ((lastX == 0) && (lastY == 0)) {
    ctx.beginPath();
    ctx.arc(modelX,modelY,15,0,2*Math.PI);
    ctx.fill();
    lastX = modelX;
    lastY = modelY;
  } else {
    if (dist(lastX, lastY, modelX, modelY) > 20) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(modelX, modelY);
      ctx.stroke();
      lastX = modelX;
      lastY = modelY;
    }
  }
}

function dist(a, b, c, d) {
  return Math.sqrt(Math.pow((a-c),2) + Math.pow((b-d),2));
}

function clearCanvas(canvasId) {
  if (windowLoaded) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    saveCanvas(canvasId);
  }
}

function dbLoad(){
  if ((dbase = localforage.createInstance({name: "ant-and-dove"})) && (windowLoaded)) {
    clearInterval(cdnWait);
    dbase.getItem(pageRef + 'canvas1', function(err, imgData){
      if (imgData) {
        ctx.putImageData(imgData, 0, 0);
      }
    });
  }
}

function saveCanvas(canvasId) {
  if (windowLoaded) {
    var canvasPx = ctx.getImageData(0, 0, canvas.width, canvas.height);
    dbase.setItem(pageRef + canvasId, canvasPx, function() {
    });
  }
}

window.addEventListener("load", offsetCalcs, false);
window.addEventListener("resize", offsetCalcs, false);
canvas.addEventListener("mousedown", penDown, false);
canvas.addEventListener("mouseup", penUp, false);
canvas.addEventListener("mousemove", getPen, false);
canvas.addEventListener("touchstart", penDown, false);
canvas.addEventListener("touchend", penUp, false);
canvas.addEventListener("touchcancel", penUp, false);
canvas.addEventListener("touchmove", getPen, false);
