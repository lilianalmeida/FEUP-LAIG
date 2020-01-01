/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyPiece {
    constructor(scene, id, tile, player, x, y, z) {
        this.scene = scene;
        this.id = id;
        this.tile = tile;
        this.player = player;
        this.initialPosition = {"x": x, "y": y, "z": z};
        this.x = x;
        this.y = y;
        this.z = z;
        this.animTransformation = null;

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setAmbient(0.9, 0.9, 0.5, 1);
        this.whiteMaterial.setDiffuse(0.9, 0.9, 0.5, 1);
        this.whiteMaterial.setSpecular(0.9, 0.9, 0.5, 1);
        this.whiteMaterial.setShininess(10.0);
        /*this.whiteText = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.whiteMaterial.setTexture(this.whiteText);
        this.whiteMaterial.setTextureWrap('REPEAT', 'REPEAT');*/

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(0.9, 0.1, 0.2, 1);
        this.redMaterial.setDiffuse(0.9, 0.1, 0.2, 1);
        this.redMaterial.setSpecular(0.9, 0.1, 0.2, 1);
        this.redMaterial.setShininess(10.0);
        /* this.redText = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.redMaterial.setTexture(this.redText);
        this.redMaterial.setTextureWrap('REPEAT', 'REPEAT');*/
    }

    display() {
        if (this.player == 1) {
            this.whiteMaterial.apply();
        } else {
            this.redMaterial.apply();
        }
        this.displayPiece();
    }

    displayPiece() { }
}
