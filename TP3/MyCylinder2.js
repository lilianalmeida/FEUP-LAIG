/**
 * MyCylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Size of the cylinder in the direction of the positive Z axis
 * @param slices - Number of divisions around the circumference
 * @param stacks - Number of divisions along the Z direction
 */
class MyCylinder2 extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }
    initBuffers() {
        var yHeightBase = this.base / 0.75;
        var yHeightTop = this.top / 0.75;
        var controlPoints = [
            // U = 0
            [ // V = 0..1;
                [-this.top, 0.0, this.height, 1],
                [-this.base, 0.0, 0.0, 1]

            ],
            // U = 1
            [ // V = 0..1
                [-this.top, yHeightTop, this.height, 1],
                [-this.base, yHeightBase, 0.0, 1]
            ],
            // U = 2
            [ // V = 0..1
                [this.top, yHeightTop, this.height, 1],
                [this.base, yHeightBase, 0.0, 1]
            ],
            // U = 3
            [ // V = 0..1
                [this.top, 0.0, this.height, 1],
                [this.base, 0.0, 0.0, 1]
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(3, 1, controlPoints);
        this.semiCylinder = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
    }
    /**
     * @method display
     * Applies transformations and displays two semicylinders to form one cylinder
     */
    display() {
        this.scene.pushMatrix();
        this.semiCylinder.display();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.semiCylinder.display();
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