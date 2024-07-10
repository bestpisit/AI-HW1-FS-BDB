async function fetchAndConvertTSVtoJSON(url) {
    try {
        const response = await fetch(url);
        const tsvText = await response.text();
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
    } catch (error) {
        console.error('Error fetching or converting TSV:', error);
    }
}

function normalizeString(input) {
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

function isFloat(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}


main();

async function main() {
    let url = 'https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt';
    var data = await fetchAndConvertTSVtoJSON(url);
    console.log(data.keys, data.json[0]);
}