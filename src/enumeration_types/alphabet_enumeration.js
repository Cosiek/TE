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
            return this.alphabet[rest];
        }
        return this._numberToStr(whole - 1) + this.alphabet[rest];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}

function alphabetEnumerationParserFactory(regex, alphabet){
    class SomeAlphabetEnumerationParser extends AlphabetEnumerationParser {
        regex = regex
        alphabet = alphabet
    }

    return SomeAlphabetEnumerationParser;
}

module.exports.alphabetEnumerationParserFactory = alphabetEnumerationParserFactory;
module.exports.LettersEnumerationParser = alphabetEnumerationParserFactory(/\b([a-z])\b/, "abcdefghijklmnopqrstuwvxyz");
module.exports.CapitalLettersEnumerationParser = alphabetEnumerationParserFactory(/\b([A-Z])\b/, "ABCDEFGHIJKLMNOPQRSTUWVXYZ");
