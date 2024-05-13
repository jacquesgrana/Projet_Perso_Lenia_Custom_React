export default interface IPreset {
    id: number;
    name: string;
    description: string;
    date: string;

    values: {
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

        cellGrowthMu: number;
        cellGrowthSigma: number;

        cellEvolutionDeltaT: number;
    }

    
}

/*
    const [cellSize, setCellSize] = useState<number>(cellService.getCellSize());

    const [convFilterRadiusR, setConvFilterRadiusR] = useState<number>(cellService.getConvolRadiusR());
    const [convFilterMuR, setConvFilterMuR] = useState<number>(cellService.getConvolMuR());
    const [convFilterSigmaR, setConvFilterSigmaR] = useState<number>(cellService.getConvolSigmaR());

    const [convFilterRadiusG, setConvFilterRadiusG] = useState<number>(cellService.getConvolRadiusG());
    const [convFilterMuG, setConvFilterMuG] = useState<number>(cellService.getConvolMuG());
    const [convFilterSigmaG, setConvFilterSigmaG] = useState<number>(cellService.getConvolSigmaG());

    const [convFilterRadiusB, setConvFilterRadiusB] = useState<number>(cellService.getConvolRadiusB());
    const [convFilterMuB, setConvFilterMuB] = useState<number>(cellService.getConvolMuB());
    const [convFilterSigmaB, setConvFilterSigmaB] = useState<number>(cellService.getConvolSigmaB());

    const [cellGrowthMu, setCellGrowthMu] = useState<number>(cellService.getCellGrowthMu());
    const [cellGrowthSigma, setCellGrowthSigma] = useState<number>(cellService.getCellGrowthSigma());

    const [brushSize, setBrushSize] = useState<number>(cellService.getBrushSize());

    const [floorR, setFloorR] = useState<number>(cellService.getCountingFloorR());
    const [floorG, setFloorG] = useState<number>(cellService.getCountingFloorG());
    const [floorB, setFloorB] = useState<number>(cellService.getCountingFloorB());

    const [colorSensibilityR, setColorSensibilityR] = useState<[number, number, number]>(cellService.getColorSensibilityR());
    const [colorSensibilityG, setColorSensibilityG] = useState<[number, number, number]>(cellService.getColorSensibilityG());
    const [colorSensibilityB, setColorSensibilityB] = useState<[number, number, number]>(cellService.getColorSensibilityB());

    const [cellEvolutionDeltaT, setCellEvolutionDeltaT] = useState<number>(cellService.getCellEvolutionDeltaT());
*/