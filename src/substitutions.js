function handleSubstitutions(text){
    // TODO: proper escaping
    // TODO: handle all-whitespace cases
    // TODO: definition after use
    // {{ token=value }} for assigning and insert
    // {{ token }} for insert
    let newText = "";
    let values = new Map();
    for (let line of text.split('\n')){
        let matchesIterator = line.matchAll(/{{([^=}]+)=?([^}]*)}}/g);
        newLine = line;
        for (let match of matchesIterator){
            let key = match[1].trim();
            if (match[2].length){
                values.set(key, match[2].trim());
            }
            newLine = newLine.replace(match[0], values.get(key));
        }
        newText += newLine + "\n"
    }
    return newText;
}

module.exports.substitute = handleSubstitutions;
