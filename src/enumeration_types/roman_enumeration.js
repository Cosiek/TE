baseEnumeration = require('./base_enumeration')


class RomanEnumerationParser extends baseEnumeration.BaseEnumerationParser{
    regex = /\b([IVXLCDM]+)\b/
    numbers = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
        ['L', 50], ['XL', 40], ['X' ,10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ]

    numberToStr(number){
        if (number > 0){
            return this._numberToStr(number);
        } else if (number === 0) {
            return "0"
        } else {
            return "-" + this._numberToStr(number * -1);
        }
    }

    _numberToStr(number){
        let roman = "";
        for (let nr of this.numbers) {
            while (number >= nr[1]) {
                roman += nr[0];
                number -= nr[1];
            }
        }
        return roman;
    }

    strToNumber(str){  // TODO: unsupported chars
        if (str === '0'){
            return 0;
        } else if (str[0] === '-'){
            return this._strToNumber(str.replace(/^-/, "")) * -1;
        }   else {
            return this._strToNumber(str);
        }
    }

    _strToNumber(str){  // TODO: test
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

module.exports.RomanEnumerationParser = RomanEnumerationParser
