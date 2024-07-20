import { SFS } from './lib/SFS';
import { GetData } from './lib/GetData';
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, '../assets/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// GetData("https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt");
const mockData = {
    keys: ['f1','f2'],
    json: [
        { f1: 1, f2: 0, class: 'A' },
        { f1: 3, f2: 0, class: 'A' },
        { f1: 5, f2: 0, class: 'B' },
        { f1: 3, f2: 0, class: 'B' }
    ]
}

const {xi1,xi2} = SFS(data); // Calculate best feature

console.log(`Best features: ${xi1}, ${xi2}`); // Output best features