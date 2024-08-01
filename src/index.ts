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
    keys: ['f1', 'f2', 'f3'],
    json: [
        { "f1": 1, "f2": 2, "f3": 0, class: 'A' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'A' },
        { "f1": 5, "f2": 6, "f3": 0, class: 'B' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'B' },
        { "f1": 1, "f2": 2, "f3": 0, class: 'A' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'A' },
        { "f1": 5, "f2": 6, "f3": 0, class: 'B' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'B' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'B' },
        { "f1": 3, "f2": 4, "f3": 0, class: 'B' },
    ]
}

let avg1 = 0, avg2 = 0;
checkMain(data);
async function checkMain(dataSet: any) {
    const crossValidation = 0.1; // 10% of data for cross-validation
    const n = 1/crossValidation; //Fold
    for (let i = 0; i < n; i++) { //Loop through each fold
        console.log("Fold: " + (i+1));
        const trainData: any = [];
        const testData: any = [];
        for(let j=0;j<dataSet.json.length;j++){ //Split data into train and test datasets
            if(j>=i*crossValidation*dataSet.json.length && j < (i+1)*crossValidation*dataSet.json.length){
                testData.push(dataSet.json[j]);
            }
            else{
                trainData.push(dataSet.json[j]);
            }
        }
        await main(false,dataSet,trainData,testData);
    }
    console.log("Accuracy 1: " + (avg1 / n).toFixed(2) + "%");
    console.log("Accuracy 2: " + (avg2 / n).toFixed(2) + "%");
}

async function main(check: boolean, data: any, trainData: any, testData: any) {
    let { xi1, xi2 } = SFS(data); // Calculate best features

    if (check) {
        xi1 = 'f5';
        xi2 = 'f3';
    }

    console.log(`Best features: ${xi1}, ${xi2}`); // Output best features


    // NBC Data
    const NBCData: DataType = {
        key: [xi1, xi2],
        value: trainData.map((row: any) => ({
            [xi1]: row[xi1],
            [xi2]: row[xi2],
            'class': row['class']
        }))
    }

    const NBCML = new NBC(); //This is the model
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
    const errorRate = ((FP + FN) / (TP + TN + FP + FN) * 100);
    const sensitivity = (TP / (TP + FN) * 100);
    const specificity = (TN / (TN + FP) * 100);
    const precision = (TP / (TP + FP) * 100);
    const recall = sensitivity;
    const f1 = (2 * (precision * recall) / (precision + recall));

    if (check) {
        avg2 += f1;
    }
    else {
        avg1 += f1;
    }

    console.log("Accuracy: " + accuracy.toFixed(2) + "%");
    console.log("Error Rate: " + errorRate.toFixed(2) + "%");
    // console.log("Sensitivity: " + sensitivity.toFixed(2) + "%");
    // console.log("Specificity: " + specificity.toFixed(2) + "%");
    // console.log("Precision: " + precision.toFixed(2) + "%");
    // console.log("Recall: " + recall.toFixed(2) + "%");
    // console.log("F1 Score: " + f1.toFixed(2) + "%");


    // const Values: any = [];
    // // bar1.start(data.json.length, 0);

    // for (const point of data.json) {
    //     Values.push({ x: point[xi1], y: point[xi2], class: NBCML.predict([point[xi1], point[xi2]]) });
    //     // Values.push({ x: point[xi1], y: point[xi2], class: point.class });
    //     // bar1.update(Values.length);
    //     // make it sleep for 1 second
    //     // await new Promise(r => setTimeout(r, 10));
    // }

    // fs.writeFileSync(path.resolve(__dirname, '../assets/Values.json'), JSON.stringify(Values));

    // // bar1.stop(); // Stop the progress bar
}

// const distinctFeatures = new Set<string>();
// for (const row of data.json) {
//     const value = row['f1'];
//     if(distinctFeatures.has(value)) continue;
//     distinctFeatures.add(value);
// }

// console.log(distinctFeatures);