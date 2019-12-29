/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Piece id
 * @param tile - Tile where the piece is
 * @param player - Player who owns the piece
 */
class MyPiece{
    constructor(scene, id, tile, player, x, z) {
        this.scene = scene;
        this.id = id;
        this.tile = tile;
        this.player = player;
        this.x = x;
        this.z = z;
    }

    display(){}
}
