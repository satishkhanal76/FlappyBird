import { Game } from "./Game.js";

export class Pipe {
  #x;
  #y;
  #width;
  #height;

  #speed = 0.2; //speed changes as game points increases so this is initial speed

  #isTopPipe = true;

  constructor(x, y, w, h) {
    this.setPosition(x, y, w, h);
  }

  setIsTopPipe(isTopPipe) {
    this.#isTopPipe = isTopPipe;
  }

  isTopPipe() {
    return this.#isTopPipe;
  }

  setPosition(x, y, w, h) {
    this.#x = x;
    this.#y = y;
    this.#width = w;
    this.#height = h;
  }

  setWidth(width) {
    this.#width = width;
  }

  setSpeed(speed) {
    this.#speed = speed;
  }

  update(game) {
    if (game.getCurrentState() !== Game.STATES.RUNNING) return;
    let deltatime = game.getDeltaTime();
    this.#x = this.#x - this.#speed * deltatime;
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
