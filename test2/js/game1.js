
class Game {

    init( args ) {

        let container= document.body;

        if ( args.onCreate ) args.onCreate(this);

        this.withShadows= !!args.withShadows;
        this.debug= args.debug || {};
        this.MeshMaterial= args.meshMaterial ? THREE['Mesh' + args.meshMaterial + 'Material'] : THREE.MeshLambertMaterial;

        this.modelLoader= new ModelLoader(this.withShadows, this.MeshMaterial);
        this.mainWidth= window.innerWidth * .8;
        this.mainHeight= window.innerHeight * .8;
        this.mainHeight= this.mainWidth * 10 / 16;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.mainWidth, this.mainHeight);
        if ( this.withShadows ) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        container.appendChild( this.renderer.domElement );

        if ( this.debug.stats ) {
            this.stats = new Stats();
            container.appendChild( this.stats.dom );
        }

        this.scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xffffff );
        this.scene.background = new THREE.Color( 0x99fff7 );
        this.scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        this.scene.add( ambientLight );

        return this.modelLoader.loadModels(args.models).then(() => Promise.resolve(this));
    }

    _buildFloor() {
        let geometry= new THREE.PlaneGeometry(500, 500);
        let material= new this.MeshMaterial({ color: 0xffdd00 });

        let mesh= new THREE.Mesh(geometry, material);
        mesh.rotation.x= -Math.PI / 2;

        if ( this.withShadows ) mesh.receiveShadow= true;
        return mesh;
    }

    _addLight1( scene ) {
        const light = new THREE.PointLight( 0xffffff, 1, 100 );
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

    _initScene() {

        // var axisHelper = new THREE.AxisHelper( 5 );
        // scene.add( axisHelper );

        this._addLight1(this.scene);
        // this._addLight2(this.scene);

        this.floorMesh= this._buildFloor();
        this.scene.add(this.floorMesh);

        // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        // this.scene.add(light);

/*
        this.muleMesh= [
            [ 0 ], [ 2 ], [ 2 ], [ 4 ], [ 6 ], [ 6 ]
        ];
        for ( let i= 0; i < 6; i++ ) {
            this.muleMesh[i][1]= this.modelLoader.getMesh('mule' + (i + 1));
            scene.add(this.muleMesh[i][1]);
        }

*/
        return this.scene;
    }

    _buildCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.mainWidth / this.mainHeight, 1, 1000);
        camera.position.z = 50;
        camera.position.y = 10;
        return camera;
    }

    sceneAdd( mesh ) {
        this.scene.add(mesh);
    }

    run() {
        const scene= this._initScene();
        const camera= this._buildCamera();

        const muleMesh= [
            [ 0 ], [ 2 ], [ 2 ], [ 4 ], [ 6 ], [ 6 ]
        ];
        for ( let i= 0; i < 6; i++ ) {
            muleMesh[i][1]= this.modelLoader.getModel('mule' + (i + 1)).mesh;
        }

        const titleMesh= this.modelLoader.getModel('mule_title').mesh;
        titleMesh.visible= true;
        titleMesh.rotation.x= Math.PI;
        titleMesh.position.z= -40;

        // camera.lookAt( scene.position );

        let muleRange= 200;
        let camX= 0;

        const animate= function() {
            requestAnimationFrame(animate);

            let t= Date.now();

            let muleX= (t / 150) % muleRange;
            const muleX8= muleX % 8;
            let n= Math.floor(muleX8 * 6 / 8);

            for ( let i= 0; i < 6; i++ ) {
                muleMesh[i][1].visible= i == n;
            }

            const mesh= muleMesh[n][1];
            mesh.position.x= muleX - muleRange * .5 - muleX8 + muleMesh[n][0];

            camX= (mesh.position.x + camX) / 2;

//            camera.position.x= camX;

            camera.lookAt({ x: camX, y: mesh.position.y, z: mesh.position.z });

//            camera.lookAt( scene.position );

            this.renderer.render(scene, camera);

            if ( this.debug.stats ) this.stats.update();

        }.bind(this);

        animate();
    }
};
