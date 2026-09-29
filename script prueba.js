var world_RandomTest = new function() {
    var self = this;

    // Parámetros (los de la pantalla de selección de mundo)

    this.name = 'randomTest'; // Nombre interno
    this.short_description = "Mundo aleatorio de prueba"; // Nombre que se muestra al público
    this.long_description = // Código HTML (descripción del mundo)
        "<p>Prueba</p>"
    this.thumbnail = "images/worlds/default_thumbnail.png" // Imagen

    // Configuración inicial

    this.options = {
        image: 'simple',
        length: 100,
        width: 100,
        groundFriction: 1,
        wallFriction: 0.1,
        groundRestitution: 0.0,
        wallRestitution: 0.1,
    };

    this.robotStart = {
        position: new BABYLON.Vector3(0, 0, 0),
        rotation: new BABYLON.Vector3(0, 0, 0)
    };

    // Añadir cajas
    this.addBox = function(scene, size, pos) {
    var boxOptions = {
        height: size[0],
        width: size[1],
        depth: size[2]
    };

    var box = BABYLON.MeshBuilder.CreateBox('obstacle', boxOptions, scene);
        box.material = self.obstacleMat;
        box.position.y = size[0] / 2;
        box.position.x = pos[0];
        box.position.z = pos[1];

        box.physicsImpostor = new BABYLON.PhysicsImpostor(
            box,
            BABYLON.PhysicsImpostor.BoxImpostor,    
            {
                mass: 0,
                friction: self.options.wallFriction,
                restitution: self.options.wallRestitution
            },
            scene
        );
    };

    // Carga un pedazo 

    this.loadImageTile = function (scene, imageSrc, size, pos=[0,0], rot=Math.PI/2) {
        var groundMat = new BABYLON.StandardMaterial('ground', scene);
        var groundTexture = new BABYLON.Texture(imageSrc, scene);
        groundMat.diffuseTexture = groundTexture;
        groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var faceUV = new Array(6);  
        for (var i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }
        faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);

        var boxOptions = {
            width: size[0],
            height: 10,
            depth: size[1],
            faceUV: faceUV
        };

        var ground = BABYLON.MeshBuilder.CreateBox('box', boxOptions, scene);
        ground.material = groundMat;
        ground.receiveShadows = true;
        ground.position.y = -5;
        ground.position.x = pos[0];
        ground.position.z = pos[1];
        ground.rotation.y = rot;

        // Physics
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {
                mass: 0,
                friction: self.options.groundFriction,
                restitution: self.options.groundRestitution
            },
            scene
            );
    };

    // Genera objetos, etc.

    this.loadMap = function(scene)  {
        // Imagen
        self.loadImageTile(
            scene,
            "textures/maps/custom.png",
            [self.options.width, self.options.length]
        )

        seed = Math.random()
        if (seed < 0.25) {
            self.addBox(scene, [20, 20, 20], [80, 80])
        } else if (seed < 0.5) {
            self.addBox(scene, [20, 20, 20], [80, -80])
        } else if (seed < 0.75) {
            self.addBox(scene, [20, 20, 20], [-80, -80])
        } else {
            self.addBox(scene, [20, 20, 20], [-80, 80])
        }
    }

    // Genera el mapa
    
    this.load = function (scene) {
        return new Promise(function(resolve, reject) {
            self.obstacleMat = babylon.getMaterial(scene, 'CC1ACC')
            self.loadMap(scene);
            resolve();
        }
    )}
}

// Iniciar en GearsBot
world_RandomTest.init();

if (typeof worlds == 'undefined') {
  var worlds = [];
}
worlds.push(world_RandomTest);