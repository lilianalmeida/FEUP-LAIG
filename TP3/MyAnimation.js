/**
 * MyAnimation
 * @constructor
 * @param id - Animation id
 */
class MyAnimation {
    constructor(id) {
        this.id = id;
        this.terminated = false;
    }
    /**
     * Updates animation state according to time passed
     */
    update(deltaTime) { }

    /**
     * Applies transformation to transformations matrix of the scene when needed
     */
    apply() { }
}

