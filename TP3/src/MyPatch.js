/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npointsU - Number of points needed to define the patch curve in u
 * @param npointsV - Number of points needed to define the patch curve in v
 * @param npartsU - Number of parts to divide the patch in u
 * @param npartsV - Number of parts to divide the patch in v
 * @param controlPoints - Points needed to define the patch
 */
class MyPatch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }
    initBuffers() {
        var nurbsSurface = new CGFnurbsSurface(this.npointsU - 1, this.npointsV - 1, this.controlPoints);
        this.patch = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }

    /**
     * @method display
     * Displays patch
     */
    display() {
        this.patch.display();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the patch
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
    updateTexCoords(length_s, length_t) {
    }
}