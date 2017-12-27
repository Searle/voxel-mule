
class Game {

    init( args ) {

        let container= document.body;

        this.withShadows= !!args.withShadows;
        this.debug= args.debug || {};

        this.modelLoader= new ModelLoader(this.withShadows);
        this.mainWidth= window.innerWidth * .8;
        this.mainHeight= window.innerHeight * .8;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.mainWidth, this.mainHeight);
        if ( this.withShadows ) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        container.appendChild( this.renderer.domElement );

        this.stats = new Stats();
        container.appendChild( this.stats.dom );

        return this.modelLoader.loadModels(args.models).then(() => Promise.resolve(this));
    }

    _buildFloor() {
        let geometry= new THREE.PlaneGeometry(500, 500);
        let material= new THREE.MeshLambertMaterial({ color: 0xffb100 });

        let mesh= new THREE.Mesh(geometry, material);
        mesh.rotation.x= -Math.PI / 2;

// console.log("SH",  this.withShadows);

        if ( this.withShadows ) mesh.receiveShadow= true;
        return mesh;
    }

    _addLight1( scene ) {
        const light = new THREE.PointLight( 0xffffff, 2, 100 );
        light.position.set( 0, 40, 20 );
        scene.add(light);

        if ( this.withShadows ) {
            light.castShadow = true;

            if ( this.debug.shadows ) {
                scene.add(new THREE.CameraHelper(light.shadow.camera));
            }
        }
    }

    _addLight2( scene ) {
        const light = new THREE.DirectionalLight(0xffffff, 1.75);
        light.position.set(0, 80, 150);
        scene.add(light);

        if ( this.debug.lights ) {
            scene.add(new THREE.DirectionalLightHelper(light, 5));
        }

        if ( this.withShadows ) {
            light.castShadow = true;
            light.shadow.mapSize.width = 512;
            light.shadow.mapSize.height = 512;
            const d = 200;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.far = 1000;

            if ( this.debug.shadows ) {
                scene.add(new THREE.CameraHelper(light.shadow.camera));
            }
        }
    }

    _buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        scene.add( ambientLight );

// var axisHelper = new THREE.AxisHelper( 5 );
// scene.add( axisHelper );

        this._addLight1(scene);

        this.floorMesh= this._buildFloor();
        scene.add(this.floorMesh);

//        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
//        scene.add(light);

        this.mule1Mesh= this.modelLoader.getMesh('mule1');
        this.mule1Mesh.castShadow = true;
        scene.add(this.mule1Mesh);

        return scene;
    }

    _buildCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.mainWidth / this.mainHeight, 1, 1000);
        camera.position.z = 50;
        camera.position.y = 30;
        return camera;
    }

    run() {
        const scene= this._buildScene();
        const camera= this._buildCamera();

        camera.lookAt( scene.position );

        const animate= function() {
            requestAnimationFrame(animate);

//            this.mule1Mesh.rotation.y += 0.1;

//            camera.lookAt( scene.position );

            this.renderer.render(scene, camera);

            this.stats.update();

        }.bind(this);

        animate();
    }
};
