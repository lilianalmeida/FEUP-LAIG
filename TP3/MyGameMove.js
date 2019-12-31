/**
 * MyGameMove
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameMove {
    constructor(scene, piece, destination, gameBoard) {
        this.scene = scene;
        this.piece = piece;
        this.destination = destination;
        this.gameBoard = gameBoard;
        this.arcAnimation = null;
    }
    animateMove() {
        /*let timeCircular = 3.0;

        this.calculateAnimValues();

        this.arcAnimation = new MyArcAnimation("animation", timeCircular, [this.centerArcPoint[0], 0, this.centerArcPoint[1]], this.radius, 180, 180);
 */
        this.gameBoard.addPieceToTile(this.piece, this.destination);
        this.piece.x = this.destination.x + this.destination.width / 2;
        this.piece.y += 0.2;
        this.piece.z = -this.destination.y - this.destination.width / 2;
    }
    calculateAnimValues(){
        this.startArcPoint = [this.piece.x, this.piece.z];
        this.endArcPoint = [this.destination.x + this.destination.width / 2, -this.destination.y - this.destination.width / 2];
        this.centerArcPoint = [((this.endArcPoint[0] + this.startArcPoint[0]) / 2.0), ((this.endArcPoint[1] + this.startArcPoint[1]) / 2.0)];
        this.radius = Math.sqrt(Math.pow((this.centerArcPoint[0] - this.startArcPoint[0]), 2) + Math.pow((this.centerArcPoint[1] - this.startArcPoint[1]), 2));
    
        let startEndVec = [this.endArcPoint[0] - this.startArcPoint[0], 0, this.endArcPoint[1] - this.startArcPoint[1]];
        let tempVec = [0, 0, 0];
        this.rotVecY(tempVec, startEndVec, [0, 0, 0], Math.PI / 2);
        let vecLength = Math.sqrt(Math.pow(tempVec[0], 2) + Math.pow(tempVec[1], 2) + Math.pow(tempVec[2], 2));
        this.dirVec = tempVec;

        this.angleVec = Math.atan(tempVec[0] / tempVec[2]);

        if ((Math.round(tempVec[2]) == 0.0) && tempVec[0] > 0) {
            this.angleVec = -Math.PI / 2;
        }
    }

    rotVecY(out, a, b, c) {

        let p = [], r = [];

        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];

        //perform rotation
        r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
        r[1] = p[1];
        r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];

        return out;
    }
}