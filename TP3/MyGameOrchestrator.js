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
        this.newGame();
        this.picked = null;
        this.levels = { "easy": 1, "hard": 2 };
        this.level = 1;
        this.score = { white: 0, black: 0 };
    }
    update(time) {
        if (this.gameTime == null) {
            this.gameTime = time;
        }else{
            this.gameTime +=time;
        }

        this.animator.update(time);
        console.log(this.gameTime);
    }

    newGame() {
        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyBoard(this.scene, -6, 6, -6, 6);
        this.prolog = new MyPrologInterface(this);
        this.prolog.requestStart();
        this.currentPlayer = this.prolog.player;
        this.gameState = GameState.FirstPick;
        this.gameMode = GameMode[this.scene.interface.mode];
        console.log(this.gameMode);
        if (this.gameMode == GameMode.bvb) {
            this.nextTurn();
        }
    }
    parsePicking(obj, customId) {
        console.log("MOVE player " + this.currentPlayer);
        console.log("Bot: " + this.prolog.botPlayer);
        console.log("Current " + this.currentPlayer);
        if (this.prolog.gameOver) {
            return;
        }

        if (!this.animator.animationRunning) {

            if (obj instanceof MyPiece && obj.player == this.currentPlayer) {
                console.log("3");
                if (this.gameState == GameState.SecondPick && this.move.piece == obj) {
                    console.log("4");
                    this.move = null;
                    this.gameState = GameState.FirstPick;
                }
                else {
                    let piece = this.gameboard.getPiece(obj.id + "p" + obj.player);
                    this.move = new MyGameMove(this.scene, piece, null, this.gameboard);
                    this.gameState = GameState.SecondPick;
                }
            } else if (obj instanceof MyTile && this.gameState == GameState.SecondPick) {
                let tile = this.gameboard.getTile(obj.id);
                this.move.destination = obj;
                this.prolog.requestMove(this.currentPlayer, this.move.piece, this.gameboard.getTileWithCoordinates(this.move.destination.id));
                if (this.prolog.approval) {
                    console.log("APPPPPROVED");
                    this.move.animateMove();
                    this.gameSequence.addGameMove(this.move);
                    this.animator.start();
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
        if (!this.prolog.gameOver) {
            this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
            console.log("bot player " + this.prolog.botPlayer);
            console.log("current player" + this.currentPlayer);
            if (this.gameMode == GameMode.pvb && !this.prolog.gameOver && this.prolog.botPlayer == this.currentPlayer) {
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
        let lastMove = this.gameSequence.moves[this.gameSequence.moves.length - 1];
        let lastPiece = lastMove.piece;
        if (!this.animator.isMovie) {
            console.log("not movie");
            let doNextTurn = false;
            if (this.animator.animationRunning) {
                console.log("ruunig");
                this.animator.endAnimation(lastMove.piece, lastMove.destination, lastMove.gameBoard, lastMove);
                doNextTurn = true;
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
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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