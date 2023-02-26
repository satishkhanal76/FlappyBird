import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "./Bird.js";

export class Game {

    static STATES = {
        START: "START",
        RUNNING: "RUNNING",
        OVER: "OVER"
    };

    #gameLoop;

    #currentState;

    #width;
    #height;

    #bird;


    constructor(width, height) {

        this.#width = width;
        this.#height = height;

        this.#currentState = Game.STATES.START;

        this.createGameLoop();

        this.createBird();
    }


    createGameLoop() {
        this.#gameLoop = new GameLoop(this);
        this.#gameLoop.start();
    }

    restart() {
        this.#currentState = Game.STATES.START;
        this.#bird.unset();
    }

    update(deltaTime) {
        this.#bird.update(deltaTime);
        
        if(this.#currentState == Game.STATES.RUNNING) {
            this.checkForOver();
        };
    }

    checkForOver() {
        //bird goes below means game over
        let birdBody = this.#bird.getY();

        if(birdBody > this.#height) {
            this.#currentState = Game.STATES.OVER;
            this.#bird.setCurrentState(Bird.STATES.DEAD);
        }
        
    }

    createBird() {
        this.#bird = new Bird(20, this.#height / 2);
    }

    getBird() {
        return this.#bird;
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
        if(!Game.STATES[state]) return;
        this.#currentState = state;
    }

    getDeltaTime() {
        return this.#gameLoop.getDeltaTime();
    }

}