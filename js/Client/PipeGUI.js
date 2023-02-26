export class PipeGUI {

    #game;

    #pipe;

    constructor(game) {
        this.#game = game;

        this.#pipe = this.#game.getPipe();
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(this.#pipe.getX(), this.#pipe.getY(), this.#pipe.getWidth(), this.#pipe.getHeight());
        ctx.fill();

    }

}