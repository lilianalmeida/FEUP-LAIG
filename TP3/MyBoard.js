/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBoard();
    }

    initBoard() {
        var controlPoints = [   // U = 0
            /* [ // V = 0..2
                 [0, -4, 0, 1],
                 [-4, -4, 0, 10],
                 [-4,  0, 0, 1]
                 
             ],
             // U = 1
             [ // V = 0..2
                 [4, -4, 0, 10],
                 [0, 0, 0, 1],
                 [-4,  4, 0, 10]
             ],
             // U = 2
             [ // V = 0..2
                 [4,  0, 0, 1],
                 [4,  4, 0, 10],
                 [0,  4, 0, 1]
             ]*/

            [ // V = 0..2
                [-4, -4, 0, 1],
                [-4, 0, 0, 1],
                [-4, 4, 0, 1]
            ],
            // U = 1
            [ // V = 0..2
                [0, -4, 0, 1],
                [0, 0, 0, 1],
                [0, 4, 0, 1]
            ],
            // U = 2
            [ // V = 0..2
                [4, -4, 0, 1],
                [4, 0, 0, 1],
                [4, 4, 0, 1]
            ]
        ];

        this.patch = new MyPatch(this.scene, 3, 3, 10, 10, controlPoints);
        this.boarder = new MyRectangle(this.scene, -4, 4, -0.2, 0);

    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.2, 0);
        this.scene.rotate(-3*Math.PI/2, 1, 0, 0);
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0,4);
        this.boarder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(4, 0,0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.boarder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,-4);
        this.scene.rotate(Math.PI, 0,1,0);
        this.boarder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4,0,0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.boarder.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}