/**
 * MyGameBoard
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyGameBoard extends CGFobject {
    constructor(scene, id, gameboard, x1, x2, y1, y2) {
        super(scene);
        this.id = id;
    }

    display(){
        this.rectangle.display();
    }


}
