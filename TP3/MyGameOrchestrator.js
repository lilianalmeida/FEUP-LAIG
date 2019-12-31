const GameState = { FirstPick: 1, SecondPick: 2 };
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
        //this.animator = new MyAnimator(this, this.gameSequence);
        this.gameboard = new MyBoard(this.scene, -6, 6, -6, 6);
        this.theme = new MySceneGraph(filename, this.scene);
        this.prolog = new MyPrologInterface(this.gameboard,this.gameSequence);
        this.gameState = GameState.FirstPick;
        this.picked = null;
    }
    update(time) {
        /*if (this.scene.sceneInited) {
            for (var node in this.theme.nodesGraph) {
                if (this.theme.nodesGraph[node].animation != null) {
                    this.theme.nodesGraph[node].animation.update(deltaTime / 1000);
                }
            }
        }*/
        //this.animator.update(time);
    }
    parsePicking(obj, customId) {
        if (obj instanceof MyPiece) {
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
                this.gameboard.content = this.prolog.board;
                this.move.animateMove();
                this.gameSequence.addGameMove(this.move);
                this.prolog.requestBotMove(2,this.move.piece.player == 2? 1:2)
            }
            //this.animator.start();
            this.gameState = GameState.FirstPick;
        }


    }
    undo(){
        this.gameboard = this.gameSequence.undo();
    }
    gameMovie(){
        
    }
    display() {
        if (this.scene.sceneInited) {
            // Draw axis
            this.scene.setDefaultAppearance();
            // Displays the scene (MySceneGraph function).
            this.theme.displayScene();
        }
        this.gameboard.display();
        //this.animator.display();
    }
}