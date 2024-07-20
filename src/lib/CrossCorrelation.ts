//Calculate CrossCorrelation

export function CrossCorrelation(data: any, xi1: string, xj: string) {
    let pij = 0;
    for(let i = 0; i < data.length; i++) {
        if (data[i][xi1] !== undefined && data[i][xj] !== undefined) {
            pij += data[i][xi1] * data[i][xj];
        }
    }
    let sumXipow2 = 0;
    let sumXjpow2 = 0;
    for(let i = 0; i < data.length; i++) {
        if (data[i][xi1] !== undefined && data[i][xj] !== undefined) {
            sumXipow2 += Math.pow(data[i][xi1], 2);
            sumXjpow2 += Math.pow(data[i][xj], 2);
        }
    }
    //if zero division error
    if (sumXipow2 === 0 || sumXjpow2 === 0) {
        return 0;
    }
    pij = pij / Math.sqrt(sumXipow2 * sumXjpow2);
    pij = Math.abs(pij);
    return pij;
}