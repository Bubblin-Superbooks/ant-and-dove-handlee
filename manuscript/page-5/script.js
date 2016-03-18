function playAudio(audioId, buttonId) {
  var someNoise = document.getElementById(audioId);
  var button = document.getElementById(buttonId);
  if (button.innerHTML == "Play") {
    someNoise.play();
    button.innerHTML = "Pause";
    button.style.backgroundColor = "#ff1a1a";
  } else {
    someNoise.pause();
    button.innerHTML = "Play";
    button.style.backgroundColor = "#4CAF50";
  }
}
