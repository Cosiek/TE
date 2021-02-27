path = require('path');

enumerations = require(path.resolve(__dirname, '..', '..', 'src', 'enumerations.js'))


test('Roman - basic enumerations', () => {
    let sampleInput = `#I.# little kitty, #I.# little kitties, #I.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `I. little kitty, II. little kitties, III. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Roman - numbers', () => {
    expect(enumerations.substitute('#I#')).toBe('I\n');
    expect(enumerations.substitute('#[II]I#')).toBe('II\n');
    expect(enumerations.substitute('#[III]I#')).toBe('III\n');
});

test('Roman - enumerations in multi-line document', () => {
    let sampleInput = `#I.# little kitty\n#I.# little kitties\n#I.# little kitties`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `I. little kitty\nII. little kitties\nIII. little kitties\n`;
    expect(processed === expected).toBe(true);
});

test('Roman - multiple overlapping enumerations', () => {
    let sampleInput = `#I.# little kitty, #§I# little doggy, #I.# little kitties, #§I# little doggies`;
    let processed = enumerations.substitute(sampleInput);
    let expected = `I. little kitty, §I little doggy, II. little kitties, §II little doggies\n`;
    expect(processed == expected).toBe(true);
});

test('Roman - enumerations in different formats', () => {
    expect(enumerations.substitute('#I#')).toBe('I\n');
    expect(enumerations.substitute('#I.#')).toBe('I.\n');
    expect(enumerations.substitute('#§I#')).toBe('§I\n');
    expect(enumerations.substitute('#§I.#')).toBe('§I.\n');
    expect(enumerations.substitute('#Art. I#')).toBe('Art. I\n');
    expect(enumerations.substitute('#I little# kitty')).toBe('I little kitty\n');
});

test('Roman - reset values', () => {
    expect(enumerations.substitute('#I# 3 #I# 4 #[I]I#')).toBe('I 3 II 4 I\n');
    expect(enumerations.substitute('#I# 3 #I# 4 #[0]I#')).toBe('I 3 II 4 0\n');
    expect(enumerations.substitute('#[V]I# 3 #I# 4 #I#')).toBe('V 3 VI 4 VII\n');
    expect(enumerations.substitute('#[V:2]I# 3 #I# 4 #I#')).toBe('V 3 VII 4 IX\n');
    expect(enumerations.substitute('#[V:-2]I# -2= #I# -2= #I# -2= #I#')).toBe('V -2= III -2= I -2= -I\n');
    expect(enumerations.substitute('#[V:20000]I# << #I#')).toBe('V << MMMMMMMMMMMMMMMMMMMMV\n');
    expect(enumerations.substitute('#[-V:4]I# +4 = #I# +4 = #I#')).toBe('-V +4 = -I +4 = III\n');
});

// TODO: test edge cases
