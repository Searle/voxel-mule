/////////////////////////////////////////////////////////////////////
// Objects
/////////////////////////////////////////////////////////////////////
function Obj() {
    this.chunk = 0;
    this.active = [];
    this.ptr = 0;
    this.base_type = "object";
    this.red_light = new THREE.PointLight(0xFF00AA, 2, 10);
    this.yellow_light = new THREE.PointLight(0xFFAA00, 2, 80);
    this.green_light = new THREE.PointLight(0x00FF00, 2, 10);
    this.streetlight = new THREE.SpotLight(0xFFAA00);
    this.max = 20;

    Obj.prototype.create = function(model, size) {
        this.chunk = game.modelLoader.getModel(model, size, this);
        this.chunk.mesh.visible = false;
        this.chunk.mesh.rotation.set(Math.PI, 0, 0);
    };

    Obj.prototype.update = function(time, delta) {
    };

    Obj.prototype.destroy = function() {
      //  this.chunk.explode();
    };
}

function FFChunk() {
    Obj.call(this);
    this.base_type = "";
    this.type = "ff_chunk";

    FFChunk.prototype.hit = function(dmg, dir, type, pos) {
        dir.x += (1-get_rand()*2);
        dir.y += (1-get_rand()*2);
        dir.z += (1-get_rand()*2);
        this.chunk.explode(dir, dmg);
        this.alive = false;
        game.removeFromCD(this.chunk.mesh);
    };

    FFChunk.prototype.create = function(chunk) {
        this.chunk = chunk;
        this.base_type = chunk.owner.base_type;
        this.chunk.owner = this;
        this.chunk.build();
        game.maps.loaded.push(this);
        game.addToCD(this.chunk.mesh);
        //game.addToCD(this.chunk.bb);

    };
};
FFChunk.prototype = new Obj; 
FFChunk.prototype.constructor = FFChunk;

function Mule() {
    Obj.call(this);

    Mule.prototype.create = function( x, y, z ) {
        Obj.prototype.create.call(this, "mule1", 0.025);

        this.chunk.type = "object";
        this.chunk.owner = this;
        this.chunk.mesh.visible = true;

        // this.chunk.mesh.rotation.y = Math.PI / 2;
        // this.chunk.mesh.rotation.x = -Math.PI;

        var x= 0;
        var z= 0;
        this.chunk.mesh.position.set(x, 10, z);
    };
}
Mule.prototype = new Obj; 
Mule.prototype.constructor = Mule;
