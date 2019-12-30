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
        this.moves.push(move);
    }
    undo() {
        let lastMove = this.moves.pop();
        return lastMove.oldGameState;
    }
    getMoveByIndex(index){
        if (index < this.moves.length){
            return this.moves[index];
        }else{
            return false;
        }
    }
}