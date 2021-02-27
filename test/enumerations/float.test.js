path = require('path');

enumerations = require(path.resolve(__dirname, '..', '..', 'src', 'enumerations.js'))


test('Float - basic enumerations', () => {
    let sampleInput = `#1.0# little kitty, #1.0# little kitties, #1.0# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `1.0 little kitty, 2.0 little kitties, 3.0 little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Float - enumerations in multi-line document', () => {
    let sampleInput = `#1.0# little kitty\n#1.0# little kitties\n#1.0# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `1.0 little kitty\n2.0 little kitties\n3.0 little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Float - multiple overlapping enumerations', () => {
    let sampleInput = `#1.0# little kitty, #§1.0# little doggy, #1.0# little kitties, #§1.0# little doggies`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `1.0 little kitty, §1.0 little doggy, 2.0 little kitties, §2.0 little doggies\n`;
    expect(processed == expected).toBe(true);
});

test('Float - enumerations in different formats', () => {
    expect(enumerations.substitute('#1.0#')).toBe('1.0\n');
    expect(enumerations.substitute('#1,0#')).toBe('1,0\n');
    expect(enumerations.substitute('#§1.0#')).toBe('§1.0\n');
    expect(enumerations.substitute('#§1.0#')).toBe('§1.0\n');
    expect(enumerations.substitute('#Art. 1.0#')).toBe('Art. 1.0\n');
    expect(enumerations.substitute('#1.0 little# kitty')).toBe('1.0 little kitty\n');
});

test('Float - reset values', () => {
    expect(enumerations.substitute('#1,0# 3 #1,0# 4 #[0]1,0#')).toBe('1,0 3 2,0 4 0,0\n');
    expect(enumerations.substitute('#[5]1.0# 3 #1.0# 4 #1.0#')).toBe('5.0 3 6.0 4 7.0\n');
    expect(enumerations.substitute('#[5:2.1]1.0# 3 #1.0# 4 #1.0#')).toBe('5.0 3 7.1 4 9.2\n');
    expect(enumerations.substitute('#[5:-2]1.0# -2= #1.0# -2= #1.0# -2= #1.0#')).toBe('5.0 -2= 3.0 -2= 1.0 -2= -1.0\n');
    expect(enumerations.substitute('#[5:2000000]1.0# << #1.0# << #1.0# << #1.0#')).toBe(
    '5.0 << 2000005.0 << 4000005.0 << 6000005.0\n');
});

// TODO: test edge cases
