const PickState = { FirstPick: 1, SecondPick: 2 };
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
        //this.animator = new MyAnimator(…);
        this.gameboard = new MyBoard(this.scene, -4, 4, -4, 4);
        this.theme = new MySceneGraph(filename, this.scene);
        this.prolog = new MyPrologInterface();
        this.prolog.board = this.gameboard.emptyBoard();
        this.pickState = PickState.FirstPick;
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
        // this.animator.update(time);
    }
    parsePicking(obj, customId) {
        if (obj instanceof MyPiece && this.pickState == PickState.FirstPick) {
            this.picked = this.gameboard.getPiece(obj.id + "p" + obj.player);
            console.log(this.picked);
            this.move = new MyGameMove(this.scene, this.picked, null, null, this.gameboard);
            this.pickState = PickState.SecondPick;
        } else if (obj instanceof MyTile && this.pickState == PickState.SecondPick) {
            let tile = this.gameboard.getTile(customId);
            console.log(tile);
            this.move.destination = obj;
            console.log(this.prolog.approval);
            this.prolog.requestMove(this.gameboard.content, this.picked, [this.move.destination.x, this.move.destination.y]);
            //this.prolog.requestBotMove(this.gameboard.content,2,this.picked.player == 2? 1:2)
            console.log("merdas " + this.prolog.approval);
            if (this.prolog.approval) {
                this.gameboard.content = this.prolog.board;
                console.log("new board");
                console.log(this.gameboard.content);
                console.log("******");
                this.move.animateMove();
                this.gameSequence.addGameMove(this.move);
            }
            console.log("depois do if");
            this.pickState = PickState.FirstPick;
        }


        console.log(this.pickState);
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