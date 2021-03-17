path = require('path');

substitutions = require(path.resolve(__dirname, '..', 'src', 'substitutions.js'))


test('Basic substitutions', () => {
    let sampleInput = "1 {{size=little}} kitty, 2 {{size}} kitties, 3 {{size}} kitties";
    let expected = "1 little kitty, 2 little kitties, 3 little kitties\n";
    expect(substitutions.substitute(sampleInput)).toBe(expected);
});

test('Substitutions - proper escaping', () => {
    let sampleInput = "1 \{{little}} kitty, 2 {{size=little\}}} kitties, 3 {{size}} kitties, 4 {{size}} kitties";
    //sampleInput = "1 \{{little}} kitty, 2 {{size=little\}}} kitties, 3 {{size}} kitties, 4 {{size}} kitties";
    //sampleInput = "1 \{{little}} kitty, 2 {{size=little\}}} kitties, 3 {{size}} kitties, 4 {{size}} kitties";
    let expected = "1 \{{little}} kitty, 2 little\} kitties, 3 little\} kitties, 4 little\} kitties\n";
    //expect(substitutions.substitute(sampleInput)).toBe(expected);
    expect(substitutions.substitute("1 \\{{little}} kitty")).toBe("1 \\{{little}} kitty\n");
    expect(substitutions.substitute("1 {\\{little}} kitty")).toBe("1 {\\{little}} kitty\n");
    expect(substitutions.substitute("1 {{little\\}} kitty")).toBe("1 {{little\\}} kitty\n");
    expect(substitutions.substitute("1 {{little}\\} kitty")).toBe("1 {{little}\\} kitty\n");
    expect(substitutions.substitute("1 {{size=lit\\}tle}} kitty")).toBe("1 lit}tle kitty\n");
    expect(substitutions.substitute("1 {{size=little\\}}} kitty")).toBe("1 little} kitty\n");
    expect(substitutions.substitute("1 {{size=lit=tle}} kitty")).toBe("1 lit=tle kitty\n");
});

test('Substitutions - all-whitespace cases', () => {});
test('Substitutions - definition after use', () => {});
test('Substitutions - redefinition', () => {});
test('Substitutions - undeclared', () => {});

test('Substitutions - definition after use', () => {
    let sampleInput = "1 {{size}} kitty, 2 {{size}} kitties, 3 {{size=little}} kitties";
    let expected = "1 little kitty, 2 little kitties, 3 little kitties\n";
    expect(substitutions.substitute(sampleInput)).toBe(expected);
});
