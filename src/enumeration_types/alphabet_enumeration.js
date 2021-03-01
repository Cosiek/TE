baseEnumeration = require('./base_enumeration')


class LettersEnumerationParser extends baseEnumeration.BaseEnumerationParser{
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


class CapitalLettersEnumerationParser extends baseEnumeration.BaseEnumerationParser{
    regex = /\b([A-Z])\b/
    alphabet = "ABCDEFGHIJKLMNOPQRSTUWVXYZ"

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

module.exports.LettersEnumerationParser = LettersEnumerationParser;
module.exports.CapitalLettersEnumerationParser = CapitalLettersEnumerationParser;
