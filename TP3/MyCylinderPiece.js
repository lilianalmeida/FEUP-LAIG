/**
 * MyCylinderPiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyCylinderPiece extends MyPiece {
    constructor(scene, id, tile, player, x, z) {
        super(scene, id, tile, player, x, z);
        this.cylinder = new MyCylinderBase(this.scene, 1, 1, 1, 10, 10);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 0.2, this.z);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.45, 0.45, 1);

        if (!this.scene.pickMode) {
            this.cylinder.display();
        } else {
            this.cylinder.display();
        }
        this.scene.popMatrix();
    }
}