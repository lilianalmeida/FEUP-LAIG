/**
 * MyGameSequence
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameSequence{
    constructor(scene, piece, origin, destination, oldGameState) {
        this.scene = scene;
        this.moves = [];
    }
    addGameMove(move){
        this.moves.push(move);
    }
    undo(){

    }
    //TODO: something for move replay
}