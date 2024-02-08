import { Game } from "./Game.js";

export class Bird {
  static STATES = {
    READY: "READY",
    FLAPPING: "FLAPPING",
    FALLING: "FALLING",
    DEAD: "DEAD",
  };

  static GRAVITY = 0.04;

  #initialX;
  #initialY;

  #x;
  #y;
  #radius;
  #flapForce = 0.15;

  #yVelocity;

  #currentState;

  #flapUntilFrame = null;

  constructor(x, y) {
    this.#initialX = x;
    this.#initialY = y;

    this.unset();

    this.#currentState = Bird.STATES.READY;
  }

  /**
   * Resets the states of the bird to defaults (initial state)
   */
  unset() {
    this.#x = this.#initialX;
    this.#y = this.#initialY;
    this.#yVelocity = 0;
    this.#flapForce = 0.15;
    this.#radius = 18;
  }

  update(game) {
    let deltatime = game.getDeltaTime();

    if (game.getCurrentState() === Game.STATES.OVER) {
      this.#currentState = Bird.STATES.DEAD;
    }

    //if the bird is dead then just return
    if (this.#currentState === Bird.STATES.DEAD) return;

    // make the bird fall
    if (this.#currentState === Bird.STATES.FALLING) {
      this.#yVelocity = this.#yVelocity + Bird.GRAVITY * deltatime;
    } else if (this.#currentState === Bird.STATES.FLAPPING) {
      this.#yVelocity = this.#yVelocity - this.#flapForce * deltatime;
    }

    if (
      this.#flapUntilFrame &&
      game.getGameLoop().getFrameCount() > this.#flapUntilFrame
    ) {
      this.#flapUntilFrame = null;
      this.#currentState = Bird.STATES.FALLING;
    }

    if (this.#yVelocity >= 15) this.#yVelocity = 15;
    if (this.#yVelocity <= -15) this.#yVelocity = -15;

    this.#y = this.#y + this.#yVelocity;
  }

  flap(game) {
    if (this.#currentState !== Bird.STATES.FALLING) return;

    this.#currentState = Bird.STATES.FLAPPING;

    let gameLoop = game.getGameLoop();
    let frameCount = gameLoop.getFrameCount();
    let deltaTime = gameLoop.getDeltaTime();

    // console.log(frameCount, flapUntil);
    this.#flapUntilFrame = Math.floor(frameCount + deltaTime / 3);

    // setTimeout(() => {
    //   alert("HELLO");
    //   this.#currentState = Bird.STATES.FALLING;
    // }, 200);
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getYVelocity() {
    return this.#yVelocity;
  }

  getRadius() {
    return this.#radius;
  }

  getCurrentState() {
    return this.#currentState;
  }

  setCurrentState(state) {
    if (!Bird.STATES[state]) return;
    this.#currentState = state;
  }

  getFlapUntil() {
    return this.#flapUntilFrame;
  }
}
