/**
 * MyCubePiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyCubePiece extends MyPiece {
    constructor(scene, id, tile, player, x, y, z) {
        super(scene, id, tile, player, x, y, z);
        this.cube = new MyCube(this.scene, 1);
    }

    displayPiece() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 1 + this.y, this.z);
        this.scene.scale(1.5, 1.5, 1.5);
        if (this.animTrasn != null) {
            this.scene.multMatrix(this.animTrasn);
        }

        if (!this.scene.pickMode) {
            this.cube.display();
        } else {
            this.cube.display();
        }
        this.scene.popMatrix();
    }
}