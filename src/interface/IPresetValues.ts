export default interface IPresetValues {
    floorR: number;
    floorG: number;
    floorB: number;

    convFilterRadiusR: number;
    convFilterMuR: number;
    convFilterSigmaR: number;

    convFilterRadiusG: number;
    convFilterMuG: number;
    convFilterSigmaG: number;

    convFilterRadiusB: number;
    convFilterMuB: number;
    convFilterSigmaB: number;

    colorSensibilityR: [number, number, number];
    colorSensibilityG: [number, number, number];
    colorSensibilityB: [number, number, number];

    cellEvolutionDeltaT: number;

    cellGrowthMu: number;
    cellGrowthSigma: number;
}