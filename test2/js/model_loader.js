//////////////////////////////////////////////////////////////////////
// ModelLoader class (Loads both .vox and image files)
//////////////////////////////////////////////////////////////////////

let all2= promises => {
    if ( promises.length >= 2 ) return promises.all();
    if ( promises.length ) return promises[0];
    return Promise.resolve();
};


class ModelLoader {

    constructor() {
        this.defs= {};
        this.models= {};
    }

    _loadModel( def, raw ) {
        const vox= new Vox();
        const model= vox.LoadModel(raw, def.name);

console.log("MODEL", model);

        const chunk= new Chunk(0, 0, 0, model.sx, model.sz, model.sy, def.name, def.blockSize, def.type);
        // chunk.blockSize= this.models[name][1];
        chunk.init();
        for ( let i = 0; i < model.data.length; i++ ) {
            const p= model.data[i];
            const r= (p.val >> 24) & 0xFF;
            const g= (p.val >> 16) & 0xFF;
            const b= (p.val >> 8) & 0xFF;
            if ( p.y > model.sy || p.x > model.sx || p.z > model.sz ) {
                continue;
            }
            chunk.addBlock(p.x, p.z, p.y, r, g, b);
        }
        //chunk.addBatch();
        // Remove mesh from scene (cloned later)
        chunk.build();
        chunk.mesh.visible = false;
        return chunk;
    }

    _addModel( def, data ) {
        const name= def.name;
        this.defs[name]= def;
        if ( /\.vox$/.test(def.file) ) {
            this.models[def.name]= this._loadModel(def, data);
        }
        console.log("FETCH", def);
    }

    loadModels( defs ) {
        return all2(Object.keys(defs).map(name => {
            const def= defs[name];
            return fetch(def[0]).then(response => {
                response.arrayBuffer().then(ab => this._addModel({
                        name: name,
                        file: def[0],
                        blockSize: def[1],
                        type: def[2],
                    }, ab));
            });
        }));
    }

    getModel( name ) {
        return this.models[name];
    }

    loadFiles() {
    }
}
