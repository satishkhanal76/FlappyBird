import { Game } from "./Game.js";

export class Pipe {

    #x;
    #y;
    #width;
    #height;


    constructor(x, y, w, h) {
        this.#x = x;
        this.#y = y;
        this.#width = w;
        this.#height = h;
    }


    update(game) {
        if(game.getCurrentState() !== Game.STATES.RUNNING) return; 
        let deltatime = game.getDeltaTime();
        this.#x = this.#x - (0.09 * deltatime);
    }


    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }
}