/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the primitive
 * @param radius - Radius of the sphere
 * @param slices - Number of divisions between poles
 * @param stacks - Number of divisions around axis
 */
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.id = id;
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

        //Angle between each stack
        var theta = 0;
        var deltaTheta = Math.PI / (2 * this.stacks);

        //Angle between each slice
        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.slices;

        for (var j = 0; j <= this.stacks; j++) {
            //Reinitialize phi
            phi = 0;

            for (var i = 0; i <= this.slices; i++) {

                //Normal components
                var nx = Math.cos(theta) * Math.cos(phi);
                var ny = Math.cos(theta) * Math.sin(phi);
                var nz = Math.sin(theta);

                //Vertices
                this.vertices.push(nx * this.radius, ny * this.radius, nz * this.radius);

                //Texture Coordinates 
                    this.texCoords.push(i / this.slices, 0.5 + j / (2 * this.stacks));

                //Normal
                this.normals.push(
                    nx,
                    ny,
                    nz
                );

                //Vertices of the south hemisphere, only if it's not the first stack (equator)
                if (j > 0) {
                    //Vertices
                    this.vertices.push(nx * this.radius, ny * this.radius, -nz * this.radius);
                    
                    //Texture Coordinates
                    this.texCoords.push(i / this.slices, 0.5 - j / (2 * this.stacks));

                    //Normal
                    this.normals.push(
                        nx,
                        ny,
                        -nz
                    );
                }


                //Next phi for next slice
                phi += deltaPhi;
            }

            //Next theta for next stack
            theta += deltaTheta;
        }


        //Normals normalization
        for (var n = 0; n < this.normals.length; n += 3) {
            var nsize = Math.sqrt(
                this.normals[n] * this.normals[n] +
                this.normals[n + 1] * this.normals[n + 1] +
                this.normals[n + 2] * this.normals[n + 2]
            );

            this.normals[n] /= nsize;
            this.normals[n + 1] /= nsize;
            this.normals[n + 2] /= nsize;
        }

        /* SPHERE SURFACE */
        //Generates sphere surface
        for (var j = 0; j < this.stacks ; j++) {

            //Sphere surface around de equator
            if (j == 0) {
                for (var i = 0; i <= this.slices; i++) {
                    //Vertices indexes
                    var v1 = i;                                 //Vertex in loop = j and slice = i
                    var v2 = v1 + 1;                            //Vertex in loop = j and slice = i+1
                    var v3 = (this.slices + 1) + 2 * i;         //Vertex in loop = j+1 and slice = i
                    var v4 = v3 + 2;                            //Vertex in loop = j+1 and slice = i+1

                    //North hemisphere
                    this.indices.push(v1, v2, v4);
                    this.indices.push(v1, v4, v3);

                    //South hemisphere
                    this.indices.push(v2, v1, v3 + 1);
                    this.indices.push(v2, v3 + 1, v4 + 1);
                }
            }
            //Sphere surface for the rest of the sphere
            else {
                for (var i = 0; i <= this.slices; i++) {
                    //Vertices indexes
                    var v1 = (this.slices + 1) * (2 * j - 1) + 2 * i;   //Vertex in loop = j and slice = i
                    var v2 = v1 + 2;                                    //Vertex in loop = j and slice = i+1
                    var v3 = (this.slices + 1) * (2 * j + 1) + 2 * i;   //Vertex in loop = j+1 and slice = i
                    var v4 = v3 + 2;                                    //Vertex in loop = j+1 and slice = i+1

                    //North hemisphere
                    this.indices.push(v1, v2, v4);
                    this.indices.push(v1, v4, v3);

                    //South hemisphere
                    this.indices.push(v2 + 1, v1 + 1, v3 + 1);
                    this.indices.push(v2 + 1, v3 + 1, v4 + 1);
                }
            }

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the sphere
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
    updateTexCoords(length_s, length_t) {
    }
}