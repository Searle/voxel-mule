
class Game {

    _onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    _onDocumentMouseMove( event ) {
        this.mouseX = ( event.clientX - this.windowHalfX ) * 10;
        this.mouseY = ( event.clientY - this.windowHalfY ) * 10;
    }

    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        document.addEventListener( 'mousemove', this._onDocumentMouseMove.bind(this), false );

        const container = document.createElement( 'div' );
        document.body.appendChild(container);

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
        this.scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

        const geometry = new THREE.BoxGeometry( 100, 100, 100 );
        const material = new THREE.MeshNormalMaterial();

        this.group = new THREE.Group();

        for ( let i = 0; i < 1000; i ++ ) {

            let mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = Math.random() * 2000 - 1000;
            mesh.position.y = Math.random() * 2000 - 1000;
            mesh.position.z = Math.random() * 2000 - 1000;

            mesh.rotation.x = Math.random() * 2 * Math.PI;
            mesh.rotation.y = Math.random() * 2 * Math.PI;

            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            this.group.add( mesh );
        }

        this.scene.add( this.group );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        container.appendChild( this.renderer.domElement );

        this.stats = new Stats();
        container.appendChild( this.stats.dom );

        window.addEventListener( 'resize', this._onWindowResize.bind(this), false );
    }

    init( args ) {
        return Promise.resolve(this);
    }

    _render() {

        var time = Date.now() * 0.001;

        const rx = Math.sin( time * 0.7 ) * 0.5;
        const ry = Math.sin( time * 0.3 ) * 0.5;
        const rz = Math.sin( time * 0.2 ) * 0.5;

        this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
        this.camera.position.y += ( -this.mouseY - this.camera.position.y ) * .05;

        this.camera.lookAt( this.scene.position );

        this.group.rotation.x = rx;
        this.group.rotation.y = ry;
        this.group.rotation.z = rz;

        this.renderer.render( this.scene, this.camera );
    }

    run() {
        const animate= function() {
            requestAnimationFrame(animate);
            this._render();
            this.stats.update();
        }.bind(this);

        animate();
    }
}
