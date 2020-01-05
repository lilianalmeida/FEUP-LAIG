const GameState = { FirstPick: 1, SecondPick: 2 };
const GameMode = { pvp: 1, pvb: 2, bvb: 3 };
const TurnTime = 30;
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
        } else {
            if (!this.prolog.gameOver) {
                if(!this.animator.animationRunning &&!this.scene.cameraRotationActive && !this.animator.isMovie){
                    this.turnTime -= time;
                    this.updatePlayerBoard();
                }
               if( !this.animator.isMovie){
                this.gameTime += time;
               }
                document.getElementById("time").innerText = "Time passed: " + Math.round(this.gameTime) + " seconds";
                
                
                if(this.turnTime <= 0){
                    this.turnTime = 0;
                    this.prolog.gameOver= true;
                    if(this.currentPlayer == 1){
                        this.score["black"] += 1;
                    }
                    else if(this.currentPlayer == 2){
                        this.score["white"] += 1;
                    }
                    this.updateScoreBoard();
                    this.scene.cameraRotationActive = true;
                    this.updatePlayerBoard();
                }
            
            }
        }
        this.animator.update(time);
    }

    changeScene(filename) {
        this.scene.sceneInited = false;
        this.theme = new MySceneGraph(filename, this.scene);
        this.scene.graph = this.theme;
    }

    resetCameras(){
        console.log("Current player: "+ this.currentPlayer);
        if(this.currentPlayer == 1){
            console.log("1");
            this.scene.cameraDefault = new CGFcamera(Math.PI / 4, 0.005, 500, vec3.fromValues(0, 27, 21.65), vec3.fromValues(0, 0, 0));
        }
        else if(this.currentPlayer == 2){
            console.log("2");
            this.scene.cameraDefault = new CGFcamera(Math.PI / 4, 0.005, 500, vec3.fromValues(0, 27, -21.65), vec3.fromValues(0, 0, 0));
        }
    }

    newGame() {
        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyBoard(this.scene, -6, 6, -6, 6);
        this.prolog = new MyPrologInterface(this);
        this.prolog.requestStart();
        this.gameTime = 0;
        this.turnTime = TurnTime;
        this.currentPlayer = this.prolog.player;
        //this.scene.camera = this.currentPlayer == 1 ? this.scene.camp1 : this.scene.camp2;
        this.gameState = GameState.FirstPick;
        this.gameMode = GameMode[this.scene.interface.mode];
        //this.resetCameras()
        if (this.gameMode == GameMode.bvb) {
            this.nextTurn();
        }
        if (this.gameMode == GameMode.pvb) {
            if (this.human == null || this.human == undefined) {
                this.human = this.currentPlayer;
                if (this.bot == null) {
                    this.bot = this.human == 1 ? 2 : 1;
                }
            }
            if (this.currentPlayer != this.human) {
                this.sleep(1000);
                this.prolog.requestBotMove(this.level, this.currentPlayer)
                this.animator.start();
            }
        }
        this.updatePlayerBoard();

    }
    parsePicking(obj, customId) {
        if (this.prolog.gameOver) {
            return;
        }

        if (!this.animator.animationRunning) {

            if (obj instanceof MyPiece && obj.player == this.currentPlayer) {
                if (this.gameState == GameState.SecondPick && this.move.piece == obj) {
                    this.move.piece.fall();
                    this.move = null;
                    this.gameState = GameState.FirstPick;
                }
                else {
                    if (this.move != null) {
                        if(this.move.piece.tile != null){
                            this.move.piece.dropOnBoard();
                        }else{
                            this.move.piece.fall();
                        }

                    }
                    let piece = this.gameboard.getPiece(obj.id + "p" + obj.player);
                    piece.startFloating();
                    this.move = new MyGameMove(this.scene, piece, null, this.gameboard);
                    this.gameState = GameState.SecondPick;
                }
            } else if (obj instanceof MyTile && this.gameState == GameState.SecondPick) {
                let tile = this.gameboard.getTile(obj.id);
                this.move.destination = obj;
                this.prolog.requestMove(this.currentPlayer, this.move.piece, this.gameboard.getTileWithCoordinates(this.move.destination.id));
                if (this.prolog.approval) {
                    this.move.piece.fall();
                    this.move.animateMove();
                    this.gameSequence.addGameMove(this.move);
                    this.animator.start();
                }
                else {
                    this.move.piece.fall();
                }
                this.gameState = GameState.FirstPick;
            }

        }
        else {
            this.move = null;
            this.gameState = GameState.FirstPick;
        }
        console.log(this.score);
    }

    nextTurn() {
        if (!this.prolog.gameOver) {
            this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
            if (this.gameMode == GameMode.pvb && !this.prolog.gameOver && this.bot == this.currentPlayer) {
                this.sleep(1000);
                this.prolog.requestBotMove(this.level, this.move.piece.player == 2 ? 1 : 2);
                this.animator.start();
            }
            else if (this.gameMode == GameMode.bvb) {
                this.sleep(2500);
                this.prolog.requestBotMove(this.level, this.currentPlayer)
                this.animator.start();
            }

            if(!this.prolog.gameOver){
                this.updatePlayerBoard();
            }
        }
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
        if(this.move.piece != null){
            this.move.piece.fall();
        }
        if (this.gameSequence.moves.length == 0) {
            return;
        }
        this.scene.cameraRotationActive = true;
        let lastMove = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        let lastPiece = lastMove.piece;
        if (!this.animator.isMovie) {
            if (this.animator.animationRunning) {
                this.animator.endAnimation(lastMove.piece, lastMove.destination, lastMove.gameBoard, lastMove);
                this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
            }

            this.gameSequence.moves.pop();
            this.gameboard.removePieceFromTile(lastMove.piece, lastMove.destination);
            this.nextTurn();

            if (this.prolog.gameOver) {
                console.log("game was over!");
                console.log("player " +this.currentPlayer);
                this.score[this.currentPlayer == 1 ? "white" : "black"] -= 1;
                this.prolog.gameOver = false;
            }
            this.updatePlayerBoard();
            this.updateScoreBoard();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateScoreBoard() {
        document.getElementById("score").innerText = "P1 " + this.score["white"] + "-" + this.score["black"] + " P2";
    }

    declareWinner(player){
        document.getElementById("player").innerText = "Player " + player + " Wins!";
    }

    declareTie(){
        document.getElementById("player").innerText = "It's a tie!";
    }

    updatePlayerBoard() {
        console.log("Updating player board");
        if(this.turnTime > 0){
            document.getElementById("player").innerText = "Player " + this.currentPlayer + " has " + Math.round(this.turnTime) + " seconds to play";
        }
        else if(this.turnTime <= 0 && this.prolog.gameOver){
            document.getElementById("player").innerText = "Player " + this.currentPlayer + " lost for not playing";
        }
    }

    gameMovie() {
        if(this.animator.animationRunning){
            return;
        }
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