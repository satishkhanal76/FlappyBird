export default class Background {
  #x;
  #y;
  #width;
  #height;
  #image;

  constructor(x, y, width, height, imageUrl) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
    this.#image = new Image();
    this.#image.src = imageUrl;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.drawImage(this.#image, this.#x, this.#y, this.#width, this.#height);
    ctx.fill();
  }

  update() {
    this.#x = this.#x - 2;
  }

  setX(x) {
    this.#x = x;
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
