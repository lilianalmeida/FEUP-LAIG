/**
 * MySpherePiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MySpherePiece extends MyPiece {
    constructor(scene, id, tile, player, x, z) {
        super(scene, id, tile, player, x, z);
        this.sphere = new MySphere(this.scene, 1, 20, 20);
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(this.x, 0.7, this.z);
        this.scene.scale(0.5, 0.5, 0.5);

        if (!this.scene.pickMode) {
            this.sphere.display();
        } else {
            this.sphere.display();       
        }
        this.scene.popMatrix();
    }
}