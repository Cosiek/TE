const REGEX = /(^|[^\\]){{([^=}]+)(=(.*?))?([^\\])}}/g

function handleSubstitutions(text){
    // TODO: handle all-whitespace cases
    // TODO: definition after use
    // {{ token=value }} for assigning and insert
    // {{ token }} for insert
    let newText = "";
    let values = new Map();
    for (let line of text.split('\n')){
        let matchesIterator = line.matchAll(REGEX);
        newLine = line;
        for (let match of matchesIterator){
            let key = match[2].trim();
            let val = ("" + match[4]).trim()
            if (match[4] && val.length){
                val += match[5]
                val = val.trim()
                val = val.replace(/\\(.)/g, "$1")
                values.set(key, val);
            } else {
                key += match[5];
                key = key.trim()
            }
            newLine = newLine.replace(match[0], match[1] + values.get(key));
        }
        newText += newLine + "\n"
    }
    return newText;
}

module.exports.substitute = handleSubstitutions;
