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
        this.prolog = new MyPrologInterface(this);

        this.newGame(GameMode.pvp);
        this.picked = null;
        this.levels = { "easy": 1, "hard": 2 };
        this.level = 1;
        this.score = {white: 0, black: 0};
    }
    update(time) {
        this.animator.update(time);
    }

    newGame(mode) {
        this.gameboard.createTiles();
        this.gameboard.initPieces();
        this.prolog.requestStart();
        this.currentPlayer = this.prolog.player;
        console.log("Player "+ this.currentPlayer + " starts!");
        this.gameState = GameState.FirstPick;
        this.gameMode = mode == null? GameMode["pvp"]:mode;
    }
    parsePicking(obj, customId) {
        console.log("MOVE player "+ this.currentPlayer);

        if(!this.animator.animationRunning){
            console.log("1");
            if (!this.prolog.gameOver) {
                console.log("2");
                if (this.gameMode == GameMode.bvb) {
                    this.prolog.requestBotMove(this.level, this.currentPlayer)
                    this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
                    return;
                }
                if (obj instanceof MyPiece && obj.player == this.currentPlayer) {
                    console.log("3");
                    if (this.gameState == GameState.SecondPick && this.move.piece == obj) {
                        console.log("4");
                        this.move = null;
                        this.gameState = GameState.FirstPick;
                    }
                    else {
                        console.log("5");
                        let piece = this.gameboard.getPiece(obj.id + "p" + obj.player);
                        this.move = new MyGameMove(this.scene, piece, null, this.gameboard);
                        this.gameState = GameState.SecondPick;
                    }
                } else if (obj instanceof MyTile && this.gameState == GameState.SecondPick) {
                    console.log("6");
                    let tile = this.gameboard.getTile(obj.id);
                    this.move.destination = obj;
                    this.prolog.requestMove(this.currentPlayer,this.move.piece, this.gameboard.getTileWithCoordinates(this.move.destination.id));
                    if (this.prolog.approval) {
                        console.log("APPPPPROVED");
                        this.move.animateMove();
                        this.gameSequence.addGameMove(this.move);
                        this.animator.start();
                        if (this.gameMode == GameMode.pvb && !this.prolog.gameOver) {
                            this.prolog.requestBotMove(this.level, this.move.piece.player == 2 ? 1 : 2)
                        }
                    
                        if (this.gameMode == GameMode.pvp) {
                            console.log("Last player was = "+ this.currentPlayer);
                            this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
                            console.log("nexPlayer is = "+ this.currentPlayer);
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
        console.log(this.score);
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
        if(this.prolog.gameOver){
            this.score[this.currentPlayer == 1? "white": "black"] -= 1;
            this.prolog.gameOver = false;
        }

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