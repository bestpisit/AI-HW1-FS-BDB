function tsvJSON(tsv) {
    var lines = tsv.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return JSON.stringify(result);
}

async function fetchAndConvertTSVtoJSON(url) {
    try {
        let response = await fetch(url);
        let tsvText = await response.text();

        const json = tsvJSON(tsvText);

        for(let record of json){
            // for(let)
        }
        console.log(json[0])
        console.log(json[0][Object.keys(json[0])[0]].toString('utf16le'));
    } catch (error) {
        console.error('Error fetching or converting TSV:', error);
    }
}

let url = 'https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt';
fetchAndConvertTSVtoJSON(url);
