
// HACK: Funktionen, die von Chunk benoetigt werden
let GameProxy= function( game ) {
    const todo= [
        'addToCD',
        'chunk__material',
        'particles__blood',
        'particles_box__debris',
        'particles_box__world_debris',
        'particles__chunkDebris',
        'particles__debris',
        'particles__radioactive_leak',
        'particles__radioactive_splat',
        'removeFromCD',
        'scene__add',
        'scene__remove',
        'world__addBlock',
        'world__checkExists',
    ];

    todo.forEach(fname => {
        this[fname]= (...args) => {
            console.trace("Not Implemented", fname, args);
        };
    });

    this.chunk_material= () => {
        if ( !this._chunk_material ) {
            this._chunk_material = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, wireframe: false });
        }
        return this._chunk_material;
    };

    this.scene_add= mesh => {
        game.sceneAdd(mesh);
    };
};

let gameProxy;

new Game(GameProxy)
    .init({
        onCreate: game => {
            gameProxy= new GameProxy(game);
        },

        debug: {
            // lights: true,
            // shadows: true,
            stats: true,
        },

        // withShadows: true,

        // meshMaterial: 'Phong',
        // meshMaterial: 'Standard',
        meshMaterial: 'Toon',

        models: {
            mule1: [ "models/mule1.vox", 1, "object" ],
            mule2: [ "models/mule2.vox", 1, "object" ],
            mule3: [ "models/mule3.vox", 1, "object" ],
            mule4: [ "models/mule4.vox", 1, "object" ],
            mule5: [ "models/mule5.vox", 1, "object" ],
            mule6: [ "models/mule6.vox", 1, "object" ],
            mule_title: [ "models/mule-title.png", 1, "object" ],
        }
    })
    .then(game => game.run())
;
