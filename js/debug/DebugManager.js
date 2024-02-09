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

    this.#addDebugTitle();
  }

  #addDebugTitle() {
    this.addDebugItem({
      key: "debugtitle",
      name: "Debug Menu",
      value: "",
    });
    let debugTitleElement = this.#debugMenus.get("debugtitle");
    debugTitleElement["element"].setAttribute("class", "debug-title");
  }

  #addEvenListeners() {
    this.#debugButton.addEventListener("click", () => {
      if (this.#debugElement.style.display === "flex") {
        this.#debugElement.style.display = "none";
        this.#isOpen = false;
      } else {
        this.#debugElement.style.display = "flex";
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
   * cickable: false,
   * callback: () => {}
   * }
   */

  /**
   *
   * @param {Object} item
   */
  addDebugItem(item) {
    let debugItem = {
      ...item,
      clickable: item.clickable || false,
    };
    const itemDivElement = this.#createDivElement(item);
    debugItem["element"] = itemDivElement;

    this.#updateTextNode(debugItem);
    this.#debugMenus.set(item.key, debugItem);

    this.#debugElement.appendChild(itemDivElement);
  }

  #createDivElement(item) {
    const itemDiv = document.createElement("div");
    if (item["clickable"]) {
      itemDiv.classList.add("clickable");
      itemDiv.addEventListener("click", item["callback"]);
    }

    itemDiv.setAttribute("data-debug-name", item.name);
    itemDiv.classList.add("debug-item");

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
