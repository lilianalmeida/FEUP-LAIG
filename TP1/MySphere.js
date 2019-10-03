/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = 0;
        var deltaTheta = Math.PI / (2 * this.stacks);

        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.slices;

        for (var j = 0; j < this.stacks; j++) {

            phi = 0;
            for (var i = 0; i <= this.slices; i++) {

                var nx = Math.cos(theta) * Math.cos(phi);
                var ny = Math.cos(theta) * Math.sin(phi);
                var nz = Math.sin(theta);

                this.vertices.push(nx * this.radius, ny * this.radius, nz * this.radius);

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

                if (j > 0) {
                    this.vertices.push(nx * this.radius, ny * this.radius, -nz * this.radius);
                    //TO DO!! - Normalizar
                    this.normals.push(
                        nx,
                        ny,
                        -nz
                    );
                }

                //TO DO!
                this.texCoords.push(phi / (Math.PI * 2), phi);



                phi += deltaPhi;
            }

            theta += deltaTheta;
        }

        this.vertices.push(0, 0, this.radius);
        this.vertices.push(0, 0, -this.radius);
        this.normals.push(
            0,
            0,
            1
        );
        this.normals.push(
            0,
            0,
            -1
        );

        for (var j = 0; j < this.stacks - 1; j++) {

            if (j == 0) {

                for (var i = 0; i < this.slices; i++) {
                    //hemisfério norte
                    this.indices.push(i, i + 1, this.slices + 1 + 2 * (i + 1));
                    this.indices.push(i, this.slices + 1 + 2 * (i + 1), this.slices + 1 + 2 * i);

                    //hemisfério sul
                    this.indices.push(i + 1, i, this.slices + 2 + 2 * i);
                    this.indices.push(i + 1, this.slices + 2 + 2 * i, this.slices + 2 + 2 * (i + 1));
                }

            }
            else {
                for (var i = 0; i < this.slices; i++) {
                    //hemisfério norte
                    this.indices.push((this.slices + 1) * (2 * j - 1) + 2 * (i), ((this.slices + 1) * (2 * j - 1) + 2) + 2 * (i), ((this.slices + 1) * (2 * j + 1) + 2) + 2 * (i));
                    this.indices.push((this.slices + 1) * (2 * j - 1) + 2 * (i), ((this.slices + 1) * (2 * j + 1) + 2) + 2 * (i), (this.slices + 1) * (2 * j + 1) + 2 * (i));

                    //hemisfério sul
                    this.indices.push(((this.slices + 1) * (2 * j - 1) + 2) + 2 * (i) + 1, (this.slices + 1) * (2 * j - 1) + 2 * (i) + 1, (this.slices + 1) * (2 * j + 1) + 2 * (i) + 1);
                    this.indices.push(((this.slices + 1) * (2 * j - 1) + 2) + 2 * (i) + 1, (this.slices + 1) * (2 * j + 1) + 2 * (i) + 1, ((this.slices + 1) * (2 * j + 1) + 2) + 2 * (i) + 1);
                }
            }

        }

        for (var i = 0; i < this.slices; i++) {
            this.indices.push((this.slices + 1) * (2 * (this.stacks - 1) - 1) + 2 * (i), ((this.slices + 1) * (2 * (this.stacks - 1) - 1) + 2) + 2 * (i), (this.stacks - 1) * (this.slices + 1) * 2 + this.slices + 1);
            this.indices.push(((this.slices + 1) * (2 * (this.stacks - 1) - 1) + 2) + 2 * (i) + 1, (this.slices + 1) * (2 * (this.stacks - 1) - 1) + 2 * (i) + 1, (this.stacks - 1) * (this.slices + 1) * 2 + this.slices + 2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }
    updateBuffers(complexity) {
        //this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}