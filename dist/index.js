"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SFS_1 = require("./lib/SFS");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataPath = path_1.default.resolve(__dirname, '../assets/data.json');
const data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf8'));
// GetData("https://myweb.cmu.ac.th/sansanee.a/ISNE_MLDS/dataset/ionosphere.txt");
const mockData = {
    keys: ['f1', 'f2'],
    json: [
        { f1: 1, f2: 0, class: 'A' },
        { f1: 3, f2: 0, class: 'A' },
        { f1: 5, f2: 0, class: 'B' },
        { f1: 3, f2: 0, class: 'B' }
    ]
};
const { xi1, xi2 } = (0, SFS_1.SFS)(data); // Calculate best feature
console.log(`Best features: ${xi1}, ${xi2}`); // Output best features
