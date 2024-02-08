import { GameGUI } from "./Client/GameGUI.js";

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const canvas = document.getElementById("game-canvas");

const gameGUI = new GameGUI(canvas);

const body = document.body;

body.addEventListener("keypress", (eve) => {
  gameGUI.keyPressed(eve);
});

body.addEventListener("touchstart", (eve) => {
  gameGUI.clicked(eve);
});

canvas.addEventListener("click", () => {
  canvas.requestFullscreen();
});
