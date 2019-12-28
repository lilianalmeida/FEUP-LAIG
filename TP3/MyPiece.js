/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyPiece extends CGFobject {
    constructor(scene, id,node) {
        super(scene);
        this.id = id;
        this.node = null;
    }
}
