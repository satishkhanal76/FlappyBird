import { Bird } from "../Logic/Bird.js";

export class BirdGUI {
  #bird;
  #rotation;

  #rotationVel;

  #image;

  constructor(bird) {
    this.#bird = bird;
    this.#rotation = 0;
    this.#rotationVel = 0;

    this.#image = new Image();
    this.#image.src = "./assets/flappybird.png";
  }

  draw(ctx) {
    // console.log(this.#bird)
    // ctx.beginPath();
    // ctx.arc(
    //   this.#bird.getX(),
    //   this.#bird.getY(),
    //   this.#bird.getRadius(),
    //   0,
    //   2 * Math.PI,
    //   false
    // );
    // ctx.fillStyle = "green";
    // ctx.fill();

    this.#rotation = this.#bird.getYVelocity() * 5;
    //move the origin to the centre of the bird
    ctx.translate(this.#bird.getX(), this.#bird.getY());

    ctx.rotate((this.#rotation * Math.PI) / 180);
    ctx.drawImage(
      this.#image,
      -this.#bird.getRadius(),
      -this.#bird.getRadius(),
      this.#bird.getRadius() * 2,
      this.#bird.getRadius() * 2
    );

    ctx.rotate(-(this.#rotation * Math.PI) / 180);
    ctx.translate(-this.#bird.getX(), -this.#bird.getY());
  }

  showCollisionArea(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.#bird.getX(),
      this.#bird.getY(),
      this.#bird.getRadius(),
      0,
      2 * Math.PI,
      false
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}
