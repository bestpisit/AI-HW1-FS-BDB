import { matrix, subtract, multiply, transpose, inv, det, exp, pi, sqrt } from 'mathjs';

export function multivariateGaussianDensityFunction(x: number[], mu: number[], sigma: number[][]): number {
    const k = x.length;
    const sigmaMatrix = matrix(sigma);
    const detSigma = det(sigmaMatrix);
    const invSigma = inv(sigmaMatrix);

    const diff = subtract(matrix(x), matrix(mu));
    const expTerm = multiply(multiply(transpose(diff), invSigma), diff);
    const numerator = exp(-0.5 * Number(expTerm));
    const denominator = sqrt(Math.pow(2 * pi, k) * detSigma);

    return Number(numerator) / Number(denominator);
}