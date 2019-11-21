/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npartsU - Number of parts to divide the plane in u
 * @param npartsV - Number of parts to divide the plane in v
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

    /**
     * @method display
     * Displays plane
     */
    display() {
        this.plane.display();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the plane
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
    updateTexCoords(length_s, length_t) {
    }
}