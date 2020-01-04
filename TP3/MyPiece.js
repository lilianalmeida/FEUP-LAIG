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
        this.whiteMaterial.setAmbient(0.9, 0.9, 0, 1);
        this.whiteMaterial.setDiffuse(0.9, 0.9, 0.5, 1);
        this.whiteMaterial.setSpecular(0.9, 0.9, 0.5, 1);
        this.whiteMaterial.setShininess(10.0);
        this.whiteText = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.whiteMaterial.setTexture(this.whiteText);
        this.whiteMaterial.setTextureWrap('REPEAT', 'REPEAT');

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(1, 0.4, 0.2, 1);
        this.redMaterial.setDiffuse(0.05, 0.05, 0.05, 1);
        this.redMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.redMaterial.setShininess(10.0);


        this.redText = new CGFtexture(this.scene, "scenes/images/T1.png");
        this.redMaterial.setTexture(this.redText);
        this.redMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    startFloating(){
        this.floating = true;
        this.minHeight = this.initialPosition["y"];
        this.maxHeight = this.minHeight + 3;
        this.floatSpeed = 0.10;
        this.floatingAngle = 0;
    }
    float(){
        this.y += this.floatSpeed;
        this.floatingAngle += Math.PI / 16;
        if(this.floatSpeed > 0 && Math.abs(this.maxHeight - this.y) < 0.05){
            this.floatSpeed *= -1;
        }
        else if(this.floatSpeed < 0 && Math.abs(this.minHeight - this.y) < 0.05){
            this.floatSpeed *= -1;
        }
    }
    fall(){
        this.floating = false;
        this.y = this.initialPosition["y"];
        this.floatingAngle = 0;
    }

    display() {
        if (this.player == 1) {
            this.whiteMaterial.apply();
        } else {
            this.redMaterial.apply();
        }
        this.scene.pushMatrix();
       if(this.floating){
           this.scene.translate(this.initialPosition["x"],this.y, this.initialPosition["z"]);
           this.scene.rotate(this.floatingAngle,0,1,0);
           this.scene.translate(-this.initialPosition["x"],-this.y, -this.initialPosition["z"]);
       }
        this.displayPiece();
        this.scene.popMatrix();
    }

    displayPiece() { }
}
