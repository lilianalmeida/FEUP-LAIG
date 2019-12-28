/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyNode extends CGFobject {
    constructor(scene, id, isPrimitive, visibility, selectable) {
        super(scene);
        this.id = id;
        this.isPrimitive = isPrimitive;

        this.transfMatrix = null;
        this.animation = null;
        this.materials = [];
        this.texture = null;
        this.children = [];

        this.visibility = visibility;
        this.selectable = selectable;

        this.length_s = null;
        this.length_t = null;
    }
}