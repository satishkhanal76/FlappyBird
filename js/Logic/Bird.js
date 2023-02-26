export class Bird {
    
    static STATES = {
        READY: "READY",
        FLAPPING: "FLAPPING",
        FALLING: "FALLING",
        DEAD: "DEAD"
    }

    static GRAVITY = 0.04;
    static FLAP_DURATION = 90;

    #initialX;
    #initialY;

    #x;
    #y;
    #radius;
    #flapForce;
    
    #yVelocity;

    #currentState


    constructor(x, y) {
        this.#initialX = x;
        this.#initialY = y;


        this.unset();
        

        this.#currentState = Bird.STATES.READY;

    }

    /**
     * Resets the states of the bird to defaults (initial state)
     */
    unset() {
        this.#x = this.#initialX;
        this.#y = this.#initialY;
        this.#yVelocity = 0;
        this.#flapForce = 0.13;
        this.#radius = 15;
    }

    update(deltaTime) {

        // make the bird fall
        if(this.#currentState === Bird.STATES.FALLING) {
            this.#yVelocity = this.#yVelocity + (Bird.GRAVITY * deltaTime);
        }
        
        if(this.#currentState === Bird.STATES.FLAPPING) {
            this.#yVelocity = this.#yVelocity - (this.#flapForce * deltaTime);
        }

        //if the bird is dead then just return
        if(this.#currentState === Bird.STATES.DEAD) return;
        
        if(this.#yVelocity >= 15) this.#yVelocity = 15;
        if(this.#yVelocity <= -15) this.#yVelocity = -15;
        
        this.#y = this.#y + this.#yVelocity;
    }

    flap() {
        if(this.#currentState !== Bird.STATES.FALLING) return;
        this.#currentState = Bird.STATES.FLAPPING;
        
        setTimeout(() => {this.#currentState = Bird.STATES.FALLING}, Bird.FLAP_DURATION);
    }


    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getYVelocity() {
        return this.#yVelocity;
    }

    getRadius() {
        return this.#radius;
    }

    getCurrentState() {
        return this.#currentState;
    }

    setCurrentState(state) {
        if(!Bird.STATES[state]) return;
        this.#currentState = state;
    }


}