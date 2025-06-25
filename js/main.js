import { GameGUI } from "./Client/GameGUI.js";

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const debugButton = document.getElementById("debug-button");
const debugMenuElement = document.getElementById("debug-menu");

const canvas = document.getElementById("game-canvas");

const gameGUI = new GameGUI(canvas, debugButton, debugMenuElement);

const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

function goFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) { // Safari
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // IE11
    element.msRequestFullscreen();
  } else {
    console.log("Fullscreen API is not supported.");
  }
}

if (isTouchDevice()) {
  canvas.addEventListener("touchstart", (eve) => {
    goFullscreen(canvas);
    gameGUI.clicked(eve);
  });
} else {
  document.body.addEventListener("keypress", (eve) => {
    goFullscreen(canvas);
    gameGUI.keyPressed(eve);
  });
}

