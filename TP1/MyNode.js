/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 * @param transfMatrix - transformations matrix to apply to the node
 * @param materials - materials to apply
 * @param texture - texture to apply
 * @param children - children nodes
 */
class MyNode extends CGFobject {
    constructor(scene, id, isPrimitive, transfMatrix, materials, texture, children) {
        super(scene);
        this.id = id;
        this.isPrimitive = isPrimitive;

        this.transfMatrix = transfMatrix;
        this.materials = materials;
        this.texture = texture;
        this.children = children;
        this.visited = false; //needed??? for display
    }
}