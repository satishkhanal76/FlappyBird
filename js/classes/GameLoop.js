export class GameLoop {
  #interatable;

  #deltaTime;
  #lastTimeStamp;
  #frameCount;

  #accumulationCount = 0;
  #accumulation = 0;
  #averageFPS = 0;

  #isPaused = false;

  /**
   *
   * @param {any} interatable Any object that contains update method
   */
  constructor(interatable) {
    this.#interatable = interatable;
    this.#frameCount = 0;
  }

  #update(timestamp) {
    if (this.#isPaused) return;

    if (!this.#lastTimeStamp) {
      this.#lastTimeStamp = timestamp;
      window.requestAnimationFrame((t) => this.#update(t));
      return null;
    }

    this.#deltaTime = timestamp - this.#lastTimeStamp;

    this.#accumulation = this.#accumulation + this.getFPS();
    this.#accumulationCount = this.#accumulationCount + 1;
    this.#averageFPS = Math.floor(this.#accumulation / this.#accumulationCount);

    this.#interatable.update(this.#deltaTime);
    this.#frameCount = this.#frameCount + 1;

    this.#lastTimeStamp = timestamp;
    window.requestAnimationFrame((t) => this.#update(t));
  }

  pause() {
    this.#isPaused = true;
  }

  unPause() {
    this.#isPaused = false;
    window.requestAnimationFrame((t) => this.#update(t));
  }

  start() {
    window.requestAnimationFrame((t) => this.#update(t));
  }

  getDeltaTime() {
    return this.#deltaTime;
  }
  getFrameCount() {
    return this.#frameCount;
  }

  getFPS() {
    return 1000 / this.#deltaTime;
  }

  getAverageFPS() {
    return this.#averageFPS;
  }
}
