/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - node id
 * @param isPrimitive - true if the node is a leaf-node, false otherwise
 */
class MyGameOrchestrator{
    constructor(scene, filename) {
        this.scene = scene;
        //this.gameSequence = new MyGameSequence(…);
        //this.animator = new MyAnimator(…);
        this.gameboard = new MyBoard(scene, -4, 4, -4, 4);
        this.theme = new MySceneGraph(filename, this.scene);
        //this.prolog = new MyPrologInterface(…);

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
    orchestrate() {

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