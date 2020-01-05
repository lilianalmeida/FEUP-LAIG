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
                this.gameOrchestrator.scene.cameraRotationActive = false;
                this.gameOrchestrator.turnTime = TurnTime;
            }
            
            if (move.arcAnimation != null) {
                move.arcAnimation.update(time);
                if (move.arcAnimation.terminated) {
                    let piece = gameBoard.getPiece(move.piece.id + "p" + move.piece.player);
                    let destinationTile = gameBoard.getTile(move.destination.id);
                    
                    this.endAnimation(piece, destinationTile, gameBoard, move);
                    
                    if (this.isMovie) {
                        console.log("Moviee ENded");
                        this.sequenceIndex++;
                        if (this.sequenceIndex >= this.gameSequence.moves.length){
                            this.reset();
                        }
                    }else{
                        if(!this.gameOrchestrator.prolog.gameOver){
                            this.gameOrchestrator.nextTurn();
                        }
                    }
                    //TODO: CAmera
                   // this.gameOrchestrator.scene.cameraRotationActive = true;
                }
            }
        }
        for(let i in this.gameOrchestrator.gameboard.pieces){
            if(this.gameOrchestrator.gameboard.pieces[i].floating){
                this.gameOrchestrator.gameboard.pieces[i].float();
            }
        }
    }

    endAnimation(piece, destinationTile, gameBoard, move){
        piece.animTransformation = null;
        gameBoard.addPieceToTile(piece, destinationTile);
        move.arcAnimation.resetAnimation();
        if (!this.isMovie){
            this.animationRunning = false;
        }
        this.gameOrchestrator.scene.cameraRotationActive = true;
        this.gameOrchestrator.turnTime = TurnTime;
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