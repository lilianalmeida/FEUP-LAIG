/**
 * MyCubePiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyCubePiece extends MyPiece {
    constructor(scene, id, tile, player, x, z) {
        super(scene, id, tile, player, x, z);
        this.cube = new MyCube(this.scene, 1);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 0.7, this.z);

        if (!this.scene.pickMode) {
            this.cube.display();
        } else {
            this.cube.display();
        }
        this.scene.popMatrix();
    }
}