path = require('path');

enumerations = require(path.resolve(__dirname, '..', '..', 'src', 'enumerations.js'))


test('Capital Letters - basic enumerations', () => {
    let sampleInput = `#A.# little kitty, #A.# little kitties, #A.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `A. little kitty, B. little kitties, C. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Capital Letters - enumerations in multi-line document', () => {
    let sampleInput = `#A.# little kitty\n#A.# little kitties\n#A.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `A. little kitty\nB. little kitties\nC. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Capital Letters - multiple overlapping enumerations', () => {
    let sampleInput = `#A.# little kitty, #§A# little doggy, #A.# little kitties, #§A# little doggies`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `A. little kitty, §A little doggy, B. little kitties, §B little doggies\n`;
    expect(processed == expected).toBe(true);
});

test('Capital Letters - enumerations in different formats', () => {
    expect(enumerations.substitute('#A#')).toBe('A\n');
    expect(enumerations.substitute('#A.#')).toBe('A.\n');
    expect(enumerations.substitute('#§A#')).toBe('§A\n');
    expect(enumerations.substitute('#§A.#')).toBe('§A.\n');
    expect(enumerations.substitute('#Art. A#')).toBe('Art. A\n');
    expect(enumerations.substitute('#A little# kitty')).toBe('A little kitty\n');
});

test('Capital Letters - reset values', () => {
    expect(enumerations.substitute('#A# 3 #A# 4 #[0]A#')).toBe('A 3 B 4 0\n');
    expect(enumerations.substitute('#[E]A# 3 #A# 4 #A#')).toBe('E 3 F 4 G\n');
    expect(enumerations.substitute('#[E:2]A# 3 #A# 4 #A#')).toBe('E 3 G 4 I\n');
    expect(enumerations.substitute('#[E:-2]A# -2= #A# -2= #A# -2= #A#')).toBe('E -2= C -2= A -2= -A\n');
    expect(enumerations.substitute('#[E:2000000]A# << #A# << #A# << #A#')).toBe('E << DITOG << HSODI << MCISK\n');
});

test('Capital Letters - "large" numbers', () => {
    let input = "#A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A#";
    input += "#A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A##A# #A#";
    let output = "ABCDEFGHIJKLMNOPQRSTUWVXYZAAABACADAEAFAGAHAIAJAKALAMANAOAPAQARASATAUAWAVAXAYAZBABBBC BD\n";
    expect(enumerations.substitute(input)).toBe(output);
});

// TODO: test edge cases
