import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "../Logic/Bird.js";
import { Game } from "../Logic/Game.js";
import { BirdGUI } from "./BirdGUI.js";
import { PipeGUI } from "./PipeGUI.js";

export class GameGUI {

    #canvas;

    #ctx;

    #game;

    #guiLoop;


    #guiBird;

    #guiPipes = [];

    constructor(canvas) {
        
        this.#canvas = canvas;
        this.configureCanvas();

        
        this.#game = new Game(this.#canvas.width, this.#canvas.height);
        
        this.#guiLoop = new GameLoop(this);
        this.#guiLoop.start();
        


        this.createBirdGUI();
        this.createPipesGUI();
        
    }

    createBirdGUI() {
        this.#guiBird = new BirdGUI(this.#game.getBird());
    }

    createPipesGUI() {
        this.#game.getPipes().forEach(pipe => {
            this.#guiPipes.push(new PipeGUI(pipe));
        });
    }

    update() {
        //clear the background
        this.#ctx.fillStyle = "#000000";
        this.#ctx.rect(0, 0, this.#game.getWidth(), this.#game.getHeight());
        this.#ctx.fill();
        
        //draw the bird
        this.#guiBird.draw(this.#ctx);

        //draw the pipes
        this.#guiPipes.forEach(pipe => pipe.draw(this.#ctx));
        
        this.#ctx.fillStyle = "#ffffff";
        this.#ctx.font = "30px Arial";
        this.#ctx.textAlign = "center";
        this.#ctx.strokeStyle = "black";
        this.#ctx.lineWidth = 5;

        if(this.#game.getCurrentState() === Game.STATES.START) {
            this.#ctx.strokeText(`"SPACE" TO BEGIN`, this.#game.getWidth() / 2, this.#game.getHeight() / 3);
            this.#ctx.fillText(`"SPACE" TO BEGIN`, this.#game.getWidth() / 2, this.#game.getHeight() / 3);
        }
        if(this.#game.getCurrentState() === Game.STATES.OVER) {
            this.#ctx.strokeText(`GAME OVER`, this.#game.getWidth() / 2, this.#game.getHeight() / 3);
            this.#ctx.fillText(`GAME OVER`, this.#game.getWidth() / 2, this.#game.getHeight() / 3);
        }
        
        
    }

    keyPressed(eve) {

        if(this.#game.getCurrentState() === Game.STATES.OVER) {
            this.#game.restart();
        }

        
        if(eve.key !== ' ') return;
        
        if(this.#game.getCurrentState() === Game.STATES.START) {
            this.#game.setCurrentState(Game.STATES.RUNNING);
            this.#game.getBird().setCurrentState(Bird.STATES.FALLING);
            return;
        }
        
        this.#game.getBird().flap();
        
        
    }

    clicked() {
        this.#game.getBird().flap();

        
        if(this.#game.getCurrentState() === Game.STATES.OVER) {
            this.#game.restart();
        }
        
        if(this.#game.getCurrentState() === Game.STATES.START) {
            this.#game.setCurrentState(Game.STATES.RUNNING);
            this.#game.getBird().setCurrentState(Bird.STATES.FALLING);
            return;
        }
        
    }

    configureCanvas() {
        let clientHeight = document.body.clientHeight || 400;
        
        let height = clientHeight;

        let width = (2 / 3) * height;

        let scale = 1;
        this.#canvas.style.width = width + 'px';
        this.#canvas.style.height = height + 'px';

        this.#canvas.width = width * scale;
        this.#canvas.height = height * scale;

        
        this.#ctx = this.#canvas.getContext("2d");
    }
}