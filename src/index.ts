import { SFS } from './lib/SFS';
import { GetData } from './lib/GetData';
import fs from 'fs';
import path from 'path';
import NBC from './lib/NBC';
import { DataType } from './types/DataType';
import { ConfusionMatrix } from './lib/ConfusionMetrix';
const progress = require('cli-progress');
const bar1 = new progress.SingleBar({}, progress.Presets.shades_classic);

const dataPath = path.resolve(__dirname, '../assets/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// GetData("https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt");
const mockData = {
    keys: ['f1', 'f2'],
    json: [
        { f1: 1, f2: 2, class: 'A' },
        { f1: 3, f2: 4, class: 'A' },
        { f1: 5, f2: 6, class: 'B' },
        { f1: 3, f2: 4, class: 'B' }
    ]
}

let avg1 = 0, avg2 = 0;
checkMain();
async function checkMain() {
    const n = 1;
    for (let i = 0; i < n; i++) {
        await main(false);
        await main(true);
    }
    console.log("Accuracy 1: " + (avg1/n).toFixed(2) + "%");
    console.log("Accuracy 2: " + (avg2/n).toFixed(2) + "%");
}

async function main(check: boolean) {
    let { xi1, xi2 } = SFS(data); // Calculate best features

    if (check) {
        xi1 = 'f5';
        xi2 = 'f3';
    }

    console.log(`Best features: ${xi1}, ${xi2}`); // Output best features

    const crossValidation = 0.1; // 10% of data for cross-validation
    const shuffledData = data.json.sort(() => Math.random() - 0.5);

    const trainSize = Math.floor(shuffledData.length * (1 - crossValidation));
    const trainData = shuffledData.slice(0, trainSize);
    const testData = shuffledData.slice(trainSize);


    // NBC Data
    const NBCData: DataType = {
        key: [xi1, xi2],
        value: trainData.map((row: any) => ({
            [xi1]: row[xi1],
            [xi2]: row[xi2],
            'class': row['class']
        }))
    }

    const NBCML = new NBC();

    NBCML.train(NBCData);

    const confusionMatrix = ConfusionMatrix(
        testData.map((row: any) => (
            row['class']
        )),
        testData.map((row: any) => NBCML.predict([row[xi1], row[xi2]]))
    );

    console.log(confusionMatrix);

    //Model Evaluation
    const TP = confusionMatrix.get('gg');
    const TN = confusionMatrix.get('bb');
    const FP = confusionMatrix.get('bg');
    const FN = confusionMatrix.get('gb');

    const accuracy = ((TP + TN) / (TP + TN + FP + FN) * 100);
    const errorRate = ((FP + FN) / (TP + TN + FP + FN) * 100);;

    if (check) {
        avg2 += accuracy;
    }
    else {
        avg1 += accuracy;
    }

    console.log("Accuracy: " + accuracy.toFixed(2) + "%");
    console.log("Error Rate: " + errorRate.toFixed(2) + "%");


    // const Values: any = [];
    // // bar1.start(data.json.length, 0);

    // for (const point of data.json) {
    //     Values.push({ x: point[xi1], y: point[xi2], class: point.class });
    //     // bar1.update(Values.length);
    //     // make it sleep for 1 second
    //     // await new Promise(r => setTimeout(r, 10));
    // }

    // fs.writeFileSync(path.resolve(__dirname, '../assets/Values.json'), JSON.stringify(Values));

    // bar1.stop(); // Stop the progress bar
}

// const distinctFeatures = new Set<string>();
// for (const row of data.json) {
//     const value = row['f1'];
//     if(distinctFeatures.has(value)) continue;
//     distinctFeatures.add(value);
// }

// console.log(distinctFeatures);