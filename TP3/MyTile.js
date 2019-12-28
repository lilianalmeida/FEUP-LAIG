/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyTile extends CGFobject {
    constructor(scene, gameboard, x,y,width) {
        super(scene);
        this.piece = null;
        this.gameboard = gameboard;
        this.rectangle = new MyRectangle(this.scene, x, x + width, y, y + width);
    }

    display(){
        this.rectangle.display();
    }


}
