path = require('path');

processor = require(path.resolve(__dirname, '..', 'src', 'processor.js'))


test('Basic document generation.', () => {
    let document = processor.getDocument("Hello World!");
    expect(document.paragraphs.length).toBe(0);

});
