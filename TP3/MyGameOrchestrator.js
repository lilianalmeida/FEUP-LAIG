const GameState = {FirstPick:1, SecondPick:2};
/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 * @param filename - Name of xml file to render
 */
class MyGameOrchestrator{
    constructor(scene, filename) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence(this.scene);
        //this.animator = new MyAnimator(…);
        this.gameboard = new MyBoard(this.scene, -4, 4, -4, 4);
        this.theme = new MySceneGraph(filename, this.scene);
        this.prolog = new MyPrologInterface();
        this.gameState = GameState.FirstPick;
    }
    update(time) {
        /*if (this.scene.sceneInited) {
            for (var node in this.theme.nodesGraph) {
                if (this.theme.nodesGraph[node].animation != null) {
                    this.theme.nodesGraph[node].animation.update(deltaTime / 1000);
                }
            }
        }*/
        // this.animator.update(time);
    }
    parsePicking(obj, customId){
        if (obj instanceof MyPiece && this.gameState == GameState.FirstPick){
            let piece = this.gameboard.getPiece(obj.id + "p" + obj.player);
            console.log(piece);
            this.move = new MyGameMove(this.scene, piece, null, null, this.gameboard);
            this.gameState = GameState.SecondPick;
        }else if (obj instanceof MyTile && this.gameState == GameState.SecondPick){
            let tile = this.gameboard.getTile(customId);
            console.log(tile);
            this.move.destination = obj;
            this.move.animateMove();
            this.gameSequence.addGameMove(this.move);
            this.gameState = GameState.FirstPick;
        }
        console.log(this.gameState);
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