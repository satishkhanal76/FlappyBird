export class PipeGUI {
  #pipe;

  #image;

  constructor(pipe, imageUrl) {
    this.#pipe = pipe;

    this.#image = new Image();
    this.#image.src = imageUrl;
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.fillStyle = "#ffffff";
    // ctx.rect(
    //   this.#pipe.getX(),
    //   this.#pipe.getY(),
    //   this.#pipe.getWidth(),
    //   this.#pipe.getHeight()
    // );
    // ctx.fill();

    ctx.drawImage(
      this.#image,
      this.#pipe.getX(),
      this.#pipe.getY(),
      this.#pipe.getWidth(),
      this.#pipe.getHeight()
    );
  }

  showCollisionArea(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.#pipe.getX(),
      this.#pipe.getY(),
      this.#pipe.getWidth(),
      this.#pipe.getHeight()
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}
