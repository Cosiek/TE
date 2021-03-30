fs = require('fs');
path = require('path');

lineProcessor = require(path.resolve(__dirname, '..', 'src', 'lineProcessor.js'))


test('Basic line processing.', () => {
    let inputLine = "Hello World!"
    let line = lineProcessor.processLine(inputLine);
    expect(line.nodes.length).toBe(1);

    "What do we do with something like that: \\"
});
