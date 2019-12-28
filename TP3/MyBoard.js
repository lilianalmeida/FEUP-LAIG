/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
    constructor(scene, x1, x2, y1, y2) {
        super(scene);
        this.tiles = [];
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.initBoard();
        this.createTiles();
    }

    createTiles() {
        var tileWidth = Math.abs(this.x2 - this.x1) / 4;
        for (var i = 0; i < 4; i++) {
            this.tiles[i] = new Array(4);
            for (var j = 0; j < 4; j++) {
                this.tiles[i][j] = new MyTile(this.scene, this, this.x1 + j * tileWidth, this.y1 + i * tileWidth, tileWidth);
            }
        }
    }

    displayTiles() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.scene.registerForPick(this.scene.indexForPick++,this.tiles[i][j]);
                this.tiles[i][j].display();
            }
        }
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
                [this.x1, this.y1, 0, 1],
                [this.x1, 0, 0, 1],
                [this.x1, this.y2, 0, 1]
            ],
            // U = 1
            [ // V = 0..2
                [0, this.y1, 0, 1],
                [0, 0, 0, 1],
                [0, this.y2, 0, 1]
            ],
            // U = 2
            [ // V = 0..2
                [this.x2, this.y1, 0, 1],
                [this.x2, 0, 0, 1],
                [this.x2, this.y2, 0, 1]
            ]
        ];

        this.patch = new MyPatch(this.scene, 3, 3, 10, 10, controlPoints);
        this.boarder = new MyRectangle(this.scene, this.x1, this.x2, -0.2, 0);

    }

    display() {

        if(!this.scene.pickMode){
            this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.patch.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(0, -0.2, 0);
            this.scene.rotate(-3 * Math.PI / 2, 1, 0, 0);
            this.patch.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 4);
            this.boarder.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(4, 0, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(0, 0, -4);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(-4, 0, 0);
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.boarder.display();
            this.scene.popMatrix();
            this.scene.popMatrix();
        }
        else{
            this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.displayTiles();
            this.scene.popMatrix();
        }
    }
}