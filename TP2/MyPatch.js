/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPatch extends CGFobject {
    constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.id = id;
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
    display() {
        this.patch.display();
    }
    updateTexCoords(length_s, length_t) {
    }
}