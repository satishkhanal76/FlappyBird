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

if (isTouchDevice()) {
  canvas.addEventListener("touchstart", (eve) => {
    gameGUI.clicked(eve);
  });
} else {
  document.body.addEventListener("keypress", (eve) => {
    gameGUI.keyPressed(eve);
  });

  canvas.addEventListener("click", (eve) => {
    if (!document.fullscreenElement) canvas.requestFullscreen();
  });
}
