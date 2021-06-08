fs = require('fs');
path = require('path');

lineProcessor = require(path.resolve(__dirname, '..', 'src', 'lineProcessor.js'))


test('Basic line processing.', () => {
    let inputLine = "Hello World!"
    let line = lineProcessor.processLine(inputLine);
    expect(line.nodes.length).toBe(1);

    inputLine = "Hello World {# Hej 1 #}!"
    line = lineProcessor.processLine(inputLine);
    expect(line.nodes.length).toBe(3);
    expect(line.nodes[0].nodes[0]).toBe("Hello World ");
    expect(line.nodes[1].originalStr).toBe("{# Hej 1 #}");
    expect(line.nodes[2].nodes[0]).toBe("!");
});

test('Escaping.', () => {
    let escapingInput = fs.readFileSync(path.resolve(__dirname, 'escaping_input'), 'utf8');
    lines = escapingInput.split("\n")

    // pointless escaping
    line = lineProcessor.processLine(lines[0]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("Hello World - pointless escaping");

    line = lineProcessor.processLine(lines[1]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("Last char escaped\\");

    line = lineProcessor.processLine(lines[2]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("\\ First one secaped");

    line = lineProcessor.processLine(lines[3]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("Hello {# World 1 #}! - escaping enumeration");

    line = lineProcessor.processLine(lines[4]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("Hello World #1! - escaping enumeration 2");

    line = lineProcessor.processLine(lines[5]);
    expect(line.nodes.length).toBe(1);
    expect(line.nodes[0].nodes.length).toBe(1);
    expect(line.nodes[0].nodes[0]).toBe("Hello {# World #1 #}! - escaping enumeration 3");
});
