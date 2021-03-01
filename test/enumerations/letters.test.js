path = require('path');

enumerations = require(path.resolve(__dirname, '..', '..', 'src', 'enumerations.js'))


test('Letters - basic enumerations', () => {
    let sampleInput = `#a.# little kitty, #a.# little kitties, #a.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `a. little kitty, b. little kitties, c. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Letters - enumerations in multi-line document', () => {
    let sampleInput = `#a.# little kitty\n#a.# little kitties\n#a.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `a. little kitty\nb. little kitties\nc. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Letters - multiple overlapping enumerations', () => {
    let sampleInput = `#a.# little kitty, #§a# little doggy, #a.# little kitties, #§a# little doggies`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `a. little kitty, §a little doggy, b. little kitties, §b little doggies\n`;
    expect(processed == expected).toBe(true);
});

test('Letters - enumerations in different formats', () => {
    expect(enumerations.substitute('#a#')).toBe('a\n');
    expect(enumerations.substitute('#a.#')).toBe('a.\n');
    expect(enumerations.substitute('#§a#')).toBe('§a\n');
    expect(enumerations.substitute('#§a.#')).toBe('§a.\n');
    expect(enumerations.substitute('#Art. a#')).toBe('Art. a\n');
    expect(enumerations.substitute('#a little# kitty')).toBe('a little kitty\n');
});

test('Letters - reset values', () => {
    expect(enumerations.substitute('#a# 3 #a# 4 #[0]a#')).toBe('a 3 b 4 0\n');
    expect(enumerations.substitute('#[e]a# 3 #a# 4 #a#')).toBe('e 3 f 4 g\n');
    expect(enumerations.substitute('#[e:2]a# 3 #a# 4 #a#')).toBe('e 3 g 4 i\n');
    expect(enumerations.substitute('#[e:-2]a# -2= #a# -2= #a# -2= #a#')).toBe('e -2= c -2= a -2= -a\n');
    expect(enumerations.substitute('#[e:2000000]a# << #a# << #a# << #a#')).toBe('e << ditog << hsodi << mcisk\n');
});

test('Letters - "large" numbers', () => {
    let input = "#a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a#";
    input += "#a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a##a# #a#";
    let output = "abcdefghijklmnopqrstuwvxyzaaabacadaeafagahaiajakalamanaoapaqarasatauawavaxayazbabbbc bd\n";
    expect(enumerations.substitute(input)).toBe(output);
});

// TODO: test edge cases
