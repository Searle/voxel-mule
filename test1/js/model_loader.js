//////////////////////////////////////////////////////////////////////
// ModelLoader class (Loads both .vox and image files)
//////////////////////////////////////////////////////////////////////
function ModelLoader() {
    this.models = []
    this.models["mule1"] = ["assets/vox/mule1.vox", 1, "object"];
    // this.models["player"] = ["assets/vox/player.vox", 1, "object"];

    this.files = [];

    ModelLoader.prototype.init = function() {
        for(var k in this.models) {
            this.files.push(k);
        }
    };

    ModelLoader.prototype.loadFiles = function( doneFn ) {
        if(this.files.length > 0) {
            key = this.files.pop();   
        } else {
            return doneFn();
        }

        var that = this;
        if(this.models[key][0].indexOf("vox") != -1) {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", this.models[key][0], true);
            oReq.responseType = "arraybuffer";

            var that = this;
            oReq.send(null);
            oReq.onload = function () {
                that.models[key][0] = oReq.response;
                that.loadModel(key);
                that.loadFiles(doneFn);
            };
        } else if(this.models[key][0].indexOf("png") != 1) {
            loadImageFile(this.models[key][0], function(data, width, height) {
                var chunk = new Chunk(0, 0, 0, width, height, that.models[key][1], key, 1, that.models[key][2]);
                chunk.init();
               // var data2 = [];
                for(var i = 0; i < data.length; i++) {
                    for(var y = 0; y < that.models[key][1]; y++) {
                        //data2.push({x: data[i].x, y: data[i].y, z: y, r: data[i].r, g: data[i].g, b: data[i].b});
                        chunk.addBlock(data[i].x, data[i].y, y, data[i].r, data[i].g, data[i].b);
                    }
                }
                chunk.blockSize = 1;
                chunk.build();
                //chunk.batch_points = data2;
                //chunk.bp = data2.length;
                //chunk.addBatch();
                that.models[key] = chunk;
                // Remove mesh from scene (cloned later)
                chunk.mesh.visible = false;
                that.loadFiles();
            });
        }
    };

    ModelLoader.prototype.loadModel = function(name) {
        var vox = new Vox();
        var model = vox.LoadModel(this.models[name][0], name);
        var p = 0, r = 0, g = 0, b = 0;
        var chunk = new Chunk(0, 0, 0, model.sx, model.sz, model.sy, name, this.models[name][1], this.models[key][2]);
        chunk.blockSize = this.models[name][1];
        chunk.init();
        for(var i = 0; i < model.data.length; i++) {
            p = model.data[i];
            r = (p.val >> 24) & 0xFF;
            g = (p.val >> 16) & 0xFF;
            b = (p.val >> 8) & 0xFF;
            if(p.y > model.sy || p.x > model.sx || p.z > model.sz) {
                continue;
            }
            chunk.addBlock(p.x, p.z, p.y, r, g, b);
        }
        //chunk.addBatch();
        // Remove mesh from scene (cloned later)
        chunk.build();
        chunk.mesh.visible = false;
        this.models[name] = chunk;
    };

    ModelLoader.prototype.getModel = function(name, size, obj, only_mesh) {
        if(size == null) { size = 1; }
        if(only_mesh == null) { only_mesh = false; }
        // Depp copy chunk
        var new_obj;
        if(only_mesh) {
            new_obj = {};
            new_obj.owner = obj;
            new_obj.mesh = this.models[name].mesh.clone();
            new_obj.mesh.owner = obj;
         //   new_obj.bb = this.models[name].bb.clone();
           // new_obj.bb.owner = obj;
            //new_obj.mesh.add(new_obj.bb);
            new_obj.mesh.visible = true;
            new_obj.mesh.scale.set(size, size, size);
            game.scene.add(new_obj.mesh);
            game.addToCD(new_obj.mesh);
        } else {
            var new_obj = jQuery.extend(true, {}, this.models[name]);
            new_obj.owner = obj;
            new_obj.blockSize = size;
           // new_obj.bb = undefined;
            new_obj.mesh = undefined;
            new_obj.build();
            // clone mesh and add to scene.
            // new_obj.mesh = this.models[name].mesh.clone();
            // new_obj.bb = this.models[name].bb.clone();
            
           // new_obj.mesh.geometry.computeBoundingBox();
           // new_obj.mesh.geometry.center();
            new_obj.mesh.visible = true;
            game.scene.add(new_obj.mesh);
        }
        return new_obj;
    };
}

