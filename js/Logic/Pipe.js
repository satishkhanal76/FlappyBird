import { Game } from "./Game.js";

export class Pipe {
  #x;
  #y;
  #width;
  #height;

  #isTopPipe = true;

  constructor(x, y, w, h) {
    this.setPosition(x, y, w, h);
  }

  setIsTopPipe(isTopPipe) {
    this.#isTopPipe = isTopPipe;
  }

  isTopPipe(isTopPipe) {
    return this.#isTopPipe;
  }

  setPosition(x, y, w, h) {
    this.#x = x;
    this.#y = y;
    this.#width = w;
    this.#height = h;
  }

  update(game) {
    if (game.getCurrentState() !== Game.STATES.RUNNING) return;
    let deltatime = game.getDeltaTime();
    this.#x = this.#x - 0.1 * deltatime;
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }
}
