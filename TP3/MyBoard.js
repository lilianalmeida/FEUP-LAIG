/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
    constructor(scene, x1, x2, y1, y2) {
        super(scene);
        this.tiles = [];
        this.pieces = [];
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.initBoard();
        this.createTiles();
        this.initMaterials();
        this.initPieces();
    }
    initMaterials() {
        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setAmbient(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setShininess(10.0);
        this.tex = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.boardMaterial.setTexture(this.tex);
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');

        this.defaultMaterial = new CGFappearance(this.scene);
        this.defaultMaterial.setAmbient(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setShininess(10.0);
    }
    initBoard() {
        let controlPoints = [  // U = 0 
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
    createTiles() {
        let tileWidth = Math.abs(this.x2 - this.x1) / 4;
        for (let i = 0; i < 4; i++) {
            this.tiles[i] = new Array(4);
            for (let j = 0; j < 4; j++) {
                this.tiles[i][j] = new MyTile(this.scene, null, this, this.x1 + j * tileWidth, this.y1 + i * tileWidth, tileWidth);
            }
        }
    }
    displayTiles() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.scene.registerForPick(this.scene.indexForPick++, this.tiles[i][j]);
                this.tiles[i][j].display();
            }
        }
    }
    initPieces() {
        let increment = 1;
        for (let i = 1; i <= 2; i++) {
            this.pieces["cylinder1" + "p" + i] = new MyCylinderPiece(this.scene, "cylinder1", null, i, -10 * increment, 10.5 * increment);
            this.pieces["cylinder2" + "p" + i] = new MyCylinderPiece(this.scene, "cylinder2", null, i, -8 * increment, 10.5 * increment);
            this.pieces["sphere1" + "p" + i] = new MySpherePiece(this.scene, "sphere1", null, i, -10 * increment, 9 * increment);
            this.pieces["sphere2" + "p" + i] = new MySpherePiece(this.scene, "sphere2", null, i, -8 * increment, 9 * increment);
            this.pieces["cube1" + "p" + i] = new MyCubePiece(this.scene, "cube1", null, i, -10 * increment, 7 * increment);
            this.pieces["cube2" + "p" + i] = new MyCubePiece(this.scene, "cube2", null, i, -8 * increment, 7 * increment);
            this.pieces["cone1" + "p" + i] = new MyConePiece(this.scene, "cone1", null, i, -10 * increment, 5 * increment);
            this.pieces["cone2" + "p" + i] = new MyConePiece(this.scene, "cone2", null, i, -8 * increment, 5 * increment);
            increment = -1;
        }
    }
    displayPieces() {
        for (let piece in this.pieces) {
            if (this.scene.pickMode){
                if (this.pieces[piece].tile == null){
                    this.scene.registerForPick(this.scene.indexForPick++, this.pieces[piece]);
                    this.pieces[piece].display();
                }
            }else{
                this.pieces[piece].display();
            }
        }
    }

    display() {
        if (!this.scene.pickMode) {
            this.boardMaterial.apply();
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
        else {
            this.displayTiles();
        }


        this.defaultMaterial.apply();
        this.displayPieces();
    }

    addPieceToTile(piece, tile) {
        tile.piece = piece;
        piece.tile = tile;
    }
    //TODO: Needed?
    removePieceFromTile(piece, tile) {
        tile.piece = null;
        this.pieces[piece].tile = null;
    }
    getPieceOfTile(tile) {
        //return this.tiles[tile].piece;
    }
    getTile(tile) {
        let newT = tile -1;
        console.log(Math.floor(newT/4));
        console.log(newT%4);
        return this.tiles[Math.floor(newT/4)][newT%4];
    }
    getPiece(piece) {
        return this.pieces[piece];
    }
    getTileofPiece(piece) {
        return this.pieces[piece].tile;
    }
    movePiece() {

    }
    getTileWithCoordinates(tile_coordinates) {

    }
}