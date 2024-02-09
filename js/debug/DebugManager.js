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

    this.#debugElement.style.display == "none"
      ? (this.#isOpen = false)
      : (this.#isOpen = true);

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

  close() {
    this.#isOpen = false;

    this.#debugElement.style.display = "none";
  }

  open() {
    this.#isOpen = true;

    this.#debugElement.style.display = "flex";
  }

  #addEvenListeners() {
    this.#debugButton.addEventListener("click", () => {
      if (this.#isOpen) {
        this.close();
      } else {
        this.open();
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
   * changable: false,
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
      changable: item.changable || false,
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
    itemDiv.classList.add("debug-item");

    const textNode = document.createTextNode(item.value);
    itemDiv.appendChild(textNode);

    if (item["clickable"]) {
      itemDiv.classList.add("clickable");
      itemDiv.addEventListener("click", item["callback"]);
    }

    if (item["changable"]) {
      itemDiv.classList.add("changable");
      let inputElement = document.createElement("input");
      inputElement.value = item["value"];
      inputElement.addEventListener("change", (eve) => {
        item["callback"](eve.target.value, (overridenValue) => {
          item.value = overridenValue;
          inputElement.value = item["value"];
        });
        eve.target.blur();
      });
      inputElement.classList.add("input-field");
      itemDiv.appendChild(inputElement);
    }

    return itemDiv;
  }

  #updateTextNode(item) {
    const textNode = item["element"].childNodes[0];
    if (item["changable"]) {
      textNode.textContent = `${item["name"]}:`;
    } else {
      textNode.textContent = `${item["name"]}: ${item["value"]}`;
    }
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
