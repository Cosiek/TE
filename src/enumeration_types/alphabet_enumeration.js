baseEnumeration = require('./base_enumeration')


class AlphabetEnumerationParser extends baseEnumeration.BaseEnumerationParser{

    numberToStr(number){
        if (number > 0){
            return this._numberToStr(number - 1);
        } else if (number === 0){
            return '0';
        } else {
            // negative numbers are handled like positive ones, except prefixed with "-"
            return "-" + this._numberToStr((number * -1) - 1);
        }
    }

    _numberToStr(number){
        let whole = Math.floor(number / this.alphabet.length);
        let rest = number % this.alphabet.length;
        if (whole === 0){
            //console.log("GRRR", whole, rest, number)
            return this.alphabet[rest];
        }
        return this._numberToStr(whole - 1) + this.alphabet[rest];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}

// TODO - alphabetEnumerationParserFactory

class LettersEnumerationParser extends AlphabetEnumerationParser{
    regex = /\b([a-z])\b/
    alphabet = "abcdefghijklmnopqrstuwvxyz"
}


class CapitalLettersEnumerationParser extends AlphabetEnumerationParser{
    regex = /\b([A-Z])\b/
    alphabet = "ABCDEFGHIJKLMNOPQRSTUWVXYZ"
}

module.exports.LettersEnumerationParser = LettersEnumerationParser;
module.exports.CapitalLettersEnumerationParser = CapitalLettersEnumerationParser;
