const fs = require('fs');

async function fetchAndConvertTSVtoJSON(url:string) {
    try {
        const response = await fetch(url);
        const tsvText = await response.text();
        const [headerLine, ...lines] = tsvText.split('\n');
        const headers = headerLine.split('\t').map(normalizeString);

        const data = lines.map(line => {
            const values = line.split('\t');
            return headers.reduce((obj, header, index) => {
                obj[header as string] = normalizeString(values[index]);
                return obj;
            }, {} as { [key: string]: any });
        });

        return { keys: headers, json: data };
    } catch (error) {
        console.error('Error fetching or converting TSV:', error);
    }
}

function normalizeString(input:string) {
    if (!input) return '';

    // Decode hexadecimal escape sequences
    let normalString = input.replace(/\\x([0-9A-Fa-f]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));

    // Remove null characters
    normalString = normalString.replace(/\x00/g, '');

    // Determine if the string is a float
    if (isFloat(normalString)) {
        return parseFloat(normalString);
    } else {
        return normalString;
    }
}

function isFloat(str:string) {
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export async function GetData() {
    let url = 'https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt';
    var data = await fetchAndConvertTSVtoJSON(url);
    fs.writeFileSync('data.json', JSON.stringify(data));
    console.log(data?.keys, data?.json[data?.json.length - 2]);
}