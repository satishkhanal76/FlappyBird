import { GameLoop } from "../classes/GameLoop.js";
import DebugManager from "../debug/DebugManager.js";
import { Bird } from "../Logic/Bird.js";
import { Game } from "../Logic/Game.js";
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

  #debugManager;

  constructor(canvas, debugButton, debugElement) {
    this.#canvas = canvas;
    this.configureCanvas();

    this.#game = new Game(this.#canvas.width, this.#canvas.height);

    this.#guiLoop = new GameLoop(this);
    this.#guiLoop.start();
    this.restart();

    this.#debugManager = new DebugManager(debugButton, debugElement);

    this.#setUpDebugItems();
  }

  #setUpDebugItems() {
    this.#debugManager.addDebugItem({
      key: "gamestate",
      name: "Game State",
      value: this.#game.getCurrentState(),
    });

    this.#debugManager.addDebugItem({
      key: "birdstate",
      name: "Bird State",
      value: this.#game.getBird().getCurrentState(),
    });

    this.#debugManager.addDebugItem({
      key: "logicfps",
      name: "Game Logic FPS",
      value: this.#game.getGameLoop().getAverageFPS(),
    });

    this.#debugManager.addDebugItem({
      key: "guifps",
      name: "Game GUI FPS",
      value: this.#game.getGameLoop().getAverageFPS(),
    });

    this.#debugManager.addDebugItem({
      key: "points",
      name: "Points",
      value: this.#game.getPoints(),
    });

    this.#debugManager.addDebugItem({
      key: "pipespeed",
      name: "Pipe Speed",
      value: this.#game.getPoints(),
    });

    this.#debugManager.addDebugItem({
      key: "collisionrect",
      name: "Show Collision Area",
      value: this.#drawCollisionArea,
      clickable: true,
      callback: () => {
        this.#drawCollisionArea = !this.#drawCollisionArea;
        this.#debugManager.close();
      },
    });
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
      pipe.getPipes().forEach((p) => {
        let pipeGUI = p.isTopPipe()
          ? new PipeGUI(p, "./assets/toppipe.png")
          : new PipeGUI(p, "./assets/bottompipe.png");
        this.#guiPipes.push(pipeGUI);
      });
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

    if (this.#debugManager.isOpen()) {
      this.#debugManager.updateDebugItem(
        "gamestate",
        this.#game.getCurrentState()
      );

      this.#debugManager.updateDebugItem(
        "birdstate",
        this.#game.getBird().getCurrentState()
      );

      this.#debugManager.updateDebugItem(
        "logicfps",
        this.#game.getGameLoop().getAverageFPS()
      );

      this.#debugManager.updateDebugItem(
        "guifps",
        this.#guiLoop.getAverageFPS()
      );
      this.#debugManager.updateDebugItem("points", this.#game.getPoints());
      this.#debugManager.updateDebugItem(
        "pipespeed",
        this.#game.getCurrentPipeSpeed()
      );

      this.#debugManager.updateDebugItem(
        "collisionrect",
        this.#drawCollisionArea
      );
    }

    if (this.#game.getCurrentState() === Game.STATES.RUNNING) {
      this.#backgroundImageHandler.update();
    }

    this.#ctx.fillStyle = "#ffffff";
    this.#ctx.font = "30px Arial";
    this.#ctx.textAlign = "center";
    this.#ctx.strokeStyle = "black";
    this.#ctx.lineWidth = 3;

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
      this.#ctx.strokeText(`Points: ${this.#game.getPoints()}`, 100, 25);
      // this.#ctx.strokeText(
      //   `FPS: ${Math.floor(this.#game.getGameLoop().getAverageFPS())}`,
      //   100,
      //   55
      // );
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

      this.#ctx.strokeText(
        `Points: ${this.#game.getPoints()}`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3 + 80
      );
      this.#ctx.fillText(
        `Points: ${this.#game.getPoints()}`,
        this.#game.getWidth() / 2,
        this.#game.getHeight() / 3 + 80
      );
    }
  }

  keyPressed(eve) {
    if (eve.key !== " ") return;
    this.handleFlap();
  }

  clicked() {
    this.handleFlap();
  }

  handleFlap() {
    switch (this.#game.getCurrentState()) {
      case Game.STATES.START:
        this.#game.setCurrentState(Game.STATES.RUNNING);
        this.#game.getBird().setCurrentState(Bird.STATES.FALLING);
        break;

      case Game.STATES.RUNNING:
        this.#game.flapBird();
        break;
      case Game.STATES.OVER:
        this.restart();
        this.#game.setCurrentState(Game.STATES.START);
        break;
      default:
        break;
    }
  }

  configureCanvas() {
    let clientHeight = document.body.clientHeight || 400;
    let clientWidth = document.body.clientWidth || 250;

    let height = clientHeight;

    let width = (2 / 3) * height;

    if (width > clientWidth) width = clientWidth;

    let scale = 1;
    this.#canvas.style.width = width + "px";
    this.#canvas.style.height = height + "px";

    this.#canvas.width = width * scale;
    this.#canvas.height = height * scale;

    this.#ctx = this.#canvas.getContext("2d");
  }
}
