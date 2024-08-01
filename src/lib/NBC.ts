import { DataType } from '../types/DataType';
import { multivariateGaussianDensityFunction } from './MGDF';

class NBC {
    private meanVector = new Map();
    private covarianceMatrix = new Map();
    private priorProbability = new Map();
    private classCounts = new Map();

    constructor() { }

    train(data: DataType) {
        this.meanVector = new Map();
        this.covarianceMatrix = new Map();
        this.priorProbability = new Map();
        this.classCounts = new Map();

        //find mean vector of each class
        for (const row of data.value) {
            const className = row.class;
            if (!this.meanVector.has(className)) {
                this.meanVector.set(className, {});
                this.classCounts.set(className, 0);
            }
            this.classCounts.set(className, this.classCounts.get(className) + 1);

            for (const key of data.key) {
                if (!this.meanVector.get(className).hasOwnProperty(key)) {
                    this.meanVector.get(className)[key] = 0;
                }
                this.meanVector.get(className)[key] += row[key];
            }
        }

        for (const className of this.meanVector.keys()) {
            for (const key of data.key) {
                this.meanVector.get(className)[key] /= this.classCounts.get(className);
            }
        }

        //find covariance matrices of each class
        for (const row of data.value) {
            const className = row.class;
            if (!this.covarianceMatrix.has(className)) {
                this.covarianceMatrix.set(className, {});
            }

            for (const key1 of data.key) {
                for (const key2 of data.key) {
                    if (!this.covarianceMatrix.get(className).hasOwnProperty(key1 + key2)) {
                        this.covarianceMatrix.get(className)[key1 + key2] = 0;
                    }
                    this.covarianceMatrix.get(className)[key1 + key2] += (row[key1] -
                        this.meanVector.get(className)[key1]) * (row[key2] - this.meanVector.get(className)[key2]);
                }
            }
        }

        for (const className of this.covarianceMatrix.keys()) {
            for (const key1 of data.key) {
                for (const key2 of data.key) {
                    this.covarianceMatrix.get(className)[key1 + key2] /= this.classCounts.get(className);
                }
            }
        }

        //convert meanVector to array
        for (const className of this.meanVector.keys()) {
            this.meanVector.set(className, Object.values(this.meanVector.get(className)));
        }

        //convert covarianceMatrix to array
        for (const className of this.covarianceMatrix.keys()) {
            const cM: number[][] = [];
            for (let i = 0; i < data.key.length; i++) {
                cM.push([]);
                for (let j = 0; j < data.key.length; j++) {
                    cM[i].push(this.covarianceMatrix.get(className)[data.key[i] + data.key[j]]);
                }
            }
            this.covarianceMatrix.set(className, cM);
        }

        //Calculate Prior Probability
        for (const className of this.classCounts.keys()) {
            this.priorProbability.set(className, this.classCounts.get(className) / data.value.length);
        }

        console.log('Mean Vector:');
        for (const [className, mean] of this.meanVector.entries()) {
            const roundedMean = mean.map((value: any) => value.toFixed(3));
            console.log(className, roundedMean);
        }
        console.log('Covariance Matrix:');
        this.covarianceMatrix.forEach((values, key) => {
            console.log(`Covariance Matrix for class '${key}':`);
            values.forEach((row: any[]) => {
                const formattedRow = row.map(value => value.toFixed(3));
                console.log(`[ '${formattedRow.join("', '")}' ]`);
            });
        });
        console.log('Prior Probability:');
        for (const [className, prob] of this.priorProbability.entries()) {
            console.log(className, prob.toFixed(3));
        }
    }

    predict(newData: number[]): string {
        // Calculate posterior probability for each class
        const posteriorProbability = new Map();
        for (const className of this.classCounts.keys()) {
            const likelihood = multivariateGaussianDensityFunction(newData, this.meanVector.get(className), this.covarianceMatrix.get(className));
            const prior = this.priorProbability.get(className);
            posteriorProbability.set(className, likelihood * prior);
        }

        // Find the class with the highest posterior probability
        let bestClass = null;
        let bestProb = -Infinity;
        for (const [className, prob] of posteriorProbability.entries()) {
            if (prob > bestProb) {
                bestClass = className;
                bestProb = prob;
            }
        }

        // console.log('Posterior probabilities:', posteriorProbability);
        return bestClass;
    }
}

export default NBC;