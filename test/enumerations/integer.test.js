path = require('path');

enumerations = require(path.resolve(__dirname, '..', '..', 'src', 'enumerations.js'))
lineProcessor = require(path.resolve(__dirname, '..', '..', 'src', 'lineProcessor.js'))


test('Integer - basic enumerations', () => {
    let inputLine = `{#1.#} little kitty, {#1.#} little kitties, {#1.#} little kitties`;
    let line = lineProcessor.processLine(inputLine);

    expect(line.nodes.length).toBe(6);
    expect(line.nodes[0].nodes[0]).toBe("Hello World ");
    expect(line.nodes[0].originalStr).toBe("{#1.#}");
    expect(line.nodes[1].originalStr).toBe(" little kitty, ");
    expect(line.nodes[2].originalStr).toBe("{#1.#}");
    expect(line.nodes[3].originalStr).toBe(" little kitties, ");
    expect(line.nodes[4].originalStr).toBe("{#1.#}");
    expect(line.nodes[5].originalStr).toBe(" little kitties");
    expect(line.nodes[2].nodes[0]).toBe("!");
    // jest -t 'basic enumerations' test/enumerations/integer.test.js

    let processed = enumerations.substitute(sampleInput);
    let expected = `1. little kitty, 2. little kitties, 3. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Integer - enumerations in multi-line document', () => {
    let sampleInput = `#1.# little kitty\n#1.# little kitties\n#1.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `1. little kitty\n2. little kitties\n3. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Integer - multiple overlapping enumerations', () => {
    let sampleInput = `#1.# little kitty, #§1# little doggy, #1.# little kitties, #§1# little doggies`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `1. little kitty, §1 little doggy, 2. little kitties, §2 little doggies\n`;
    expect(processed == expected).toBe(true);
});

test('Integer - enumerations in different formats', () => {
    expect(enumerations.substitute('#1#')).toBe('1\n');
    expect(enumerations.substitute('#1.#')).toBe('1.\n');
    expect(enumerations.substitute('#§1#')).toBe('§1\n');
    expect(enumerations.substitute('#§1.#')).toBe('§1.\n');
    expect(enumerations.substitute('#Art. 1#')).toBe('Art. 1\n');
    expect(enumerations.substitute('#1 little# kitty')).toBe('1 little kitty\n');
});

test('Integer - reset values', () => {
    expect(enumerations.substitute('#1# 3 #1# 4 #[0]1#')).toBe('1 3 2 4 0\n');
    expect(enumerations.substitute('#[5]1# 3 #1# 4 #1#')).toBe('5 3 6 4 7\n');
    expect(enumerations.substitute('#[5:2]1# 3 #1# 4 #1#')).toBe('5 3 7 4 9\n');
    expect(enumerations.substitute('#[5:-2]1# -2= #1# -2= #1# -2= #1#')).toBe('5 -2= 3 -2= 1 -2= -1\n');
    expect(enumerations.substitute('#[5:2000000]1# << #1# << #1# << #1#')).toBe('5 << 2000005 << 4000005 << 6000005\n');
});

// TODO: test edge cases
