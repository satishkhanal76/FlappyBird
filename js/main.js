import { GameGUI } from "./Client/GameGUI.js";

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const debugButton = document.getElementById("debug-button");
const debugMenuElement = document.getElementById("debug-menu");

const canvas = document.getElementById("game-canvas");

const gameGUI = new GameGUI(canvas, debugButton, debugMenuElement);

const body = document.body;

body.addEventListener("keypress", (eve) => {
  gameGUI.keyPressed(eve);
});

canvas.addEventListener("touchstart", (eve) => {
  if (!document.fullscreenElement) return;
  gameGUI.clicked(eve);
});

canvas.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  }
  // canvas.style.height = "100%";
});

document.body.addEventListener("fullscreenchange", (eve) => {
  if (!document.fullscreenElement) {
    // canvas.style.width = "100%";
  }
});
