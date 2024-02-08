import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "../Logic/Bird.js";
import { Game } from "../Logic/Game.js";
import Background from "./Background.js";
import BackgroundHandler from "./BackgroundHandler.js";
import { BirdGUI } from "./BirdGUI.js";
import { PipeGUI } from "./PipeGUI.js";

export class GameGUI {
  #canvas;

  #ctx;

  #game;

  #guiLoop;

  #guiBird;

  #guiPipes = [];

  #backgroundImageHandler;

  #drawCollisionArea = false;
  #drawObjects = true;

  constructor(canvas) {
    this.#canvas = canvas;
    this.configureCanvas();

    this.#game = new Game(this.#canvas.width, this.#canvas.height);

    this.#guiLoop = new GameLoop(this);
    this.#guiLoop.start();
    this.restart();
  }

  restart() {
    this.#game.restart();

    this.#guiPipes = [];

    this.createBackgroundImage();
    this.createBirdGUI();
    this.createPipesGUI();
  }

  createBirdGUI() {
    this.#guiBird = new BirdGUI(this.#game.getBird());
  }

  createPipesGUI() {
    this.#game.getPipes().forEach((pipe) => {
      let pipeGUI = pipe.isTopPipe()
        ? new PipeGUI(pipe, "./assets/toppipe.png")
        : new PipeGUI(pipe, "./assets/bottompipe.png");
      this.#guiPipes.push(pipeGUI);
    });
  }

  createBackgroundImage() {
    this.#backgroundImageHandler = new BackgroundHandler(
      this.#game.getWidth(),
      this.#game.getHeight()
    );
  }

  update() {
    //clear the background
    this.#ctx.fillStyle = "#000000";
    this.#ctx.rect(0, 0, this.#game.getWidth(), this.#game.getHeight());
    this.#ctx.fill();

    this.#backgroundImageHandler.draw(this.#ctx);

    //draw the pipes
    this.#guiPipes.forEach((pipe) => {
      if (this.#drawObjects) pipe.draw(this.#ctx);
      if (this.#drawCollisionArea) pipe.showCollisionArea(this.#ctx);
    });

    //draw the bird
    if (this.#drawObjects) this.#guiBird.draw(this.#ctx);
    if (this.#drawCollisionArea) this.#guiBird.showCollisionArea(this.#ctx);

    if (this.#game.getCurrentState() === Game.STATES.RUNNING) {
      this.#backgroundImageHandler.update();
    }

    this.#ctx.fillStyle = "#ffffff";
    this.#ctx.font = "30px Arial";
    this.#ctx.textAlign = "center";
    this.#ctx.strokeStyle = "black";
    this.#ctx.lineWidth = 5;

    if (this.#game.getCurrentState() === Game.STATES.START) {
      this.#ctx.strokeText(
        `"SPACE" TO BEGIN`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3
      );
      this.#ctx.fillText(
        `"SPACE" TO BEGIN`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3
      );
    }

    if (this.#game.getCurrentState() === Game.STATES.RUNNING) {
      this.#ctx.strokeText(
        `FPS: ${Math.round(this.#game.getGameLoop().getAverageFPS())}`,
        100,
        45
      );
      // this.#ctx.fillText(`Delta Time: ${this.#game.getDeltaTime()}`, 100, 45);
    }

    if (this.#game.getCurrentState() === Game.STATES.OVER) {
      this.#ctx.strokeText(
        `GAME OVER`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3
      );
      this.#ctx.fillText(
        `GAME OVER`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3
      );

      this.#ctx.strokeText(
        `Press "Space" to Restart!`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3 + 40
      );
      this.#ctx.fillText(
        `Press "Space" to Restart!`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3 + 40
      );
    }
  }

  keyPressed(eve) {
    if (this.#game.getCurrentState() === Game.STATES.OVER) {
      this.restart();
    }

    if (eve.key !== " ") return;

    if (this.#game.getCurrentState() === Game.STATES.START) {
      this.#game.setCurrentState(Game.STATES.RUNNING);
      this.#game.getBird().setCurrentState(Bird.STATES.FALLING);
      return;
    }

    this.#game.getBird().flap(this.#game);
  }

  clicked() {
    if (this.#game.getCurrentState() === Game.STATES.OVER) {
      this.restart();
    }

    if (this.#game.getCurrentState() === Game.STATES.START) {
      this.#game.setCurrentState(Game.STATES.RUNNING);
      this.#game.getBird().setCurrentState(Bird.STATES.FALLING);
      return;
    }
    this.#game.getBird().flap(this.#game);
  }

  configureCanvas() {
    let clientHeight = document.body.clientHeight || 400;

    let height = clientHeight;

    let width = (2 / 3) * height;

    let scale = 1;
    this.#canvas.style.width = width + "px";
    this.#canvas.style.height = height + "px";

    this.#canvas.width = width * scale;
    this.#canvas.height = height * scale;

    this.#ctx = this.#canvas.getContext("2d");
  }
}
