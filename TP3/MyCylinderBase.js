/**
 * MyCylinderBase
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinderBase extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

        this.cyl = new MyCylinder(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
        this.circle = new MyCircle(this.scene, this.stacks);
    }

    display(){
        this.scene.pushMatrix();
        this.cyl.display();
        
        this.scene.rotate(Math.PI, 1,0,0);
        this.scene.rotate(Math.PI/this.stacks, 0,0,1);
        this.scene.scale(this.base, this.base,1);
        this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,this.height);
        this.scene.rotate(Math.PI/this.stacks, 0,0,1);
        this.scene.scale(this.top, this.top, 1);
        this.circle.display();
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