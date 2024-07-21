import { SFS } from './lib/SFS';
import { GetData } from './lib/GetData';
import fs from 'fs';
import path from 'path';

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

let { xi1, xi2 } = SFS(data); // Calculate best feature

console.log(`Best features: ${xi1}, ${xi2}`); // Output best features

xi1 = 'f3';
xi2 = 'f5';


const Values = data.json.map((point: { x: any; y: any, class: any }) => ({ x: point[xi1 as keyof typeof point], y: point[xi2 as keyof typeof point], class: point.class }));

fs.writeFileSync(path.resolve(__dirname, '../assets/Values.json'), JSON.stringify(Values));

// const distinctFeatures = new Set<string>();
// for (const row of data.json) {
//     const value = row['f1'];
//     if(distinctFeatures.has(value)) continue;
//     distinctFeatures.add(value);
// }

// console.log(distinctFeatures);