/**
 * MyGameMove
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameMove{
    constructor(scene, piece, origin, destination, oldGameState) {
        this.scene = scene;
        this.piece = piece;
        this.origin = origin;
        this.destination = destination;
        this.oldGameState = oldGameState;
    }
    animateMove(){
        console.log(this.destination);
        console.log(this.piece);
        this.oldGameState.addPieceToTile(this.piece, this.destination);
        console.log("DEST X = " + this.destination.x + " DEST Y ="  + this.destination.y);
        this.piece.x = this.destination.x + this.destination.width/2;
        this.piece.z = -this.destination.y - this.destination.width/2;
        console.log(this.piece);
        return this.oldGameState;
    }
}