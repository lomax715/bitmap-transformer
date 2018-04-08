const assert = require('assert');
const { promisify } = require('util');
const unlink = promisify(require('fs').unlink);
const fs = require('fs');
const BitmapTransformer = require('../lib/bitmap-transformer');
const readFrom = require('../lib/read-from');
const bitmapHeader = require('../lib/bitmap-header');
const invert = require('../lib/invert-transformer');

describe('bitmap file transformer', () => {

    const readFile = file => (fs.readFileSync(file));
    const testFile = './test/test-bitmap.bmp';
    const invertedFile = './test/inverted-results.bmp';
    
    beforeEach(() => {
        return unlink(invertedFile)
            .catch(err => {
                if(err.code !== 'ENOENT') throw err;
            }); 
    });

    let transformer = null;
    beforeEach(() => {
        // transformer = BitmapTransformer.create(testFile);
        return BitmapTransformer.create(testFile)
            .then(newTransformer => transformer = newTransformer);
    });

    it('has a static "create" method that returns a new instance with properties "inputFile" and "header"', () => {
        assert.equal(transformer.inputFile, testFile);
        assert.deepEqual(transformer.header, { pixelOffset: 54, bitsPerPixel: 24, fileSize: 30054 });
    });

    it('copies the header from a bmp file to a new file', () => {
        let originalHeader, generatedHeader;

        function fetchNewHeader() {
            return transformer.transform(invert, invertedFile)
                .then(() => {
                    return readFrom(invertedFile, 53)
                        .then(buffer => {
                            generatedHeader = buffer;
                        });
                });
        }

        function fetchOriginalHeader() {
            return readFrom(testFile, 53)
                .then(buffer => {
                    originalHeader = buffer;
                });
        }
            
        Promise.all([fetchNewHeader(), fetchOriginalHeader()])
            .then(() => {
                assert.deepEqual(originalHeader, generatedHeader);
            });
    });

    it.skip('can invert a bitmap image', () => {
        return transformer.transform(invert, invertedFile)
            .then(() => {
                const actual = readFile(invertedFile);
                const expected = readFile('./test/inverted-expected.bmp');
                assert.deepEqual(actual, expected);
            });
    });
});