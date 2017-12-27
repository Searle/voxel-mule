
class Game {

    constructor() {
        this.modelLoader= new ModelLoader();
    }

    init( args ) {
        return this.modelLoader.loadModels(args.models).then(() => Promise.resolve(this));
    }

    run() {
        // modelLoader.init();

        const scene = new THREE.Scene();

        const mainWidth= window.innerWidth * .8;
        const mainHeight= window.innerHeight * .8;

        const camera = new THREE.PerspectiveCamera(75, mainWidth / mainHeight, 1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( mainWidth, mainHeight );
        document.body.appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const group = new THREE.Group();

        camera.position.z = 100;

        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );

        const model= this.modelLoader.getModel('mule1');
        for ( let i= 0; i < model.blocks.length; i++ ) {
            const block= model.blocks[i];
            const rgb= (block[3] << 16) + (block[4] << 8) + block[5];
            const material = new THREE.MeshPhongMaterial( { color: rgb } );
            const cube0 = new THREE.Mesh( geometry, material );
            cube0.position.x += block[0] - 19;
            cube0.position.y += block[1] - 10.5;
            cube0.position.z += block[2] - 3;
            group.add( cube0 );
        }

        scene.add( group );

        const animate= function() {
            requestAnimationFrame(animate);

            group.rotation.y += 0.1;

            camera.lookAt( scene.position );

            renderer.render(scene, camera);
        }

        animate();
    }
};
