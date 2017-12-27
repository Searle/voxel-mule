
class Game {

    constructor() {
        this.modelLoader= new ModelLoader();
        this.mainWidth= window.innerWidth * .8;
        this.mainHeight= window.innerHeight * .8;
        this.renderer = new THREE.WebGLRenderer();
    }

    init( args ) {

        this.renderer.setSize(this.mainWidth, this.mainHeight);
        document.body.appendChild( this.renderer.domElement );

        return this.modelLoader.loadModels(args.models).then(() => Promise.resolve(this));
    }

    _buildFloor() {
        let geometry= new THREE.BoxGeometry(100, 1, 100);
        let material= new THREE.MeshPhongMaterial({ color: 0xff6060 });

        let mesh= new THREE.Mesh(geometry, material);
        // mesh.position.x -= 50;
        mesh.position.y -= .5;
        // mesh.position.z -= 50;
        return mesh;
    }

    _buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

var axisHelper = new THREE.AxisHelper( 5 );
scene.add( axisHelper );

        var light1 = new THREE.PointLight( 0xffffff, 2, 100 );
        light1.position.set( 0, 20, 20 );
        scene.add( light1 );

        this.floorMesh= this._buildFloor();
        scene.add(this.floorMesh);

//        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
//        scene.add(light);

        this.mule1Mesh= this.modelLoader.getMesh('mule1');
        scene.add(this.mule1Mesh);

        return scene;
    }

    _buildCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.mainWidth / this.mainHeight, 1, 1000);
        camera.position.z = 50;
        camera.position.y = 10;
        return camera;
    }

    run() {
        const scene= this._buildScene();
        const camera= this._buildCamera();

        camera.lookAt( scene.position );

        const animate= function() {
            requestAnimationFrame(animate);

            this.mule1Mesh.rotation.y += 0.1;

//            camera.lookAt( scene.position );

            this.renderer.render(scene, camera);
        }.bind(this);

        animate();
    }
};
