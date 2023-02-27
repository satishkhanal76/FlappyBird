export class BirdGUI {


    #bird;

    constructor(bird) {

        this.#bird = bird;
    }


    draw(ctx) {
        // console.log(this.#bird)
        ctx.beginPath();
        ctx.arc(this.#bird.getX(), this.#bird.getY(), this.#bird.getRadius(), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();


    }

}