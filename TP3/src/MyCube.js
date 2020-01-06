/**
 * MyCylinderBase
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCube extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.size = size;
        this.translation = this.size / 2.0
        this.rectangle = new MyRectangle(this.scene, -this.translation, this.translation, -this.translation, this.translation);
    }

    display() {
        //Left Side
        this.scene.pushMatrix();
        this.scene.translate(-this.translation, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Right Side
        this.scene.pushMatrix();
        this.scene.translate(this.translation, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Front Side
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.translation);
        this.rectangle.display();
        this.scene.popMatrix();

        //Back Side
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.translation);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Top Side
        this.scene.pushMatrix();
        this.scene.translate(0, this.translation, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Bottom Side
        this.scene.pushMatrix();
        this.scene.translate(0, -this.translation, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
    updateTexCoords(length_s, length_t) {
    }
}