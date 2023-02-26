export class BirdGUI {

    #game;

    #bird;

    constructor(game) {
        this.#game = game;

        this.#bird = this.#game.getBird();
    }


    draw(ctx) {
        // console.log(this.#bird)
        ctx.beginPath();
        ctx.arc(this.#bird.getX(), this.#bird.getY(), this.#bird.getRadius(), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();


    }

}