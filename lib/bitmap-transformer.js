const bitmapHeader = require('./bitmap-header');
const fs = require('fs');
const readFrom = require('./read-from');

class BitmapTransformer {
    constructor(inputFile, header) {
        this.inputFile = inputFile;
        this.header = header;
    }
    
    transform(transformation, outputFile) {
        if(this.header.bitsPerPixel !== 24) throw new Error('please use a bitmap file with 24 bits per pixel');
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(outputFile);

            readFrom(this.inputFile, this.header.pixelOffset)
                .then(buffer => {
                    writeStream.write(buffer, processPixels);
                });

            const readStream = fs.createReadStream(this.inputFile, { start: this.header.pixelOffset });
            let carryover = Buffer.from([]);
            
            function processPixels() {
                readStream.on('data', chunk => {
                    chunk = Buffer.concat([carryover, chunk]);
                    carryover = Buffer.from([]);

                    const remainder = chunk.length % 3;
                    let stop = chunk.length;

                    switch (remainder) {
                        case 1:
                            carryover = chunk.slice(-1);
                            stop = chunk.length - 1;
                            break;
                        case 2:
                            carryover = chunk.slice(-2);
                            stop = chunk.length - 2;
                            break;
                        default:
                            break;
                    }
                    transformPixels(transformation, chunk, stop);

                });

                readStream.on('close', () => {
                    if(carryover.length) writeStream.write(Buffer.from([0, 0]));
                    writeStream.end(resolve);
                });

                readStream.on('error', reject);

                function transformPixels(transformation, chunk, stop = chunk.length) {
                    for(let i = 0; i < stop; i += 3) {
                        const pixel = {};
                        pixel.b = chunk.readUInt8(i);
                        pixel.g = chunk.readUInt8(i + 1);
                        pixel.r = chunk.readUInt8(i + 2);
                        
                        const { b, g, r } = transformation(pixel);

                        const newPixel = Buffer.from([b, g, r]);
                        
                        writeStream.write(newPixel);
                    }
                }
            }
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


