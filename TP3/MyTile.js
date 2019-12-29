/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyTile extends CGFobject {
    constructor(scene, piece, gameboard, x, y, width) {
        super(scene);
        this.piece = piece;
        this.gameboard = gameboard;
        this.rectangle = new MyRectangle(this.scene, x, x + width, y, y + width);
    }

    setPiece(piece){
        this.piece = piece;
    }

    getPiece(){
        return this.piece;
    }

    display(){
        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();
        if(this.piece != null){
            console.log("display piece");
            this.piece.display();
        }
    }
}
