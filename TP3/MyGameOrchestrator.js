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

        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyBoard(this.scene, -6, 6, -6, 6);
        this.theme = new MySceneGraph(filename, this.scene);
        this.prolog = new MyPrologInterface(this.gameboard, this.gameSequence);

        this.newGame(GameMode.pvp);
        this.picked = null;
        this.levels = { "easy": 1, "hard": 2 };
        this.level = 1;


    }
    update(time) {
        this.animator.update(time);
    }

    newGame(mode) {
        this.gameboard.createTiles();
        this.gameboard.initPieces();
        this.prolog.requestStart();
        this.currentPlayer = this.prolog.player;
        this.gameState = GameState.FirstPick;
        this.gameMode = mode;
    }
    parsePicking(obj, customId) {

        if(!this.animator.animationRunning){
            if (!this.prolog.gameOver) {
                if (this.gameMode == GameMode.bvb) {
                    this.prolog.requestBotMove(this.level, this.currentPlayer)
                    this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
                    return;
                }
                if (obj instanceof MyPiece && obj.player == this.currentPlayer) {
                    if (this.gameState == GameState.SecondPick && this.move.piece == obj) {
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
                    this.prolog.requestMove(this.move.piece, this.gameboard.getTileWithCoordinates(this.move.destination.id));
                    if (this.prolog.approval) {
                        this.move.animateMove();
                        this.gameSequence.addGameMove(this.move);
                        this.animator.start();
                        if (this.gameMode == GameMode.pvb && !this.prolog.gameOver && !this.animator.animationRunning) {    
                            this.prolog.requestBotMove(this.level, this.move.piece.player == 2 ? 1 : 2)
                        }
                        console.log("Apppp");
                        if (this.gameMode == GameMode.pvp) {
                            this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
                        }
                    }
                    this.gameState = GameState.FirstPick;
                }
            }
        }

        else {
            //this.newGame(GameMode.pvp);
            this.move = null;
            this.gameState = GameState.FirstPick;
            console.log("undoo");
            //this.undo();
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
        console.log(this.scene);
        let tmp = this.scene.interface.mode;
        this.newGame(GameMode[tmp]);
        console.log("new mode: " + this.gameMode);
    }

    undo() {
        let lastMove = this.gameSequence.moves.pop();
        let lastPiece = lastMove.piece;
        lastPiece.x = lastPiece.initialPosition["x"];
        lastPiece.y = lastPiece.initialPosition["y"];
        lastPiece.z = lastPiece.initialPosition["z"];
        this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
        this.gameboard.removePieceFromTile(lastMove.piece, lastMove.destination);
    }
    gameMovie() {

    }
    display() {
        if (this.scene.sceneInited) {
            // Draw axis
            this.scene.setDefaultAppearance();
            // Displays the scene (MySceneGraph function).
            this.theme.displayScene();
            this.gameboard.display();
        }
        this.gameboard.display();
        this.animator.display();
    }
}