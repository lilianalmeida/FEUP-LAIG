/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the primitive
 * @param base - Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Size of the cylinder in the direction of the positive Z axis
 * @param slices - Number of divisions around the circumference
 * @param stacks - Number of divisions along the Z direction
 */
class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.id = id;
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

		//Height of cylinder in each stack
		var subHeight = 0;
		var diffHeight = this.height / this.stacks;

		//Top radius of cylinder in each stack
		var radius = this.base;
		var diffRadius = (this.top - this.base) / this.stacks;

		//Angle between each slice
		var ang = 0;
		var alphaAng = 2 * Math.PI / this.slices;

		for (var j = 0; j <= this.stacks; j++) {
			//Reinitialize angle
			ang = 0;

			for (var i = 0; i <= this.slices; i++) {

				//Normal components
				var nx = Math.sin(ang);
				var ny = Math.cos(ang);
				var nz = Math.tan(Math.PI / 2 - Math.atan(diffHeight / (- diffRadius)));

				//Vertices
				this.vertices.push(nx * radius, ny * radius, subHeight);

				//Texture Coordinates - TO DO!
				this.texCoords.push(i / this.slices, j / this.stacks);

				//Normal
				var normal = [
					nx,
					ny,
					nz
				];

				//Normal normalization
				var nsize = Math.sqrt(
					normal[0] * normal[0] +
					normal[1] * normal[1] +
					normal[2] * normal[2]
				);
				normal[0] /= nsize;
				normal[1] /= nsize;
				normal[2] /= nsize;

				this.normals.push(...normal);

				//Next angle for next slice
				ang += alphaAng;
			}
			//Next height and radius for next stack
			subHeight += diffHeight;
			radius += diffRadius;
		}

		//Generates cylinder surface
		for (var j = 0; j < this.stacks; j++) {
			for (var i = j * (this.slices + 1); i < j * (this.slices + 1) + this.slices; i++) {
				this.indices.push(i + this.slices + 1, i + 1, i);
				this.indices.push(i + 1, i + this.slices + 1, i + this.slices + 2);
			}
		}



		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
	updateTexCoords(length_s, length_t) {
	}

}