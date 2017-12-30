
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

        withShadows: true,

        // meshMaterial: 'Phong',
        // meshMaterial: 'Standard',
        meshMaterial: 'Toon',

        models: {
            mule1: { file: "models/mule1.vox" },
            mule2: { file: "models/mule2.vox" },
            mule3: { file: "models/mule3.vox" },
            mule4: { file: "models/mule4.vox" },
            mule5: { file: "models/mule5.vox" },
            mule6: { file: "models/mule6.vox" },
            mule_title: { file: "models/mule-title.png", lazy: true },
        }
    })
    .then(game => game.run())
;
