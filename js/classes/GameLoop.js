export class GameLoop {
    
    #interatable;

    #deltaTime;
    #lastTimeStamp;
    #frameCount;

    /**
     * 
     * @param {any} interatable Any object that contains update method
     */
    constructor(interatable) {
        this.#interatable = interatable;
        this.#frameCount = 0;
    }

    #update(timestamp) {
        if(!this.#lastTimeStamp) {
            this.#lastTimeStamp = timestamp;
            window.requestAnimationFrame(t => this.#update(t));
            return null;
        }

        this.#deltaTime = timestamp - this.#lastTimeStamp;

        this.#interatable.update(this.#deltaTime);
        this.#frameCount = this.#frameCount + 1;

        this.#lastTimeStamp = timestamp;
        window.requestAnimationFrame(t => this.#update(t));
        
    }

    start() {
        window.requestAnimationFrame(t => this.#update(t));
    }

    getDeltaTime() {
        return this.#deltaTime;
    }
    getFrameCount() {
        return this.#frameCount;
    }
}