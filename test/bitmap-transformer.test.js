const assert = require('assert');
const { promisify } = require('util');
const unlink = promisify(require('fs').unlink);
const fs = require('fs');
const BitmapTransformer = require('../lib/bitmap-transformer');
const invert = require('../lib/invert-transformer');

describe('bitmap file transformer', () => {

    const readFile = file => (fs.readFileSync(file));

    const invertedFile = './test/inverted-results.bmp';
    
    beforeEach(() => {
        return unlink(invertedFile)
            .catch(err => {
                if(err.code !== 'ENOENT') throw err;
            }); 
    });

    let transformer = null;
    beforeEach(() => {
        // transformer = BitmapTransformer.create('./test/test-bitmap.bmp');
        return BitmapTransformer.create('./test/test-bitmap.bmp')
            .then(newTransformer => {
                transformer = newTransformer;
            });
    });

    it('has a static "create" method that returns a new instance with properties "inputFile" and "header"', () => {
        assert.equal(transformer.inputFile, './test/test-bitmap.bmp');
        assert.deepEqual(transformer.header, { pixelOffset: 54, bitsPerPixel: 24, fileSize: 30054 });
    });

    it('test whole transform', () => {
        return transformer.transform(invert, invertedFile)
            .then(() => {
                const actual = readFile(invertedFile);
                const expected = readFile('./test/inverted-expected.bmp');
                assert.deepEqual(actual, expected);
            });
    });
});