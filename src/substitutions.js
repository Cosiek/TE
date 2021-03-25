const REGEX = /(^|[^\\]){{([^=}]+)(=(.*?))?([^\\])}}/g
const SIMPLER_REGEX = /(^|[^\\]){{([^=}]+)([^\\=])}}/g  // used for seconr iteration - where there are no
                                                        // value definitions.

function handleSubstitutions(text){
    // TODO: handle all-whitespace cases
    // TODO: definition after use
    // {{ token=value }} for assigning and insert
    // {{ token }} for insert
    let newText = "";
    let values = new Map();
    let missingKeys = new Map();
    let lines = text.split('\n');
    for (let counter in lines){
        newLine = lines[counter];
        let matchesIterator = newLine.matchAll(REGEX);
        for (let match of matchesIterator){
            let key = match[2].trim();
            let val = ("" + match[4]).trim()
            if (match[4] && val.length){
                val += match[5]
                val = val.trim()
                val = val.replace(/\\(.)/g, "$1")
                values.set(key, val);
                if (missingKeys.get(key) === undefined){
                    missingKeys.set(key, val);
                }
            } else {
                key += match[5];
                key = key.trim()
            }

            if (values.get(key) === undefined){
                // add this to missing keys
                missingKeys.set(key, undefined);
            } else {
                newLine = newLine.replace(match[0], match[1] + values.get(key));
            }
        }
        lines[counter] = newLine;
    }
    return lines.join("\n") + "\n";  // TODO: get rid of trailing "\n"

    // substitute values defined after use
    for (let counter in lines){
        newLine = lines[counter];
        let matchesIterator = newLine.matchAll(SIMPLER_REGEX);
        for (let match of matchesIterator){
            let key = match[2].trim();
            let val = ("" + match[4]).trim()
            if (match[4] && val.length){
                val += match[5]
                val = val.trim()
                val = val.replace(/\\(.)/g, "$1")
                values.set(key, val);
                if (missingKeys.get(key) === undefined){
                    missingKeys.set(key, val);
                }
            } else {
                key += match[5];
                key = key.trim()
            }

            if (values.get(key) === undefined){
                // add this to missing keys
                missingKeys.set(key, undefined);
            } else {
                newLine = newLine.replace(match[0], match[1] + values.get(key));
            }
        }
        lines[counter] = newLine;
    }



    return lines.join("\n") + "\n";  // TODO: get rid of trailing "\n"
}

module.exports.substitute = handleSubstitutions;
