export class PipeGUI {


    #pipe;

    constructor(pipe) {

        this.#pipe = pipe;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.rect(this.#pipe.getX(), this.#pipe.getY(), this.#pipe.getWidth(), this.#pipe.getHeight());
        ctx.fill();

    }

}