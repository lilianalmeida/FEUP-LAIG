var DEGREE_TO_RAD = Math.PI / 180;

/**
 *  class, representing a circular animation.
 */
class MyArcAnimation extends MyAnimation {
    /**
     * @constructor
     */
    constructor(animationId, time, center,radius,startang,rotang) {
        super(animationId);
        this.time = time;
        this.x_center = center[0];
        this.y_center = center[1];
        this.z_center = center[2];
        this.radius = radius;
        this.startang = startang * DEGREE_TO_RAD;
        this.rotang = rotang * DEGREE_TO_RAD;
        this.initAnimation();
    }

    /**
     * Inits the animation
     */
    initAnimation(){
    
        if(this.rotang > 0){
            this.direction = 1;
        }
        else{
            this.direction = -1;
        }

        this.elapsedTime = 0; 
        this.elapsedAngle = this.startang;

    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime){
        this.elapsedTime += deltaTime;
        this.elapsedAngle = (this.elapsedTime/this.time)*this.rotang;
        

        if(this.direction*this.elapsedAngle >= this.direction*this.rotang){
            this.terminated = true;
        }

        this.elapsedAngle += this.startang;
    }

    /**
     * Returns the transformation matrix of the animation
     */
    apply(){
        var transform = mat4.create();
        mat4.identity(transform);

        mat4.translate(transform, transform, [this.x_center,this.y_center,this.z_center]);
        mat4.rotate(transform, transform, this.elapsedAngle, [0, 1, 0]);

        mat4.translate(transform,transform,[this.radius,0,0]);

        if(this.direction == 1){
            mat4.rotate(transform,transform,Math.PI,[0,1,0]);
        }
        return transform;
    }

    applyPieces(arcVec, angVec){
        var transform = mat4.create();
        mat4.identity(transform);

        mat4.translate(transform, transform, [this.x_center,this.y_center,this.z_center]);

        mat4.rotate(transform, transform, this.elapsedAngle, arcVec);

        mat4.translate(transform,transform,[this.radius*Math.cos(angVec),0,-this.radius*Math.sin(angVec)]);

        
        if(this.direction == 1){
            mat4.rotate(transform,transform,Math.PI,arcVec);
        }
        

        let outVec = [transform[12], transform[13], transform[14]];
        return outVec;
    }

}