/**
 * MyConePiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyConePiece extends MyPiece {
    constructor(scene, id, tile, player, x, y, z) {
        super(scene, id, tile, player, x, y, z);
        this.cone = new MyCylinderBase(this.scene, 1, 0.001, 1, 10, 10);
        this.cubeCon = new MyCube(this.scene, 1);
    }

    displayPiece() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 0.3 + this.y, this.z);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.45 * 1.7, 0.45 * 1.7, 1 * 1.5);
        if (this.animTrasn != null) {
            this.scene.multMatrix(this.animTrasn);
        }

        if (!this.scene.pickMode) {
            this.cone.display();
        } else {
            /*this.scene.pushMatrix();
            this.scene.translate(0,0,0.5);
            this.scene.scale(1.9, 1.9, 1);
            this.cubeCon.display();
            this.scene.popMatrix();*/
            this.cone.display();
        }
        this.scene.popMatrix();
    }
}