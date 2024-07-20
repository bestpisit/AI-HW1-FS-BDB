"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetData = GetData;
const fs = require('fs');
function fetchAndConvertTSVtoJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            const tsvText = yield response.text();
            const [headerLine, ...lines] = tsvText.split('\n');
            const headers = headerLine.split('\t').map(normalizeString);
            const data = lines.map(line => {
                const values = line.split('\t');
                return headers.reduce((obj, header, index) => {
                    obj[header] = normalizeString(values[index]);
                    return obj;
                }, {});
            });
            return { keys: headers, json: data };
        }
        catch (error) {
            console.error('Error fetching or converting TSV:', error);
        }
    });
}
function normalizeString(input) {
    if (!input)
        return '';
    // Decode hexadecimal escape sequences
    let normalString = input.replace(/\\x([0-9A-Fa-f]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    // Remove null characters
    normalString = normalString.replace(/\x00/g, '');
    // Determine if the string is a float
    if (isFloat(normalString)) {
        return parseFloat(normalString);
    }
    else {
        return normalString;
    }
}
function isFloat(str) {
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}
function GetData() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = 'https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt';
        var data = yield fetchAndConvertTSVtoJSON(url);
        fs.writeFileSync('data.json', JSON.stringify(data));
        console.log(data === null || data === void 0 ? void 0 : data.keys, data === null || data === void 0 ? void 0 : data.json[(data === null || data === void 0 ? void 0 : data.json.length) - 2]);
    });
}
