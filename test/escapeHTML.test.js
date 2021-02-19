path = require('path');

escapeHTML = require(path.resolve(__dirname, '..', 'src', 'escapeHTML.js'))


test('Try escaping basic chars', () => {
    let sampleInput = `I have some <sctipt id="sinister">in('here')</script>`;
    let escaped = escapeHTML.escape(sampleInput);
    //expect(escaped.search("&")).toBe(-1);
    expect(escaped.search("<")).toBe(-1);
    expect(escaped.search(`"`)).toBe(-1);
    expect(escaped.search("'")).toBe(-1);
});
