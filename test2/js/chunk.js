
class Chunk {

    constructor( x, y, z, cx, cy, cz, id, blockSize, type ) {
        this.type = type;
        this.id = id;
        this.from_x = x;
        this.from_y = y;
        this.from_z = z;
        this.chunk_size_x = cx;
        this.chunk_size_y = cy;
        this.chunk_size_z = cz;
        this.blockSize = blockSize;

        this.mesh= {};

        this.blocks= [];

        // console.log("CHUNK", this);
    }

    init() {
    }

    addBlock( x, y, z, r, g, b ) {
        this.blocks.push([ x, y, z, r, g, b ]);

        // console.log("BLOCK", x,y,z,r,g,b);
    }

    build() {
    }
}
