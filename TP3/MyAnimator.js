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
        this.animationStarted = false;
    }
    reset() {
        this.sequenceIndex = 0;
        this.animationStarted = false;
    }
    start() {
        this.animationStarted = true;
    }
    update(time) {
        let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        if (this.animationStarted && move.arcAnimation != null) {
            move.arcAnimation.update(time);
            if (move.arcAnimation.terminated) {
                move.oldGameState.addPieceToTile(move.piece, move.destination);
                move.piece.x = move.destination.x + move.destination.width / 2;
                move.piece.y += 0.2;
                move.piece.z = -move.destination.y - move.destination.width / 2;
                this.animationStarted = false;
                //for all moves
                // start animation
                //when it's ended{
                //this.sequenceIndex++;
                //}
            }
        }
    }
    display() {
        if (this.animationStarted) {
            console.log("Siaapla");
            let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
            console.log(move);
            if (move.arcAnimation != null) {
                move.arcAnimation.applyPieces(this.move.dirVec, this.move.angleVec);
            }
        }
    }
}