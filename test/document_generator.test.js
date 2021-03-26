fs = require('fs');
path = require('path');

processor = require(path.resolve(__dirname, '..', 'src', 'processor.js'))


test('Basic document generation.', () => {
    let sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    let document = processor.getDocument(sampleInput);
    expect(document.nodes.length).toBe(1);
});
