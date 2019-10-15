var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodesGraph = [];               // Array with all nodes
        this.idRoot = null;                 // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.views = [];

        this.defaultView = this.reader.getString(viewsNode, 'default')


        var children = viewsNode.children // Perspective and ortho views

        if (children.length < 1) {
            this.onXMLError('no valid views declared');
        }

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == 'perspective') { // Perspective type view
                this.parsePerspectiveView(children[i]);
            }
            else if (children[i].nodeName == 'ortho') { // Ortho type view
                this.parseOrthoView(children[i]);
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;

            }

        }

        if (this.views[this.defaultView] == null) {
            this.onXMLError('default view does not exist')
        }

        this.log("Parsed views");

        return null;

    }

    /**
     * Parses the <perspective> node.
     * @param {perspective block element} pNode 
     */
    parsePerspectiveView(pNode) {

        var id = this.reader.getString(pNode, 'id');

        if (this.views[id] != null) {
            this.onXMLMinorError('ID ' + id + 'already in use')
        }


        var near = this.reader.getFloat(pNode, 'near');
        if (!(near != null && !isNaN(near)))
            return "unable to parse near of the perspective view for ID = " + id;

        var far = this.reader.getFloat(pNode, 'far');
        if (!(far != null && !isNaN(far)))
            return "unable to parse far of the perspective view for ID = " + id;

        var angle = this.reader.getFloat(pNode, 'angle') * Math.PI / 180;
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of the perspective view for ID = " + id;

        var from, to;
        var children = [];


        children = pNode.children;
        for (var j = 0; j < children.length; j++) {
            if (children[j].nodeName == 'from') {
                from = this.parseCoordinates3D(children[j], "from component for perspective view with ID " + id);
            }
            else if (children[j].nodeName == 'to') {
                to = this.parseCoordinates3D(children[j], "to component for perspective view with ID " + id);
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[j].nodeName + ">");
                continue;
            }
        }

        var newP = new CGFcamera(angle, near, far, from, to);
        this.views[id] = newP;
    }

    /**
     * Parses the <ortho> node.
     * @param {ortho block element} oNode 
     */
    parseOrthoView(oNode) {
        var id = this.reader.getString(oNode, 'id');

        var near = this.reader.getFloat(oNode, 'near');
        if (!(near != null && !isNaN(near)))
            return "unable to parse near of the ortho view for ID = " + id;

        var far = this.reader.getFloat(oNode, 'far');
        if (!(far != null && !isNaN(far)))
            return "unable to parse far of the ortho view for ID = " + id;

        var left = this.reader.getFloat(oNode, 'left');
        if (!(left != null && !isNaN(left)))
            return "unable to parse left of the ortho view for ID = " + id;

        var right = this.reader.getFloat(oNode, 'right');
        if (!(right != null && !isNaN(right)))
            return "unable to parse right of the ortho view for ID = " + id;

        var top = this.reader.getFloat(oNode, 'top');
        if (!(top != null && !isNaN(top)))
            return "unable to parse top of the ortho view for ID = " + id;

        var bottom = this.reader.getFloat(oNode, 'bottom');
        if (!(bottom != null && !isNaN(bottom)))
            return "unable to parse bottom of the ortho view for ID = " + id;

        var from, to;
        var up = vec3.fromValues(0, 1, 0);

        var children = [];
        children = oNode.children;
        for (var j = 0; j < children.length; j++) {
            if (children[j].nodeName == 'from') {
                from = this.parseCoordinates3D(children[j], "from component for ortho view with ID " + id);
            }
            else if (children[j].nodeName == 'to') {
                to = this.parseCoordinates3D(children[j], "to component for ortho view with ID " + id);
            }
            else if (children.length == 3 && children[j].nodeName == 'up') {
                up = this.parseCoordinates3D(children[j], "up component for ortho view with ID " + id);
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[j].nodeName + ">");
                continue;
            }
        }

        var newO = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
        this.views[id] = newO;
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "att"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") {
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    }
                    else if (attributeTypes[j] == "att") {  // Parsing light's attenuation
                        var cons = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
                        if (!(cons != null && !isNaN(cons)))
                            return "unable to parse constant attenuation of the light for ID = " + lightId;

                        var lin = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                        if (!(lin != null && !isNaN(lin)))
                            return "unable to parse linear attenuation of the light for ID = " + lightId;

                        var quad = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                        if (!(quad != null && !isNaN(quad)))
                            return "unable to parse quadratic attenuation of the light for ID = " + lightId;

                        if (cons == 1 && lin == 0 && quad == 0) {
                            global.push("constant");
                        } else if (cons == 0 && lin == 1 && quad == 0) {
                            global.push("linear");
                        } else if (cons == 0 && lin == 0 && quad == 1) {
                            global.push("quadratic");
                        } else {
                            this.onXMLMinorError("unable to parse attenuation for light " + lightId);
                        }
                    }
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }



            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;  // textures

        this.textures = [];    // Array with all textures

        // Checks the existence of at least one texture
        if (children.length < 1) {
            return "There must be at least one texture block";
        }

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');

            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var textureSrc = this.reader.getString(children[i], 'file');

            if (textureSrc == null)
                return "no file defined for texture";

            //New texture
            var newTex = new CGFtexture(this.scene, textureSrc);
            this.textures[textureID] = newTex;

        }

    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;  // Materials
        var grandChildren = [];                 // Material properties

        var nodeNames = [];     // Material properties names
        this.materials = [];    // Array with all materials

        // Checks the existence of at least one material
        if (children.length < 1) {
            return "There must be at least one material block";
        }

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // New material
            var newMaterial = new CGFappearance(this.scene);

            // Gets id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Gets material shininess
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null)
                return "no shininess defined for material";

            grandChildren = children[i].children;

            // Fills nodeNames and saves material properties index
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Parsing each material property
            var emission = this.parseColor(grandChildren[emissionIndex], "emission for material " + materialID);
            if (emission == null)
                return "no emission defined for material";

            var ambient = this.parseColor(grandChildren[ambientIndex], "ambient for material " + materialID);
            if (ambient == null)
                return "no ambient defined for material";

            var diffuse = this.parseColor(grandChildren[diffuseIndex], "diffuse for material " + materialID);
            if (diffuse == null)
                return "no diffuse defined for material";

            var specular = this.parseColor(grandChildren[specularIndex], "specular for material " + materialID);
            if (specular == null)
                return "no specular defined for material";

            // Sets all components of the material
            newMaterial.setShininess(shininess);
            newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            newMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);

            // Adds new material to the array
            this.materials[materialID] = newMaterial;
        }
        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;    // Transformations blocks
        var grandChildren = [];         // Transformations of a defined transformation block 

        this.transformations = [];      // Array with all defined tranformations

        // Checks the existence of at least one transformation block
        if (children.length < 1) {
            return "There must be at least one transformation block";
        }

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;

            // Specifications for the current transformation.
            var transfMat = mat4.create();
            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMat = mat4.translate(transfMat, transfMat, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMat = mat4.scale(transfMat, transfMat, coordinates);
                        break;
                    case 'rotate':
                        var coordinates = this.parseAngularCoordinates(grandChildren[j], "rotate tranformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMat = mat4.rotate(transfMat, transfMat, coordinates[1], coordinates[0]);
                        break;
                    default:
                        this.onXMLMinorError("tranformation " + grandChildren[j].nodeName + " does not exist");
                        break;

                }
            }
            this.transformations[transformationID] = transfMat;
        }
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children; // Primitives
        var grandChildren = [];                 // Primitive specification

        this.primitives = [];                   // Array with all primitives

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)";
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // New rectangle
                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);
                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                //  First vertex
                //  x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // Second vertex
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // Third vertex
                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                // New triangle
                var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'cylinder') {
                // Base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive for ID = " + primitiveId;

                // Top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive for ID = " + primitiveId;

                // Height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive for ID = " + primitiveId;

                // Stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive for ID = " + primitiveId;

                // New cylinder
                var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cylinder;
            }
            else if (primitiveType == 'sphere') {
                // Radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive for ID = " + primitiveId;

                // Stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive for ID = " + primitiveId;

                // New sphere
                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);
                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {
                // Inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive for ID = " + primitiveId;

                // Outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive for ID = " + primitiveId;

                // Loops
                var loops = this.reader.getInteger(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive for ID = " + primitiveId;

                // New Torus
                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            }

            // Adds the primitive as a new node of the graph
            var nodeGraph = new MyNode(this.scene, primitiveId, true);
            this.nodesGraph[primitiveId] = nodeGraph;
        }
        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children; // Components
        var grandChildren = [];                 // Components properties blocks
        var grandgrandChildren = [];

        this.components = [];                   // Array with already parsed components id
        var nodeNames = [];                     // Component properties names

        var nodeTransf;                         // Transformation matrix of a component
        var materialIds = [];                   // Component materials
        var childrenGraph = [];                 // Component children

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            var nodeGraph = new MyNode(this.scene, this.reader.getString(children[i], 'id'), false);    // New not primitive type node
            // nodeTransf, materialIds, "", childrenGraph);
            grandChildren = children[i].children;

            // Fills nodeNames and saves components properties index
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            if (grandChildren[transformationIndex].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + grandChildren[transformationIndex].nodeName + ">");
                continue;
            }

            grandgrandChildren = grandChildren[transformationIndex].children;   // Transformations of this component
            nodeTransf = mat4.create();                                     // Resets matrix to identity matrix           

            if (grandgrandChildren.length != 0) {   // If there is at least one transformation block
                // Reference to a transformation previously declared
                if (grandgrandChildren[transformationIndex].nodeName == "transformationref") {
                    nodeTransf = this.transformations[this.reader.getString(grandgrandChildren[transformationIndex], 'id')];
                }
                else {  // Several explicit transformations 
                    for (var j = 0; j < grandgrandChildren.length; j++) {
                        switch (grandgrandChildren[j].nodeName) {
                            case 'translate':
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for node ID " + this.reader.getString(children[i], 'id'));
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                nodeTransf = mat4.translate(nodeTransf, nodeTransf, coordinates);

                                break;
                            case 'scale':
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for node ID " + this.reader.getString(children[i], 'id'));
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                nodeTransf = mat4.scale(nodeTransf, nodeTransf, coordinates);
                                break;
                            case 'rotate':
                                var coordinates = this.parseAngularCoordinates(grandgrandChildren[j], "rotate tranformation for node ID " + this.reader.getString(children[i], 'id'));
                                if (!Array.isArray(coordinates))
                                    return coordinates;
                                nodeTransf = mat4.rotate(nodeTransf, nodeTransf, coordinates[1], coordinates[0]);
                                break;
                        }
                    }
                }
            }
            nodeGraph.transfMatrix = nodeTransf;

            // Materials
            if (grandChildren[materialsIndex].nodeName != "materials") {
                this.onXMLMinorError("unknown tag <" + grandChildren[materialsIndex].nodeName + ">");
                continue;
            }

            grandgrandChildren = grandChildren[materialsIndex].children;    // Materials declared
            materialIds = [];                                               // Resets array

            // Checks the existence of at least one material
            if (grandgrandChildren.length < 1) {
                this.onXMLMinorError("There must be at least one material at node " + this.reader.getString(children[i], 'id'));
            }

            // Any number of materials.
            for (var j = 0; j < grandgrandChildren.length; j++) {
                materialIds.push(this.reader.getString(grandgrandChildren[j], 'id'));
            }

            nodeGraph.materials = materialIds;



            // Children
            if (grandChildren[childrenIndex].nodeName != "children") {
                this.onXMLMinorError("unknown tag <" + grandChildren[childrenIndex].nodeName + ">");
                continue;
            }

            grandgrandChildren = grandChildren[childrenIndex].children;     // All component children
            var hasQuadratic = this.hasQuadraticChildren(grandgrandChildren);
            childrenGraph = [];                                             // Resets array

            // Checks the existence of at least one child
            if (grandgrandChildren.length < 1) {
                this.onXMLMinorError("There must be at least one child at node " + this.reader.getString(children[i], 'id'));
            }

            // Any number of children
            for (var j = 0; j < grandgrandChildren.length; j++) {
                childrenGraph.push(this.reader.getString(grandgrandChildren[j], 'id'));
            }

            nodeGraph.children = childrenGraph;

            // Texture
            if (grandChildren[textureIndex].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + grandChildren[textureIndex].nodeName + ">");
                continue;
            }

            nodeGraph.texture = this.reader.getString(grandChildren[textureIndex], 'id');

            if (nodeGraph.texture != 'inherit' && nodeGraph.texture != 'none') {
                if (this.reader.getString(grandChildren[textureIndex], 'length_s') != null) {
                    nodeGraph.length_s = this.reader.getString(grandChildren[textureIndex], 'length_s');
                }
                if (this.reader.getString(grandChildren[textureIndex], 'length_t') != null) {
                    nodeGraph.length_t = this.reader.getString(grandChildren[textureIndex], 'length_t');
                }
            }

            // Adds node with all its properties defined to the graph
            this.nodesGraph[this.reader.getString(children[i], 'id')] = nodeGraph;
        }
        this.log("Parsed components");
        return null;
    }

    /**
     * 
     * @param {children array in which primitiverefs are searched for} nodeChildren 
     */
    hasQuadraticChildren(nodeChildren) {
        var name;
        var gcname;
        for (var i = 0; i < nodeChildren.length; i++) {
            if (nodeChildren[i].nodeName == 'primitiveref') {
                name = this.reader.getString(nodeChildren[i], 'id');//robotcylinder
                gcname = this.primitives[name].constructor.name;

                if (gcname == 'MyCylinder' || gcname == 'MySphere' || gcname == 'MyTorus') {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAngularCoordinates(node, messageError) {
        var position = [];

        // Get axis
        var axis = this.reader.getString(node, 'axis');
        if (axis != "x" && axis != "y" && axis != "z")
            return "unable to parse axis of the " + messageError;
        if (axis == "x") {
            position.push([1, 0, 0]);
        } else if (axis == "y") {
            position.push([0, 1, 0]);
        } else if (axis == "z") {
            position.push([0, 0, 1]);
        } else {
            return "unable to parse axis of the " + messageError;
        }

        // Get angle
        var angle = this.reader.getFloat(node, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of the " + messageError;
        position.push(angle * Math.PI / 180);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
    * Displays the scene, processing each node, starting in the root node.
    */
    displayScene() {


        var matTrans = mat4.create();
        //this.scene.appearance = new CGFappearance(this.scene);
        var actualNode = this.nodesGraph[this.idRoot];
        this.stored_length_s = [];
        this.stored_length_t = [];
        this.processNode(actualNode, matTrans, null, 'none', 1, 1);
    }

    /**
     * Processes a node and displays it if it is a primitive
     * @param {MyNode} nodeProc - node to be processed
     * @param {mat4} transP - transformation matrix received by the node parent
     * @param {string} matP - material inherited by the node parent
     */
    processNode(nodeProc, transP, matP, texP, length_sP, length_tP) { //, texp, length_s, length_t)
        var material = matP;
        var texture = texP;
        var length_s = length_sP;
        var length_t = length_tP;
        var tex_plus_len = [];
        var materialIndex = this.scene.materialsChange % nodeProc.materials.length;


        // Checks if it is a valid node
        if (nodeProc.id == null) {
            this.onXMLMinorError("invalid node");
        }



        // Primitive node
        if (nodeProc.isPrimitive == true) {
            // Applies texture to the material if there is one defined
            if (texture != null && texture != 'none') {
                this.materials[material].setTexture(this.textures[texture]);
                this.materials[material].setTextureWrap('REPEAT', 'REPEAT');
                //no caso de n haver material é suposto criar um novo (ou usar um default na raiz) ou fazer como o johny:

            }

            // Applies material if there is one defined
            if (material != null) {
                this.materials[material].setTexture(this.textures[texture]);
                this.materials[material].setTextureWrap('REPEAT', 'REPEAT');
                this.materials[material].apply();

            }
            // Updates primitive texture coordinates according to the parent's texture coordinates 
            if (length_s != 0 && length_t != 0) {
                this.primitives[nodeProc.id].updateTexCoords(length_s, length_t);
            }

            // Applies transformation matrix
            this.scene.multMatrix(transP);

            // Primitive display
            this.primitives[nodeProc.id].display();
        }
        else    // Intermediate node
        {

            // Update properties considering the parents nodes properties
            material = this.updateMaterial(material, nodeProc.materials[materialIndex]);
            transP = this.updateTransf(transP, nodeProc.transfMatrix);
            tex_plus_len = this.updateTexture(texture, nodeProc.texture, length_s, length_t, nodeProc.length_s, nodeProc.length_t);
            texture = tex_plus_len[0];
            length_s = tex_plus_len[1];
            length_t = tex_plus_len[2];

            // Process each child node, keeping the transformation matrix of the current node in the stack of the scene
            for (var i = 0; i < nodeProc.children.length; i++) {

                this.scene.pushMatrix();

                this.processNode(this.nodesGraph[nodeProc.children[i]], transP, material, texture, length_s, length_t);

                this.scene.popMatrix();
            }

        }

    }

    /**
     * Updates material considering what the node has saved as material
     * @param {mat4} matP - material of the parent node
     * @param {mat4} matC - material of the node
     */
    updateMaterial(matP, matC) {
        if (matC != "inherit") {
            return matC;
        } else {
            return matP;
        }
    }

    /**
     * Updates transformation matrix multiplying the node matrix by the one received by the parent 
     * @param {mat4} transP - transformation matrix of the parent node
     * @param {mat4} transC - transformation matrix of the node
     */
    updateTransf(transP, transC) {
        var mout = mat4.create();
        return mat4.multiply(mout, transP, transC);
    }

    /**
     * Updates texture considering what the node has saved as texture
     * @param {mat4} texP - texture of the parent node
     * @param {mat4} texC - texture of the node
     */
    updateTexture(texP, texC, lsP, ltP, lsC, ltC) {
        var result = [];
        if (texC == "inherit") {
            result.push(texP);
            result.push(lsP);
            result.push(ltP);
        } else if (texC == "none") {
            result.push(null);
            result.push(0);
            result.push(0);
        }
        else {
            result.push(texC);
            result.push(lsC);
            result.push(ltC);
        }
        return result;
    }

}