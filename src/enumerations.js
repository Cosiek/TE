
class EnumerationParser{
    regex = null;

    isPattern(pattern){
        let match = pattern.match(this.regex);
        return match !== null;
    }

    numberToStr(number){
        return number + "";
    }

    stdStrToNumber(str){
        return Number(str);
    }

    strToNumber(str){
        return this.stdStrToNumber(str);
    }

    getValue(pattern, number){
        // strip # chars from pattern
        pattern = pattern.substring(1, pattern.length-1);
        return pattern.replace(this.regex, this.numberToStr(number));
    }
}


class FloatEnumerationParser extends EnumerationParser{
    regex = /\d+([\.,])\d+/

    getValue(pattern, number){
        let separator = pattern.match(this.regex)[1];
        let numTxt = this.numberToStr(number).replace(/([\.,])/, separator);
        return pattern.replace(this.regex, numTxt);
    }
}


class IntEnumerationParser extends EnumerationParser{
    regex = /\d+/
}


class RomanEnumerationParser extends EnumerationParser{
    regex = /\b([IVXLCDM]+)\b/
    numbers = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
        ['L', 50], ['XL', 40], ['X' ,10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ]

    numberToStr(number){
        let roman = "";
        for (let nr of this.numbers) {
            while (number >= nr[1]) {
                roman += nr[0];
                number -= nr[1];
            }
        }
        return roman;
    }

    strToNumber(str){  // TODO: test
        const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let number = 0;
        for (let i = 0; i < str.length; i++) {
            const curr = roman[str[i]];
            const next = roman[str[i + 1]];
            if (curr < next){
                (number -= curr);
            } else {
                (number += curr);
            }
        }
        return number;
    }
}


class LettersEnumerationParser extends EnumerationParser{
    regex = /\b([a-z])\b/
    alphabet = "abcdefghijklmnopqrstuwvxyz"

    numberToStr(number){
        // TODO: what about negative numbers
        // TODO: what about numbers outside of this range?
        return this.alphabet[number - 1];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}


class CapitalLettersEnumerationParser extends EnumerationParser{
    regex = /\b([A-Z])\b/
    alphabet = "ABCDEFGHIJKLMNOPQRSTUWVXYZ"

    numberToStr(number){
        // TODO: what about negative numbers
        // TODO: what about numbers outside of this range?
        return this.alphabet[number - 1];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}


const PARSERS = [
    new FloatEnumerationParser(),           // floating point number
    new IntEnumerationParser(),             // number
    new RomanEnumerationParser(),           // roman numbers
    new LettersEnumerationParser(),         // a-z
    new CapitalLettersEnumerationParser(),  // A-Z
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
                matches.push(match);
            }
            // now for the right iteration
            for (let i = matches.length - 1; i >= 0; i--){  // TODO: reverse order still makes sense?
                let match = matches[i];
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
