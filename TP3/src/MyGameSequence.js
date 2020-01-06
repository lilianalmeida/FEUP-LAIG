/**
 * MyGameSequence
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameSequence {
    constructor() {
        this.moves = [];
    }
    addGameMove(move) {
        console.log("inside " + move);
        this.moves.push(move);
    }
    undo() {
        let lastMove = this.moves.pop();
        lastMove.gameBoard.removePieceFromTile(lastMove.piece, lastMove.destination);
    }
    getMoveByIndex(index){
        if (index < this.moves.length){
            return this.moves[index];
        }else{
            return false;
        }
    }
}