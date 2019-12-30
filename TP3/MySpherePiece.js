/**
 * MySpherePiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MySpherePiece extends MyPiece {
    constructor(scene, id, tile, player, x, y, z) {
        super(scene, id, tile, player, x, y, z);
        this.sphere = new MySphere(this.scene, 1, 20, 20);
        this.cubeSph = new MyCube(this.scene, 2);
    }
    displayPiece() {

        this.scene.pushMatrix();
        this.scene.translate(this.x, 1 + this.y, this.z);
        this.scene.scale(0.5 * 1.5, 0.5 * 1.5, 0.5 * 1.5);
        if (this.animTrasn != null) {
            this.scene.multMatrix(this.animTrasn);
        }

        if (!this.scene.pickMode) {
            this.sphere.display();
        } else {
            this.cubeSph.display();
        }
        this.scene.popMatrix();
    }
}