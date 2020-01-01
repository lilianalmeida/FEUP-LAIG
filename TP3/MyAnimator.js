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
        this.isMovie = false;
    }
    reset() {
        this.sequenceIndex = 0;
        this.animationRunning = false;
        this.gameBoardMovie = null;
        this.isMovie = false;
    }
    start() {
        this.animationRunning = true;
    }
    startMovie() {
        this.animationRunning = true;
        this.isMovie = true;
        this.gameBoardMovie = new MyBoard(this.gameOrchestrator.scene, -6, 6, -6, 6);
    }
    update(time) {
<<<<<<< HEAD
        let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        if (this.animationRunning && move.arcAnimation != null) {
            //console.log(this.gameSequence);
            move.arcAnimation.update(time);
            if (move.arcAnimation.terminated) {
                move.piece.animTransformation = null;
                move.gameBoard.addPieceToTile(move.piece, move.destination);
                move.piece.x = move.destination.x + move.destination.width / 2;
                move.piece.y += 0.2;
                move.piece.z = -move.destination.y - move.destination.width / 2;
                this.animationRunning = false;
                //for all moves
                // start animation
                //when it's ended{
                //this.sequenceIndex++;
                //}
=======
        if (this.animationRunning) {
            let move;
            let gameBoard;
            if (!this.isMovie) {
                let moveIndex = this.gameSequence.moves.length - 1;
                move = this.gameSequence.moves[moveIndex];
                gameBoard = move.gameBoard;
            } else {
                console.log("Moviee" + this.sequenceIndex);
                move = this.gameSequence.moves[this.sequenceIndex];
                gameBoard = this.gameBoardMovie;
            }
            
            if (move.arcAnimation != null) {
                move.arcAnimation.update(time);
                if (move.arcAnimation.terminated) {
                    let piece = gameBoard.getPiece(move.piece.id + "p" + move.piece.player);
                    let destinationTile = gameBoard.getTile(move.destination.id);
                    piece.animTransformation = null;
                    gameBoard.addPieceToTile(piece, destinationTile);
                    move.arcAnimation.resetAnimation();
                    
                    if (this.isMovie) {
                        console.log("Moviee ENded");
                        this.sequenceIndex++;
                        if (this.sequenceIndex >= this.gameSequence.moves.length){
                            this.reset();
                        }
                    }else{
                        this.animationRunning = false;
                    }
                    this.gameOrchestrator.scene.cameraRotationActive = true;
                }
>>>>>>> f1eacc8e3df05e95be152f7ba23c09b05581bd49
            }
        }
    }

    display() {
        if (this.animationRunning) {
            let move;
            let gameBoard;
            if (!this.isMovie) {
                let moveIndex = this.gameSequence.moves.length - 1;
                move = this.gameSequence.moves[moveIndex];
                gameBoard = move.gameBoard;
            } else {
                move = this.gameSequence.moves[this.sequenceIndex];
                gameBoard = this.gameBoardMovie;
            }

            if (move.arcAnimation != null) {
                let piece = gameBoard.getPiece(move.piece.id + "p" + move.piece.player);
                piece.animTransformation = move.arcAnimation.applyPieces(move.dirVec, move.angleVec);

                if (this.isMovie){
                    console.log(gameBoard);
                    console.log(this.gameSequence);
                    this.gameBoardMovie.display();
                }
            }
        }
    }
}