import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "./Bird.js";
import { Pipe } from "./Pipe.js";
import PipePair from "./PipePair.js";
import { getRandomNumber } from "../main.js";

export class Game {
  static STATES = {
    START: "START",
    RUNNING: "RUNNING",
    OVER: "OVER",
  };

  #gameLoop;

  #currentState;

  #width;
  #height;

  #bird;

  #pipes = [];

  #points = 0;

  constructor(width, height) {
    this.#width = width;
    this.#height = height;

    this.#currentState = Game.STATES.START;

    this.createGameLoop();

    this.createBird();
    this.createPipes();
  }

  createPipes() {
    let pipeWidth = 80;
    let minimumGap = this.#width + pipeWidth;

    let pipePair;
    let x;

    let distanceFromPrevious = 0;

    for (let i = 1; i <= 2; i++) {
      x = distanceFromPrevious + this.#width / 2;
      pipePair = new PipePair(x, this.#height / 3, pipeWidth, this.#height);
      distanceFromPrevious += x + pipeWidth;
      this.#pipes.push(pipePair);
    }
  }

  createGameLoop() {
    this.#gameLoop = new GameLoop(this);
    this.#gameLoop.start();
  }

  restart() {
    this.#currentState = Game.STATES.START;
    this.#pipes = [];
    this.#points = 0;
    this.#bird.unset();
    this.createPipes();
  }

  update(deltaTime) {
    this.#bird.update(this);
    this.#pipes.forEach((pipe) => pipe.update(this));

    //check for game over conditions
    if (this.birdOutOfBounds()) {
      this.setCurrentState(Game.STATES.OVER);
      this.#bird.setCurrentState(Bird.STATES.DEAD);
      this.#bird.setY(this.#height);
    }

    if (this.#currentState !== Game.STATES.RUNNING) return;

    this.#pipes.forEach((pipe) => {
      if (pipe.birdGoesOverPipe(this.#bird)) {
        this.setCurrentState(Game.STATES.OVER);
      }

      if (pipe.collides(this.#bird)) {
        this.setCurrentState(Game.STATES.OVER);
      }

      if (pipe.eligibileForPoints(this.#bird)) {
        this.#points = this.#points + 1;
      }

      pipe.checkPipePos();
    });
    // this.checkPipePos();
  }

  /**
   * checks if the bird is at the bottom
   * @returns true if the bird has crash landed
   */
  birdOutOfBounds() {
    return this.#bird.getY() > this.#height;
  }

  flapBird() {
    if (this.#currentState === Game.STATES.OVER) return null;
    this.#bird.flap(this);
  }

  createBird() {
    this.#bird = new Bird(50, this.#height / 2);
  }

  getBird() {
    return this.#bird;
  }

  getPipes() {
    return this.#pipes;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  getCurrentState() {
    return this.#currentState;
  }

  setCurrentState(state) {
    if (!Game.STATES[state]) return;
    this.#currentState = state;
  }

  getDeltaTime() {
    return this.#gameLoop.getDeltaTime();
  }

  getGameLoop() {
    return this.#gameLoop;
  }

  getPoints() {
    return this.#points;
  }
}
