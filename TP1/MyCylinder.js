/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers() {

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var subHeight = 0;
		var diffHeight = this.height / this.stacks;

		var radius = this.base;
		var diffRadius = (this.top - this.base) / this.stacks;

		for (var j = 0; j <= this.stacks; j++) {

			var ang = 0;
			var alphaAng = 2 * Math.PI / this.slices;
			for (var i = 0; i <= this.slices; i++) {

				var nx = Math.sin(ang);
				var ny = Math.cos(ang);
				var nz = Math.cos(Math.atan(diffHeight / diffRadius));

				this.vertices.push(nx * radius, ny * radius, subHeight); 

				//TO DO!
				this.texCoords.push(ang / (Math.PI * 2), subHeight);

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

				ang += alphaAng;
			}

			subHeight += diffHeight;
			radius += diffRadius;
		}

		for (var j = 0; j < this.stacks; j++) {
			for (var i = j * (this.slices + 1); i < j * (this.slices + 1) + this.slices; i++) {
				this.indices.push((i + this.slices + 1), (i + 1), (i));
				this.indices.push((i + 1), (i + this.slices + 1), (i + this.slices + 2));
			}
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