import Background from "./Background.js";

export default class BackgroundHandler {
  #backgroundImages = [];

  constructor(width, height) {
    this.#backgroundImages.push(
      new Background(0, 0, width, height, "./assets/flappybirdbg.png"),
      new Background(width, 0, width, height, "./assets/flappybirdbg.png")
    );
  }

  update(gameGUI) {
    let background1 = this.#backgroundImages[0];
    let background2 = this.#backgroundImages[1];

    if (background1.getX() + background1.getWidth() <= 0) {
      let newX = background2.getX() + background2.getWidth();
      background1.setX(newX);
    }

    if (background2.getX() + background2.getWidth() <= 0) {
      let newX = background1.getX() + background1.getWidth();
      background2.setX(newX);
    }

    background1.update(gameGUI);
    background2.update(gameGUI);
  }

  draw(ctx) {
    this.#backgroundImages.forEach((image) => image.draw(ctx));
  }
}
