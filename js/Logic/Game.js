import { GameLoop } from "../classes/GameLoop.js";
import { Bird } from "./Bird.js";
import { Pipe } from "./Pipe.js";

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

    #pipe;


    constructor(width, height) {

        this.#width = width;
        this.#height = height;

        this.#currentState = Game.STATES.START;

        this.createGameLoop();

        this.createBird();
        this.createPipe();
    }

    createPipe() {
        this.#pipe = new Pipe(this.#width / 2, 0, 50, 200);
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
        this.#bird.update(this);
        this.#pipe.update(this);
        
        if(this.#currentState !== Game.STATES.RUNNING) return;


        //check for game over conditions
        if(this.outOFBounds()) {
            this.setCurrentState(Game.STATES.OVER);
        }

        if(this.cheats(this.#bird, this.#pipe)) {
            this.setCurrentState(Game.STATES.OVER);
        }

        if(this.collide(this.#bird, this.#pipe)) {
            this.setCurrentState(Game.STATES.OVER);
        }
    }

    outOFBounds() {
        return (this.#bird.getY() > this.#height);
    }

    cheats(bird, pipe) {
        return ((bird.getY() + bird.getRadius() < 0) && 
                (bird.getX() > pipe.getX()) && 
                (bird.getX() - bird.getRadius() < pipe.getX() + pipe.getWidth()));
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

        return ((birdX + birdRadius > pipeX) && 
                (birdX - birdRadius < pipeX + pipeWidth) &&
                (birdY + birdRadius > pipeY) &&
                (birdY - birdRadius < pipeY + pipeHeight));
    }

    createBird() {
        this.#bird = new Bird(20, this.#height / 2);
    }

    getBird() {
        return this.#bird;
    }

    getPipe() {
        return this.#pipe;
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