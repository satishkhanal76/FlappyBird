export class Bird {
  static STATES = {
    READY: "READY",
    FLAPPING: "FLAPPING",
    FALLING: "FALLING",
    DEAD: "DEAD",
  };

  static GRAVITY = 0.05;

  #initialX;
  #initialY;

  #x;
  #y;
  #radius;
  #flapForce;

  #yVelocity;

  #currentState;

  #flapUntilFrame = null;

  #flapTime; //in  milliseconds

  constructor(x, y) {
    this.#initialX = x;
    this.#initialY = y;

    this.unset();
    this.#radius = 18;
    this.#flapForce = 0.3;
    this.#flapTime = 80;

    this.#currentState = Bird.STATES.READY;
  }

  /**
   * Resets the states of the bird to defaults (initial state)
   */
  unset() {
    this.#x = this.#initialX;
    this.#y = this.#initialY;
    this.#yVelocity = 0;
  }

  update(game) {
    //if the bird is dead then just return
    if (this.#currentState === Bird.STATES.DEAD) return;

    let deltatime = game.getDeltaTime();

    // make the bird fall
    if (this.#currentState === Bird.STATES.FALLING) {
      this.#yVelocity = this.#yVelocity + Bird.GRAVITY * deltatime;
    }

    if (this.#currentState === Bird.STATES.FLAPPING) {
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
    if (this.#yVelocity <= -10) this.#yVelocity = -10;

    this.#y = this.#y + this.#yVelocity;
  }

  flap(game) {
    if (this.#currentState === Bird.STATES.FLAPPING) return;

    let gameLoop = game.getGameLoop();
    let frameCount = gameLoop.getFrameCount();

    let numOfFramesToFlap = gameLoop.getAverageFPS() * (this.#flapTime / 1000);
    this.#flapUntilFrame = frameCount + Math.floor(numOfFramesToFlap);

    this.#currentState = Bird.STATES.FLAPPING;
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  setY(y) {
    this.#y = y;
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

  setRadius(radius) {
    this.#radius = radius;
  }

  getFlapTime() {
    return this.#flapTime;
  }

  setFlapTime(flaptime) {
    this.#flapTime = flaptime;
  }

  getFlapForce() {
    return this.#flapForce;
  }

  setFlapForce(newForce) {
    return (this.#flapForce = newForce);
  }
}
