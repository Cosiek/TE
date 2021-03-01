
baseEnumeration = require('./enumeration_types/base_enumeration')
EnumerationParser = baseEnumeration.BaseEnumerationParser

romanEnumeration = require('./enumeration_types/roman_enumeration')
alphabetEnumeration = require('./enumeration_types/alphabet_enumeration')
numbersEnumeration = require('./enumeration_types/numbers_enumeration')


const PARSERS = [
    new numbersEnumeration.FloatEnumerationParser(),            // floating point number
    new numbersEnumeration.IntEnumerationParser(),              // number
    new romanEnumeration.RomanEnumerationParser(),              // roman numbers
    new alphabetEnumeration.LettersEnumerationParser(),         // a-z
    new alphabetEnumeration.CapitalLettersEnumerationParser(),  // A-Z
]


class Enumeration{
    constructor(pattern){
        this.pattern = pattern;
        this.counter = 1;
        this.step = 1;
        this.parser = this.getParser(pattern);
    }

    isValid(){ return this.parser !== null }

    static clearPattern(dirtyPattern){
        // ^#\[(\d+(,\d+)?)(:(\d+(,\d+)?))?\]
        let m = dirtyPattern.match(/^#(\[.+\])?(.*)/);
        return [m[1], "#" + m[2]];
    }

    getParser(pattern){
        for (let parser of PARSERS){
            if (parser.isPattern(pattern)){
                return parser;
            }
        }
        return null;
    }

    applySettings(enumSettings){
        // enumSettings is a sting in the form of [start:step]
        let m = enumSettings.match(/\[([^:]*)?:?([^:]*)?\]/);
        if (m[1]){
            let start = this.parser.strToNumber(m[1]);
            if ( !isNaN(start) ){ this.counter = start }
        }
        if (m[2]){
            let step = this.parser.stdStrToNumber(m[2]);
            if ( !isNaN(step) ){ this.step = step }
        }
    }

    getValue(str){
        return this.parser.getValue(this.pattern, this.counter);
    }

    substitute(line, match){
        let val = this.getValue();
        this.counter += this.step;
        return line.replace(match[0], val);
    }
}


function substitute(text){
    // TODO: named enumerations
    let lines = text.split('\n');
    let regex = /(?<!\\)#.*?([^\\]#)/g;  // TODO: will lookbehind work in browsers?
    let enumerators = {}
    let newText = '';
    for (line of lines){
        // search for count structures
        // note that there might be many of them in a single line
        let matchesIterator = line.matchAll(regex);
        let newLine = line;
        if (matchesIterator){
            // matchAll returns an iterator, that we want to iterate in reverse order
            let matches = []
            for (let match of matchesIterator){
                // clear pattern (get rid of start and step information)
                let [enumSettings, pattern] = Enumeration.clearPattern(match[0]);
                if (!(pattern in enumerators)){
                    // get parser object
                    enumerators[pattern] = new Enumeration(pattern);
                }
                // set/reset enumeration start and step
                if (enumSettings){
                    enumerators[pattern].applySettings(enumSettings);
                }
                // use parser to substitute string
                newLine = enumerators[pattern].substitute(newLine, match);
            }
        }
        newText += newLine + '\n';
    }
    return newText;
}

module.exports.substitute = substitute;
