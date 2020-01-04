const GameState = { FirstPick: 1, SecondPick: 2 };
const GameMode = { pvp: 1, pvb: 2, bvb: 3 };
/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 * @param filename - Name of xml file to render
 */
class MyGameOrchestrator {
    constructor(scene, filename) {
        this.scene = scene;

        this.theme = new MySceneGraph(filename, this.scene);
        this.score = { white: 0, black: 0 };
        this.newGame();
        this.picked = null;
        this.levels = { "easy": 1, "hard": 2 };
        this.level = 1;
    }
    update(time) {
        if (this.gameTime == null) {
            this.gameTime = time;
        }else{
            this.gameTime +=time;
            if(!this.prolog.gameOver){
                document.getElementById("time").innerText ="Time passed: " + Math.round(this.gameTime) + " seconds";
            }

        }
        this.animator.update(time);
    }

    newGame() {
        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyBoard(this.scene, -6, 6, -6, 6);
        this.prolog = new MyPrologInterface(this);
        this.prolog.requestStart();
        this.cameraRotationActive = true;
        this.gameTime = 0;
        this.currentPlayer = this.prolog.player;
        this.gameState = GameState.FirstPick;
        this.gameMode = GameMode[this.scene.interface.mode];
        console.log(this.gameMode);
        if (this.gameMode == GameMode.bvb) {
            this.nextTurn();
        }
        if(this.gameMode == GameMode.pvb){
            if(this.human == null || this.human == undefined){
                this.human = this.currentPlayer;
                if(this.bot == null){
                    this.bot = this.human==1? 2:1;
                }
            }
            if(this.currentPlayer != this.human){
                this.prolog.requestBotMove(this.level, this.currentPlayer)
                this.animator.start();
            }
        }
    }
    parsePicking(obj, customId) {
        if (this.prolog.gameOver) {
            return;
        }

        if (!this.animator.animationRunning) {

            if (obj instanceof MyPiece && obj.player == this.currentPlayer) {
                console.log("3");
                if (this.gameState == GameState.SecondPick && this.move.piece == obj) {
                    console.log("4");
                    this.move.piece.fall();
                    this.move = null;
                    this.gameState = GameState.FirstPick;
                }
                else {
                    if(this.move != null){
                        this.move.piece.fall();
                    }
                    let piece = this.gameboard.getPiece(obj.id + "p" + obj.player);
                    piece.startFloating();
                    this.move = new MyGameMove(this.scene, piece, null, this.gameboard);
                    this.gameState = GameState.SecondPick;
                }
            } else if (obj instanceof MyTile && this.gameState == GameState.SecondPick) {
                let tile = this.gameboard.getTile(obj.id);
                this.move.destination = obj;
                console.log("Player "+ this.currentPlayer + " requesting move");
                this.prolog.requestMove(this.currentPlayer, this.move.piece, this.gameboard.getTileWithCoordinates(this.move.destination.id));
                if (this.prolog.approval) {
                    this.move.piece.fall();
                    console.log("APPPPPROVED");
                    this.move.animateMove();
                    this.gameSequence.addGameMove(this.move);
                    this.animator.start();
                }
                else{
                    this.move.piece.fall();
                }
                this.gameState = GameState.FirstPick;
            }

        }
        else {
            this.move = null;
            this.gameState = GameState.FirstPick;
            console.log("undoo");
        }
        console.log(this.score);
    }

    nextTurn() {
        console.log("Next TURN");
        console.log("last Player" + this.currentPlayer);
        if (!this.prolog.gameOver) {
            this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
            document.getElementById("player").innerText ="Player "+ this.currentPlayer + "'s turn";
            console.log("current player" + this.currentPlayer);
            if (this.gameMode == GameMode.pvb && !this.prolog.gameOver && this.bot == this.currentPlayer) {
                this.sleep(500);
                this.prolog.requestBotMove(this.level, this.move.piece.player == 2 ? 1 : 2);
                this.animator.start();
            }
            else if (this.gameMode == GameMode.bvb) {
                this.sleep(1500);
                this.prolog.requestBotMove(this.level, this.currentPlayer)
                this.animator.start();
            }
        }
        console.log("current player" + this.currentPlayer);        
    }

    changeLevel() {
        console.log("changeLevel");
        console.log(this.scene);
        this.level = this.levels[this.scene.interface.level];
        console.log("new level: " + this.level);
    }

    changeMode() {
        console.log("changeMode");
        console.log("new mode: " + this.scene.interface.mode);
    }

    undo() {
        console.log("Entrei undo");
        if (this.gameSequence.moves.length == 0) {
            console.log("Im zero");
            return;
        }
        this.scene.cameraRotationActive = true;
        let lastMove = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        let lastPiece = lastMove.piece;
        if (!this.animator.isMovie) {
            console.log("not movie");
            if (this.animator.animationRunning) {
                console.log("ruunig");
                this.animator.endAnimation(lastMove.piece, lastMove.destination, lastMove.gameBoard, lastMove);
                this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
            }

            console.log("undo");
            this.gameSequence.moves.pop();

            this.gameboard.removePieceFromTile(lastMove.piece, lastMove.destination);

            console.log("next Turn");
            this.nextTurn();

            if (this.prolog.gameOver) {
                this.score[this.currentPlayer == 1 ? "white" : "black"] -= 1;
                this.prolog.gameOver = false;
            }
            document.getElementById("player").innerText ="Player "+ this.currentPlayer + "'s turn";

        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateScoreBoard(){
        document.getElementById("score").innerText ="(P1) " + this.score["white"] + "-" + this.score["black"] + " (P2)";
    }
    gameMovie() {
        this.animator.startMovie();
    }
    display() {
        if (this.scene.sceneInited) {
            // Draw axis
            this.scene.setDefaultAppearance();
            // Displays the scene (MySceneGraph function).
            this.theme.displayScene();
            if (!this.animator.isMovie) {
                this.gameboard.display();
            }
        }

        this.animator.display();
    }
}