/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        var theta = 0;
        var deltaTheta = 2 * Math.PI / this.slices;

        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.loops;

        for (var j = 0; j <= this.loops; j++) {

            theta = 0;
            for (var i = 0; i <= this.slices; i++) {

                var nx = Math.cos(theta) * Math.cos(phi);
                var ny = Math.cos(theta) * Math.sin(phi);
                var nz = Math.sin(theta);

                var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
                var z = nz * this.inner;

                this.vertices.push(x, y, z);

                var normal = [
                    nx,
                    ny,
                    nz
                ];

                //Normalization
                var nsize = Math.sqrt(
                    normal[0] * normal[0] +
                    normal[1] * normal[1] +
                    normal[2] * normal[2]
                );
                normal[0] /= nsize;
                normal[1] /= nsize;
                normal[2] /= nsize;

                this.normals.push(...normal);

                //TO DO!
                this.texCoords.push(phi / (Math.PI * 2), phi);

                theta += deltaTheta;
            }
            phi += deltaPhi;
        }

        for (var j = 0; j < this.loops; j++) {

            for (var i = 0; i < this.slices; i++) {
                var A = (this.slices + 1) * j + i;
                var C = (this.slices + 1) * (j + 1) + i;

                this.indices.push(A + 1, A, C + 1);
                this.indices.push(C + 1, A, C);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }

    updateBuffers(complexity) {
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}