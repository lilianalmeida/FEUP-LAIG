/**
 * MyKeyframeAnimation
 * @constructor
 * 
 */
class MyKeyframeAnimation extends MyAnimation {
    constructor(id, keyframes) {
        super(id);
        this.keyframes = keyframes;
        this.elapsedTime = 0;
        this.maxKeyframe = 0;
        this.maxKeyframeIndex = 0;
        this.scaling = [1,1,1];
        this.initAnimation();
    }
    initAnimation() {
        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.keyframes[i].instant > this.maxKeyframe) {
                this.maxKeyframe = this.keyframes[i].instant;
                this.maxKeyframeIndex = i;
            }
        }
    }
    update(deltaTime) {
        this.elapsedTime += deltaTime;
        var minIndex = 0;
        var maxIndex = 0;
        var max = 10000000;
        var min = 0;
        this.animMatrix = mat4.create();

        //console.log("Elapsed " + this.elapsedTime);

        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.keyframes[i].instant < this.elapsedTime) {
                if (this.keyframes[i].instant >= min) {
                    min = this.keyframes[i].instant;
                    minIndex = i;
                }
            } else if (this.keyframes[i].instant > this.elapsedTime) {
                if (this.keyframes[i].instant <= max) {
                    max = this.keyframes[i].instant;
                    maxIndex = i;
                }
            } else if (this.keyframes[i].instant == this.elapsedTime) {
                this.animMatrix = mat4.translate(this.animMatrix, this.animMatrix, this.keyframes[i].translate);
                this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[i].rotation[0], [1, 0, 0]);
                this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[i].rotation[1], [0, 1, 0]);
                this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[i].rotation[2], [0, 0, 1]);
                this.animMatrix = mat4.scale(this.animMatrix, this.animMatrix, this.keyframes[i].scale);
                return;
            }
        }

        //console.log("max = " + max);
        //console.log("min = " + min);

        // End of animation
        if (this.elapsedTime > this.maxKeyframe) {
            this.animMatrix = mat4.translate(this.animMatrix, this.animMatrix, this.keyframes[this.maxKeyframeIndex].translate);
            this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[this.maxKeyframeIndex].rotation[0], [1, 0, 0]);
            this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[this.maxKeyframeIndex].rotation[1], [0, 1, 0]);
            this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, this.keyframes[this.maxKeyframeIndex].rotation[2], [0, 0, 1]);
            this.animMatrix = mat4.scale(this.animMatrix, this.animMatrix, this.keyframes[this.maxKeyframeIndex].scale);
            return;
        }

        var delta = (this.keyframes[maxIndex].instant - this.keyframes[minIndex].instant);

        // Translate
        // (initialTime - keyFrame.min.instant) * delta_translate /  delta
        var translation = [];
        translation[0] = this.keyframes[minIndex].translate[0] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].translate[0] - this.keyframes[minIndex].translate[0]) / delta;
        translation[1] = this.keyframes[minIndex].translate[1] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].translate[1] - this.keyframes[minIndex].translate[1]) / delta;
        translation[2] = this.keyframes[minIndex].translate[2] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].translate[2] - this.keyframes[minIndex].translate[2]) / delta;
        this.animMatrix = mat4.translate(this.animMatrix, this.animMatrix, translation);

        // Rotation
        var rotation = [];
        rotation[0] = this.keyframes[minIndex].rotation[0] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].rotation[0] - this.keyframes[minIndex].rotation[0]) / delta;
        rotation[1] = this.keyframes[minIndex].rotation[1] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].rotation[1] - this.keyframes[minIndex].rotation[1]) / delta;
        rotation[2] = this.keyframes[minIndex].rotation[2] + (this.elapsedTime - this.keyframes[minIndex].instant) * (this.keyframes[maxIndex].rotation[2] - this.keyframes[minIndex].rotation[2]) / delta;
        this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, rotation[0], [1, 0, 0]);
        this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, rotation[1], [0, 1, 0]);
        this.animMatrix = mat4.rotate(this.animMatrix, this.animMatrix, rotation[2], [0, 0, 1]);

        //  Scale
        var ratioX = Math.pow(this.keyframes[maxIndex].scale[0] / this.keyframes[minIndex].scale[0], 1 / ((this.keyframes[maxIndex].instant- this.keyframes[minIndex].instant)/(1/60)));
        var ratioY = Math.pow(this.keyframes[maxIndex].scale[1] / this.keyframes[minIndex].scale[1], 1 / ((this.keyframes[maxIndex].instant- this.keyframes[minIndex].instant)/(1/60)));
        var ratioZ = Math.pow(this.keyframes[maxIndex].scale[2] / this.keyframes[minIndex].scale[2], 1 / ((this.keyframes[maxIndex].instant- this.keyframes[minIndex].instant)/(1/60)));

        this.scaling[0] *= ratioX;
        this.scaling[1] *= ratioY;
        this.scaling[2] *= ratioZ;

        this.animMatrix = mat4.scale(this.animMatrix, this.animMatrix, this.scaling);

    }


    apply() {
        return this.animMatrix;
    }
}

