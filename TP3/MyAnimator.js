/**
 * MyAnimator
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimator {
    constructor(gameOrchestrator, gameSequence) {
        this.gameOrchestrator = gameOrchestrator; //TODO: Needed?
        this.gameSequence = gameSequence;
        this.sequenceIndex = 0;
        this.animationRunning = false;
    }
    reset() {
        this.sequenceIndex = 0;
        this.animationRunning = false;
    }
    start() {
        this.animationRunning = true;
    }
    update(time) {
        let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        if (this.animationRunning && move.arcAnimation != null) {
            move.arcAnimation.update(time);
            if (move.arcAnimation.terminated) {
                move.piece.animTransformation = null;
                move.oldGameState.addPieceToTile(move.piece, move.destination);
                move.piece.x = move.destination.x + move.destination.width / 2;
                move.piece.y += 0.2;
                move.piece.z = -move.destination.y - move.destination.width / 2;
                this.animationRunning = false;
                //for all moves
                // start animation
                //when it's ended{
                //this.sequenceIndex++;
                //}
            }
        }
    }
    display() {
        if (this.animationRunning) {
            //console.log("Siaapla");
            let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
            //console.log(move);
            if (move.arcAnimation != null) {
                //console.log(move.arcAnimation);
                move.piece.animTransformation = move.arcAnimation.applyPieces(move.dirVec, move.angleVec);
            }
        }
    }
}