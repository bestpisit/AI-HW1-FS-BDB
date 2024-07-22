//Scalar Feature Selection
const {CrossCorrelation} = require('./CrossCorrelation');

function C(k: string, data: any, classValues: Set<string>) {
    let min = Infinity;
    for(const classi of classValues) {
        for(const classj of classValues) {
            if(classi === classj) continue;
            let meani = 0;
            let meanj = 0;
            //calculate meani and meanj
            for(let i = 0; i < data.length; i++) {
                if(data[i].class === classi) {
                    meani += data[i][k];
                } else if(data[i].class === classj) {
                    meanj += data[i][k];
                }
            }
            meani /= data.length;
            meanj /= data.length;
            //calculate SDi and SDj
            let SDi = 0;
            let SDj = 0;
            for(let i = 0; i < data.length; i++) {
                if(data[i].class === classi) {
                    SDi += Math.pow(data[i][k] - meani, 2);
                } else if(data[i].class === classj) {
                    SDj += Math.pow(data[i][k] - meanj, 2);
                }
            }
            SDi = Math.sqrt(SDi / (data.length-1));
            SDj = Math.sqrt(SDj / (data.length-1));
            if (SDi === 0 || SDj === 0) {
                continue;
            }
            //calculate dij
            let dij = 0.5 * (Math.pow(SDi,2)/Math.pow(SDj,2) + Math.pow(SDj,2)/Math.pow(SDi,2) - 2) + 0.5 * (Math.pow(meani - meanj, 2) / (Math.pow(SDi,-2) + Math.pow(SDj,-2)));
            if(min > dij) {
                min = dij;
            }
        }
    }
    return min === Infinity ? 0 : min;
}

function findClass(data: any) {
    let classValues = new Set<string>();
    for (let i = 0; i < data.length; i++) {
        if (classValues.has(data[i].class)) continue;
        classValues.add(data[i].class);
    }
    return classValues;
}

export function SFS(data: any) {
    const features = data.keys;
    const dataValues = data.json;
    let percent = 0.0;

    const classValues = findClass(dataValues);

    //find xi1
    let max = 0;
    let xi1 = '';
    for (const feature of features) {
        if (feature === 'class') continue;
        const c = C(feature, dataValues, classValues);
        if (max < c) {
            max = c;
            xi1 = feature;
        }
        // console.log(`C(${feature}) = ${c}`);
    }

    //find xi2
    let maxpij = 0;
    let xi2 = '';
    for(const feature of features) {
        if (feature === 'class' || feature === xi1) continue;
        const pij = CrossCorrelation(dataValues, xi1, feature);
        // console.log(`P(${xi1},${feature}) = ${pij}`);
        if(maxpij < pij) {
            maxpij = pij;
            xi2 = feature;
        }
    }

    return {xi1,xi2};
}