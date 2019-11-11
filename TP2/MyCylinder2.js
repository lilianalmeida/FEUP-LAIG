/**
 * MyCylinder2
 * @constructor
 * @param scene - Reference to MyScene object
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
                [this.base, yHeightTop, this.height, 1],
                [this.base, yHeightBase, 0.0, 1]
            ],
            // U = 3
            [ // V = 0..1
                [this.top, 0.0, this.height, 1],
                [this.base, 0.0, 0.0, 1]
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(3, 1, controlPoints);
        this.cylinderUpper = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
    }
    display() {
        this.scene.pushMatrix();
        this.cylinderUpper.display();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.cylinderUpper.display();
        this.scene.popMatrix();

    }
    updateTexCoords(length_s, length_t) {
    }
}