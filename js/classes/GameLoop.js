export class GameLoop {
    
    #interatable;

    #deltaTime;
    #lastTimeStamp;

    /**
     * 
     * @param {any} interatable Any object that contains update method
     */
    constructor(interatable) {
        this.#interatable = interatable;
    }

    #update(timestamp) {
        if(!this.#lastTimeStamp) {
            this.#lastTimeStamp = timestamp;
            window.requestAnimationFrame(t => this.#update(t));
            return null;
        }

        this.#deltaTime = timestamp - this.#lastTimeStamp;

        this.#interatable.update(this.#deltaTime);

        this.#lastTimeStamp = timestamp;
        window.requestAnimationFrame(t => this.#update(t));
        
    }

    start() {
        window.requestAnimationFrame(t => this.#update(t));
    }

    getDeltaTime() {
        return this.#deltaTime;
    }
}