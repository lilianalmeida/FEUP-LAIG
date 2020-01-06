/**
 *  class, representing a circular animation.
 */
class MyArcAnimation extends MyAnimation {
    /**
     * @constructor
     */
    constructor(animationId, time, center, radius, startAngle, stepAngle) {
        super(animationId);
        this.terminated = false;
        this.time = time;
        this.x_center = center[0];
        this.y_center = center[1];
        this.z_center = center[2];
        this.radius = radius;
        this.startAngle = startAngle * Math.PI / 180;
        this.stepAngle = stepAngle * Math.PI / 180;
        this.initAnimation();
    }

    /**
     * Inits the animation
     */
    initAnimation() {


        this.elapsedTime = 0;
        this.elapsedAngle = this.startAngle;

    }

    resetAnimation() {
        this.elapsedTime = 0;
        this.elapsedAngle = this.startAngle;
        this.terminated = false;
    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime) {
        this.elapsedTime += deltaTime;
        this.elapsedAngle = (this.elapsedTime / this.time) * this.stepAngle;

        if (this.elapsedAngle >=  this.stepAngle) {
            this.terminated = true;
        }

        this.elapsedAngle += this.startAngle;
    }

    /**
     * Returns the transformation matrix of the animation.
     * The function 'setUpAnimation' must be done before calling this function.
     */
    apply() {
        var transform = mat4.create();
        mat4.identity(transform);

        mat4.translate(transform, transform, [this.x_center, this.y_center, this.z_center]);

        mat4.rotate(transform, transform, this.elapsedAngle, this.arcVec);

        mat4.translate(transform, transform, [this.radius * Math.cos(this.angVec), 0, -this.radius * Math.sin(this.angVec)]);


            mat4.rotate(transform, transform, this.stepAngle, this.arcVec);
  

        let outVec = [transform[12], transform[13], transform[14]];
        return outVec;
    }

    setUpAnimation(arcVec, angVec) {
        this.arcVec = arcVec,
            this.angVec = angVec
    }

}