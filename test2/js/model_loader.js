//////////////////////////////////////////////////////////////////////
// ModelLoader class (Loads both .vox and image files)
//////////////////////////////////////////////////////////////////////

let all2= promises => {
    if ( promises.length >= 2 ) return Promise.all(promises);
    if ( promises.length ) return promises[0];
    return Promise.resolve();
};


class ModelLoader {

    constructor( withShadows, MeshMaterial ) {
        this.withShadows= withShadows;
        this.MeshMaterial= MeshMaterial;
        this.defs= {};
        this.models= {};
    }

    _loadModel( def, raw ) {
        const vox= new Vox();
        const model= vox.LoadModel(raw, def.name);

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

        if ( this.withShadows ) chunk.mesh.castShadow = true;

        return chunk;
    }

    _addModel( def, data ) {
        this.defs[def.name]= def;
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

    getMesh( name ) {

// WTF Firefox? Wo sind meine this.models-Eintraege?
// console.log("getMesh", name, this, Object.keys(this.models)); die();

        // FIXME: Kann static sein
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const model= this.models[name];
        const group = new THREE.Group();
        for ( let i= 0; i < model.blocks.length; i++ ) {
            const block= model.blocks[i];
            const rgb= (block[3] << 16) + (block[4] << 8) + block[5];
            const material = new this.MeshMaterial({ color: rgb });
            const mesh = new THREE.Mesh(geometry, material);

            if ( this.withShadows ) mesh.castShadow = true;

            mesh.position.x += block[0] - 19;
            mesh.position.y += block[1];
            mesh.position.z += block[2] - 3;

            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            group.add(mesh);
        }
        return group;
    }
}
