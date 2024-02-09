export default class DebugManager {
  #debugMenus;

  #debugElement;
  #debugButton;

  #isOpen = false;
  constructor(debugButton, debugElement) {
    this.#debugButton = debugButton;
    this.#debugElement = debugElement;
    this.#debugMenus = new Map();

    this.#addEvenListeners();
  }

  #addEvenListeners() {
    this.#debugButton.addEventListener("click", () => {
      if (this.#debugElement.style.display === "block") {
        this.#debugElement.style.display = "none";
        this.#isOpen = false;
      } else {
        this.#debugElement.style.display = "block";
        this.#isOpen = true;
      }
    });
  }

  isOpen() {
    return this.#isOpen;
  }

  /**
   * Item: {
   * key: "", //used to update the value
   * value: "", // used in debug element
   * name: "", //used in debug element
   * element: DOMElement
   * }
   */

  /**
   *
   * @param {Object} item
   */
  addDebugItem(item) {
    let debugItem = {
      ...item,
    };
    const itemDivElement = this.#createDivElement(item);
    debugItem["element"] = itemDivElement;

    this.#updateTextNode(debugItem);
    this.#debugMenus.set(item.key, debugItem);

    this.#debugElement.appendChild(itemDivElement);
  }

  #createDivElement(item) {
    const itemDiv = document.createElement("div");
    itemDiv.setAttribute("data-debug-name", item.name);

    const textNode = document.createTextNode(item.value);

    itemDiv.appendChild(textNode);

    return itemDiv;
  }

  #updateTextNode(item) {
    const textNode = item["element"].childNodes[0];
    textNode.textContent = `${item["name"]}: ${item["value"]}`;
  }

  updateDebugItem(key, value) {
    const debugItem = this.#debugMenus.get(key);
    if (!debugItem) {
      console.error(`Debug item with the key of ${key} doesnot exist!`);
      return;
    }

    debugItem["value"] = value;

    this.#updateTextNode(debugItem);
  }
}
