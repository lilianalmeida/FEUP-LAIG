/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.initBuffers();
    }
    initBuffers() {
        var controlPoints = [	// U = 0
            [ // V = 0..1;
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1]

            ],
            // U = 1
            [ // V = 0..1
                [0.5, 0.0, 0.5, 1],
                [0.5, 0.0, -0.5, 1]
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.plane = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }
    display() {
        this.plane.display();
    }
    updateTexCoords(length_s, length_t) {
    }
}