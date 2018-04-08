const bitmapHeader = require('./bitmap-header');
const fs = require('fs');
const readFrom = require('./read-from');

class BitmapTransformer {
    constructor(inputFile, header) {
        this.inputFile = inputFile;
        this.header = header;
    }
    
    transform(transformation, outputFile) {
        const readStream = fs.createReadStream(this.inputFile);
        const writeStream = fs.createWriteStream(outputFile);

        return new Promise((resolve, reject) => {
            readFrom(this.inputFile, this.header.pixelOffset - 1)
                .then(buffer => {
                    writeStream.write(buffer);
                });   

        // readStream.on('close', () => {
        //     writeStream.end(resolve);
        // });
        
        // readStream.on('error', reject);
        // });

        // const buf = this.buffer;
        // const head = this.header;
        
        // for(let i = head.pixelOffset; i < head.fileSize; i += 3) {
        //     const pixel = {};
        //     pixel.b = buf.readUInt8(i);
        //     pixel.g = buf.readUInt8(i + 1);
        //     pixel.r = buf.readUInt8(i + 2);
        
        //     const newPixel = transformation(pixel);
        
        //     buf.writeUInt8(newPixel.b, i);
        //     buf.writeUInt8(newPixel.g, i + 1);
        //     buf.writeUInt8(newPixel.r, i + 2);
        // }
        //     // });
        });
    }
}

BitmapTransformer.create = function(inputFile) {
    return bitmapHeader(inputFile)
        .then(header => {
            return new BitmapTransformer(inputFile, header);
        });
};

module.exports = BitmapTransformer;


