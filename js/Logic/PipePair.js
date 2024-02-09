import { Pipe } from "./Pipe.js";
import { getRandomNumber } from "../main.js";
export default class PipePair {
  #topPipe;
  #bottomPipe;

  #x;
  #verticalSpacing;
  #width;
  #gameHeight;

  #pointsReceived = false;
  #minOffset = 0;

  constructor(x, spacing, width, gameHeight, minOffset = 0) {
    this.#x = x;
    this.#verticalSpacing = spacing;

    this.#width = width;
    this.#gameHeight = gameHeight;

    this.#minOffset = minOffset;

    this.#topPipe = new Pipe();
    this.#bottomPipe = new Pipe();

    this.#topPipe.setIsTopPipe(true);
    this.#bottomPipe.setIsTopPipe(false);
    this.setNewPipePositions();
  }

  setNewPipePositions() {
    let spacingStartPoint;

    let x, y, w, h;

    spacingStartPoint = getRandomNumber(
      0,
      this.#gameHeight - this.#verticalSpacing
    );

    //top pipe
    x = this.#x + this.#minOffset;
    y = 0;
    w = this.#width;
    h = spacingStartPoint;

    this.#topPipe.setPosition(x, y, w, h);

    //bottom pipe
    y = spacingStartPoint + this.#verticalSpacing;
    h = this.#gameHeight - y;

    this.#bottomPipe.setPosition(x, y, w, h);
  }

  update(game) {
    this.setPipeSpeed(game.getCurrentPipeSpeed());

    this.#topPipe.update(game);
    this.#bottomPipe.update(game);

    this.checkPipePos(game);
  }

  checkPipePos(game) {
    let outOfBoundsPipes = [this.#topPipe, this.#bottomPipe].filter(
      (pipe) => pipe.getX() + pipe.getWidth() < 0
    );

    if (outOfBoundsPipes.length <= 0) return;
    //reset pipe position because the pipes are out of the frame
    this.#pointsReceived = false;
    this.#x = game.getWidth() + this.#minOffset;
    this.setNewPipePositions();
  }

  setX(x) {
    this.#x = x;
    this.#topPipe.setPosition();
  }

  setPipeSpeed(speed) {
    this.#topPipe.setSpeed(speed);
    this.#bottomPipe.setSpeed(speed);
  }

  collides(bird) {
    return [this.#topPipe, this.#bottomPipe].some((pipe) =>
      this.collidesWithAPipe(bird, pipe)
    );
  }

  eligibileForPoints(bird) {
    if (this.#pointsReceived) return false;
    let passes =
      this.#topPipe.getX() + this.#width / 2 <= bird.getX() + bird.getRadius();
    if (passes) this.#pointsReceived = true;

    return passes;
  }

  birdGoesOverPipe(bird) {
    return (
      bird.getY() + bird.getRadius() < 0 &&
      bird.getX() > this.#topPipe.getX() &&
      bird.getX() - bird.getRadius() <
        this.#topPipe.getX() + this.#topPipe.getWidth()
    );
  }

  collidesWithAPipe(bird, pipe) {
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

  getPipes() {
    return [this.#topPipe, this.#bottomPipe];
  }

  hasReceivedPoints() {
    return this.#pointsReceived;
  }
}
