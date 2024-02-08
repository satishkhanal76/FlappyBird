import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "./Bird.js";
import { Pipe } from "./Pipe.js";

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

  constructor(width, height) {
    this.#width = width;
    this.#height = height;

    this.#currentState = Game.STATES.START;

    this.createGameLoop();

    this.createBird();
    this.createPipes();
  }

  createPipes() {
    let pipePosition;
    let topPipe, bottomPipe;

    for (let i = 1; i <= 2; i++) {
      pipePosition = this.getNewPipePositions();

      pipePosition["topPipe"].x *= i;
      pipePosition["bottomPipe"].x *= i;

      topPipe = new Pipe();
      bottomPipe = new Pipe();
      this.setPipePosition(topPipe, bottomPipe, pipePosition);
      topPipe.setIsTopPipe(true);
      bottomPipe.setIsTopPipe(false);

      this.#pipes.push(topPipe, bottomPipe);
    }
  }

  setPipePosition(topPipe, bottomPipe, pipePosition) {
    let x, y, w, h;
    x = pipePosition["topPipe"].x;
    y = pipePosition["topPipe"].y;
    w = pipePosition["topPipe"].w;
    h = pipePosition["topPipe"].h;

    topPipe.setPosition(x, y, w, h);

    x = pipePosition["bottomPipe"].x;
    y = pipePosition["bottomPipe"].y;
    w = pipePosition["bottomPipe"].w;
    h = pipePosition["bottomPipe"].h;

    bottomPipe.setPosition(x, y, w, h);
  }

  getNewPipePositions() {
    let pipePosition = {};

    let verticalSpacing = this.#height / 3;
    let horizontalSpacing = this.#width / 2;
    let spacingStartPoint;

    let x, y, w, h;

    spacingStartPoint = this.getRandomNumber(0, this.#height - verticalSpacing);

    //top pipe
    x = horizontalSpacing + this.getRandomNumber(50, 100);
    y = 0;
    w = 50;
    h = spacingStartPoint;

    pipePosition["topPipe"] = {
      x,
      y,
      w,
      h,
    };

    //bottom pipe
    y = spacingStartPoint + verticalSpacing;
    h = this.#height - y;

    pipePosition["bottomPipe"] = {
      x,
      y,
      w,
      h,
    };
    return pipePosition;
  }

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  createGameLoop() {
    this.#gameLoop = new GameLoop(this);
    this.#gameLoop.start();
  }

  restart() {
    this.#currentState = Game.STATES.START;
    this.#pipes = [];
    this.#bird.unset();
    this.createPipes();
  }

  update(deltaTime) {
    this.#bird.update(this);
    this.#pipes.forEach((pipe) => pipe.update(this));

    if (this.#currentState !== Game.STATES.RUNNING) return;

    //check for game over conditions
    if (this.outOFBounds()) {
      this.setCurrentState(Game.STATES.OVER);
    }

    this.#pipes.forEach((pipe) => {
      if (this.cheats(this.#bird, pipe)) {
        this.setCurrentState(Game.STATES.OVER);
      }

      if (this.collide(this.#bird, pipe)) {
        this.setCurrentState(Game.STATES.OVER);
      }
      this.checkPipePos(pipe);
    });
  }

  checkPipePos(pipe) {
    let outOfBoundsPipes = this.#pipes.filter(
      (pipe) => pipe.getX() + pipe.getWidth() < 0
    );
    if (outOfBoundsPipes.length <= 0) return;
    let topPipe = outOfBoundsPipes[0];
    let bottomPipe = outOfBoundsPipes[1];

    let pipePosition = this.getNewPipePositions();

    pipePosition["topPipe"].x = this.getWidth();
    pipePosition["bottomPipe"].x = this.getWidth();

    this.setPipePosition(topPipe, bottomPipe, pipePosition);
  }

  outOFBounds() {
    return this.#bird.getY() > this.#height;
  }

  cheats(bird, pipe) {
    return (
      bird.getY() + bird.getRadius() < 0 &&
      bird.getX() > pipe.getX() &&
      bird.getX() - bird.getRadius() < pipe.getX() + pipe.getWidth()
    );
  }

  collide(bird, pipe) {
    let birdX, birdY, birdRadius, pipeX, pipeY, pipeWidth, pipeHeight;
    birdX = bird.getX();
    birdY = bird.getY();
    birdRadius = bird.getRadius();
    pipeX = pipe.getX();
    pipeY = pipe.getY();
    pipeWidth = pipe.getWidth();
    pipeHeight = pipe.getHeight();

    return (
      birdX + birdRadius > pipeX &&
      birdX - birdRadius < pipeX + pipeWidth &&
      birdY + birdRadius > pipeY &&
      birdY - birdRadius < pipeY + pipeHeight
    );
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
}
