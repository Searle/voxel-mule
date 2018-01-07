//////////////////////////////////////////////////////////////////////
// ModelLoader class (Loads both .vox and image files)
//////////////////////////////////////////////////////////////////////

let all2= promises => {
    if ( promises.length >= 2 ) return Promise.all(promises);
    if ( promises.length ) return promises[0];
    return Promise.resolve();
};

// let promisize= fn => new Promise((resolve, reject) => fn((err, result) => err ? reject(err) : resolve(result));

function loadImageFile2( file, callback ) {
    var image = new Image();
    image.src = file;
    var ctx = document.createElement('canvas').getContext('2d');
    image.onload = function() {
        ctx.canvas.width  = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        var imgData = ctx.getImageData(0, 0, image.width, image.height);
        var list = [];
        for( var y = 0; y < image.height; y++ ) {
            var pos = y * image.width * 4;
            for( var x = 0; x < image.width; x++ ) {
                var r = imgData.data[pos++];
                var g = imgData.data[pos++];
                var b = imgData.data[pos++];
                var a = imgData.data[pos++];
                // if (a != 0 && !(r == 0 && g == 0 && b == 0) ) {
                if ( a != 0 ) {
                    if ( r == 0 && g == 0 && b == 0 ) r= 1;
                    list.push({ x: x, y: image.height - y - 1, z: 0, r: r, g: g, b: b, a: a });
                }
            }
        }
        callback(list, image.width, image.height);
    }
}

class ModelLoader {

    constructor( withShadows, MeshMaterial ) {
        this.withShadows= withShadows;
        this.MeshMaterial= MeshMaterial;
        this.models= {};
    }


    __addModel( def, index, chunk ) {
        var name= def.name + '_' + index;
        this.models[name]= Object.assign({}, def, { name: name, chunk: chunk });
    }


    _loadVox( def, raw ) {
        const vox= ParseVox(raw, def.name);
        for ( var m= 0; m < vox.models.length; m++ ) {
            const model= vox.models[m];
            const chunk= new Chunk(0, 0, 0, model.sx, model.sz, model.sy, def.name, def.blockSize, def.type);
            chunk.init();
            for ( let i = 0; i < model.voxels.length; i++ ) {
                const p= model.voxels[i];
                const r= (p.color >> 24) & 0xFF;
                const g= (p.color >> 16) & 0xFF;
                const b= (p.color >> 8) & 0xFF;
                if ( p.y > model.sy || p.x > model.sx || p.z > model.sz ) {
                    continue;
                }
                chunk.addBlock(p.x, p.z, p.y, r, g, b);
            }

            //chunk.addBatch();

            // Remove mesh from scene (cloned later)
            chunk.build();
            chunk.mesh.visible = false;
            chunk.mesh.position.y= (model.sz - 1) / 2;
            if ( this.withShadows ) chunk.mesh.castShadow = true;

            this.__addModel(def, m, chunk);
        }
        return Promise.resolve();
    }


    _loadImage( def, raw ) {
        return new Promise((resolve, reject) =>
            loadImageFile2(raw, (data, width, height) => {
                var chunk = new Chunk(0, 0, 0, width, height, def.depth, def.name, 1, def.type);
                chunk.init();

                if ( def.raw ) {
                    def.data= data;
                    def.width= width;
                    def.height= height;

                    chunk.addBlock(0, 0, 0, 0, 0, 1);
                    chunk.addBlock(width - 1, height - 1, def.depth - 1, 0, 0, 1);
                }
                else {
                    for( var i = 0; i < data.length; i++ ) {
                        for( var y = 0; y < def.depth; y++ ) {
                            chunk.addBlock(data[i].x, data[i].y, y, data[i].r, data[i].g, data[i].b);
                        }
                    }
                }

                chunk.blockSize = 1;
                chunk.build();
                //chunk.batch_points = data2;
                //chunk.bp = data2.length;
                //chunk.addBatch();
                // Remove mesh from scene (cloned later)
                chunk.mesh.visible = false;

                chunk.mesh.position.y= height / 2;

                if ( this.withShadows ) chunk.mesh.castShadow = true;

                this.__addModel(def, 0, chunk);
                resolve();
            })
        );
    }

    _addModel( def, response ) {
        this.models[def.name]= def;

        if ( /\.vox$/.test(def.file) ) {
            return response.arrayBuffer().then(ab => this._loadVox(def, ab));
        }

        if ( /\.png$/.test(def.file) ) {
            return response.blob().then(blob => this._loadImage(def, URL.createObjectURL(blob)));
        }

        return Promise.reject('_addModel: ' + def.file);
    }

    loadModels( defs ) {
        return all2(Object.keys(defs).map(name => {
            const def= defs[name];
            return fetch(def.file).then(response =>
                this._addModel({
                    name: name,
                    file: def.file,
                    blockSize: def.blockSize || 1,
                    type: def.type || 'object',
                    depth: def.depth || 1,
                    raw: def.raw || false,
                }, response))
            ;
        }));
    }

    getModel( name ) {
        return this.models[name];
    }

/*
    getMesh( name ) {

// WTF Firefox? Wo sind meine this.models-Eintraege?
// console.log("getMesh", name, this, Object.keys(this.models)); die();

        // FIXME: Kann static sein
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const model= this.models[name].chunk;
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
*/

}
