import { cp } from "fs";
import CanvasConfig from "../config/CanvasConfig";
import CellConfig from "../config/CellConfig";
import ICell from "../interface/ICell";

export default class CellService {

    private static _instance: CellService | null = null;
    private _cells: ICell[][] = [];
    private _cellSize: number = CellConfig.CELL_SIZE;

    private _convolFilterR: number[][] = [];
    private _convolFilterG: number[][] = [];
    private _convolFilterB: number[][] = [];

    private _convolRadiusR: number = CellConfig.CELL_CONV_FILTER_RADIUS_RED;
    private _convolMuR: number = CellConfig.CELL_CONV_FILTER_MU_RED;
    private _convolSigmaR: number = CellConfig.CELL_CONV_FILTER_SIGMA_RED;

    private _convolRadiusG: number = CellConfig.CELL_CONV_FILTER_RADIUS_GREEN;
    private _convolMuG: number = CellConfig.CELL_CONV_FILTER_MU_GREEN;
    private _convolSigmaG: number = CellConfig.CELL_CONV_FILTER_SIGMA_GREEN;

    private _convolRadiusB: number = CellConfig.CELL_CONV_FILTER_RADIUS_BLUE;
    private _convolMuB: number = CellConfig.CELL_CONV_FILTER_MU_BLUE;
    private _convolSigmaB: number = CellConfig.CELL_CONV_FILTER_SIGMA_BLUE;

    private _maxI: number = 0;
    private _maxJ: number = 0;

    private _cellEvolutionDeltaT: number = CellConfig.CELL_EVOLUTION_DELTA_T;

    private _countingFloorR: number = CellConfig.CELL_FILTER_COUNT_FLOOR_RED;
    private _countingFloorG: number = CellConfig.CELL_FILTER_COUNT_FLOOR_GREEN;
    private _countingFloorB: number = CellConfig.CELL_FILTER_COUNT_FLOOR_BLUE;

    private _colorSensibilityR: [number, number, number] = CellConfig.CELL_COLOR_SENSIBILITY_RED;
    private _colorSensibilityG: [number, number, number] = CellConfig.CELL_COLOR_SENSIBILITY_GREEN;
    private _colorSensibilityB: [number, number, number] = CellConfig.CELL_COLOR_SENSIBILITY_BLUE;

    private _cellGrowthMu: number = CellConfig.CELL_GROWTH_MU;
    private _cellGrowthSigma: number = CellConfig.CELL_GROWTH_SIGMA;

    private _brushSize: number = CellConfig.CELL_BRUSH_SIZE;
    
    private constructor() {}

    public static getInstance(): CellService {
        if (this._instance === null) {
            this._instance = new CellService();
            this._instance.initValues();
            this._instance.initCells();
            this._instance.initCellSizeValues();
            this._instance.initConvolFilters();
        }
        return this._instance;
      }

    public initCells() {
        /*
        this._maxI = Math.floor(CanvasConfig.CANVAS_WIDTH / CellConfig.CELL_SIZE);
        this._maxJ = Math.floor(CanvasConfig.CANVAS_HEIGHT / CellConfig.CELL_SIZE);

        this._convolRadiusR = CellConfig.CELL_CONV_FILTER_RADIUS;
        this._convolMuR = CellConfig.CELL_CONV_FILTER_MU;
        this._convolSigmaR = CellConfig.CELL_CONV_FILTER_SIGMA;

        this._convolRadiusG = CellConfig.CELL_CONV_FILTER_RADIUS;
        this._convolMuG = CellConfig.CELL_CONV_FILTER_MU;
        this._convolSigmaG = CellConfig.CELL_CONV_FILTER_SIGMA;

        this._convolRadiusB = CellConfig.CELL_CONV_FILTER_RADIUS;
        this._convolMuB = CellConfig.CELL_CONV_FILTER_MU;
        this._convolSigmaB = CellConfig.CELL_CONV_FILTER_SIGMA;

        this._brushSize = CellConfig.CELL_BRUSH_SIZE;

        this._countingFloorR = CellConfig.CELL_FILTER_COUNT_FLOOR_RED;
        this._countingFloorG = CellConfig.CELL_FILTER_COUNT_FLOOR_GREEN;
        this._countingFloorB = CellConfig.CELL_FILTER_COUNT_FLOOR_BLUE;

        this._colorSensibilityR = CellConfig.CELL_COLOR_SENSIBILITY_RED;
        this._colorSensibilityG = CellConfig.CELL_COLOR_SENSIBILITY_GREEN;
        this._colorSensibilityB = CellConfig.CELL_COLOR_SENSIBILITY_BLUE;

        this._cellEvolutionDeltaT = CellConfig.CELL_EVOLUTION_DELTA_T;
*/
        //this._cellSize = CellConfig.CELL_SIZE;
        //this._maxI = Math.floor(CanvasConfig.CANVAS_WIDTH / CellConfig.CELL_SIZE);
        //this._maxJ = Math.floor(CanvasConfig.CANVAS_HEIGHT / CellConfig.CELL_SIZE);

        for(let i = 0; i < this._maxI; i++){ 
            this._cells[i] = new Array<ICell>(this._maxJ);
        }
        for(let i = 0; i < this._maxI; i++){ 
            //this._cells[i] = new Array<ICell>(this._maxJ);
            for(let j = 0; j < this._maxJ; j++){
                this._cells[i][j] = {
                    i: i,
                    j: j,
                    stateR: 0,
                    stateG: 0,
                    stateB: 0
                }
            }
        }
        return this._cells;
    }

    public initCellSizeValues(): void {
        this._cellSize = CellConfig.CELL_SIZE;
        this._maxI = Math.floor(CanvasConfig.CANVAS_WIDTH / CellConfig.CELL_SIZE);
        this._maxJ = Math.floor(CanvasConfig.CANVAS_HEIGHT / CellConfig.CELL_SIZE);
    }

    public initValues(): void {

        this._cellEvolutionDeltaT = CellConfig.CELL_EVOLUTION_DELTA_T;
        
        this._convolRadiusR = CellConfig.CELL_CONV_FILTER_RADIUS_RED;
        this._convolMuR = CellConfig.CELL_CONV_FILTER_MU_RED;
        this._convolSigmaR = CellConfig.CELL_CONV_FILTER_SIGMA_RED;

        this._convolRadiusG = CellConfig.CELL_CONV_FILTER_RADIUS_GREEN;
        this._convolMuG = CellConfig.CELL_CONV_FILTER_MU_GREEN;
        this._convolSigmaG = CellConfig.CELL_CONV_FILTER_SIGMA_GREEN;

        this._convolRadiusB = CellConfig.CELL_CONV_FILTER_RADIUS_BLUE;
        this._convolMuB = CellConfig.CELL_CONV_FILTER_MU_BLUE;
        this._convolSigmaB = CellConfig.CELL_CONV_FILTER_SIGMA_BLUE;

        this._brushSize = CellConfig.CELL_BRUSH_SIZE;

        this._countingFloorR = CellConfig.CELL_FILTER_COUNT_FLOOR_RED;
        this._countingFloorG = CellConfig.CELL_FILTER_COUNT_FLOOR_GREEN;
        this._countingFloorB = CellConfig.CELL_FILTER_COUNT_FLOOR_BLUE;

        this._colorSensibilityR = CellConfig.CELL_COLOR_SENSIBILITY_RED;
        this._colorSensibilityG = CellConfig.CELL_COLOR_SENSIBILITY_GREEN;
        this._colorSensibilityB = CellConfig.CELL_COLOR_SENSIBILITY_BLUE;

        this._cellEvolutionDeltaT = CellConfig.CELL_EVOLUTION_DELTA_T;

        this._cellGrowthMu = CellConfig.CELL_GROWTH_MU;
        this._cellGrowthSigma = CellConfig.CELL_GROWTH_SIGMA;
    }

    public initConvolFilters(): void {
        this.initConvolFilterR();
        this.initConvolFilterG();
        this.initConvolFilterB();
    }

    public getRandomizedCells(): ICell[][] {
        for(let i = 0; i < this._maxI; i++){ 
            for(let j = 0; j < this._maxJ; j++){
                this._cells[i][j] = {
                    i: i,
                    j: j,
                    stateR: Math.random(),
                    stateG:Math.random(),
                    stateB: Math.random()
                }
            }
        }
        return this._cells;
    }

    public initConvolFilterR() {
        const r = this._convolRadiusR;
        const x0 = r;
        const y0 = r;
        const mu = this._convolMuR;
        const sigma = this._convolSigmaR;
        this._convolFilterR = [];
        for(let x = 0; x < 2 * r + 1; x++) {
            this._convolFilterR[x] = [];
            for(let y = 0; y < 2 * r + 1; y++) {
                const dist = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))/r;
                const convolValue = Math.exp( -1 * ((dist - mu) * (dist - mu)) / (2 * sigma * sigma) );
                this._convolFilterR[x][y] = convolValue;
            }
        }
    }

    public initConvolFilterG() {
        const r = this._convolRadiusG;
        const x0 = r;
        const y0 = r;
        const mu = this._convolMuG;
        const sigma = this._convolSigmaG;
        this._convolFilterG = [];
        for(let x = 0; x < 2 * r + 1; x++) {
            this._convolFilterG[x] = [];
            for(let y = 0; y < 2 * r + 1; y++) {
                const dist = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))/r;
                const convolValue = Math.exp( -1 * ((dist - mu) * (dist - mu)) / (2 * sigma * sigma) );
                this._convolFilterG[x][y] = convolValue;
            }
        }
    }

    public initConvolFilterB() {
        const r = this._convolRadiusB;
        const x0 = r;
        const y0 = r;
        const mu = this._convolMuB;
        const sigma = this._convolSigmaB;
        this._convolFilterB = [];
        for(let x = 0; x < 2 * r + 1; x++) {
            this._convolFilterB[x] = [];
            for(let y = 0; y < 2 * r + 1; y++) {
                const dist = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))/r;
                const convolValue = Math.exp( -1 * ((dist - mu) * (dist - mu)) / (2 * sigma * sigma) );
                this._convolFilterB[x][y] = convolValue;
            }
        }
    }

    // a mettre dans une lib !
    private getGrowth(u: number): number {
        const mu = this._cellGrowthMu;
        const sigma = this._cellGrowthSigma;
        const value = 2 * Math.exp( -1 * ((u - mu) * (u - mu)) / (2 * sigma * sigma)) - 1;
        return value;
    }

    // a mettre dans une lib !
    private getEvolve(x: number, u: number): number {
        const dt = this._cellEvolutionDeltaT;
        x += dt * this.getGrowth(u);
        return x;
    }

    // a mettre dans une lib ?
    private getFilterResult(x: number, y: number): any {
        const coefRedRed = this._colorSensibilityR[0];
        const coefRedGreen = this._colorSensibilityR[1];
        const coefRedBlue = this._colorSensibilityR[2];
        const coefGreenRed = this._colorSensibilityG[0];
        const coefGreenGreen = this._colorSensibilityG[1];
        const coefGreenBlue = this._colorSensibilityG[2];
        const coefBlueRed = this._colorSensibilityB[0];
        const coefBlueGreen = this._colorSensibilityB[1];
        const coefBlueBlue = this._colorSensibilityB[2];
        const x0R = Math.floor(x - this._convolFilterR.length / 2) + 1;
        const y0R = Math.floor(y - this._convolFilterR.length / 2) + 1;
        const x0G = Math.floor(x - this._convolFilterG.length / 2) + 1;
        const y0G = Math.floor(y - this._convolFilterG.length / 2) + 1;
        const x0B = Math.floor(x - this._convolFilterB.length / 2) + 1;
        const y0B = Math.floor(y - this._convolFilterB.length / 2) + 1;
        let averages = {};
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let cptR = 0;
        let cptG = 0;
        let cptB = 0;
        //const countingFloorR = CellConfig.CELL_FILTER_COUNT_FLOOR_RED;
        //const countingFloorG = CellConfig.CELL_FILTER_COUNT_FLOOR_GREEN;
        //const countingFloorB = CellConfig.CELL_FILTER_COUNT_FLOOR_BLUE;

        /*
        let maxLength = Math.max(this._convolFilterR.length, this._convolFilterG.length, this._convolFilterB.length);
        //console.log('maxLength :', maxLength);
        //console.log('lengths :', this._convolFilterR.length, this._convolFilterG.length, this._convolFilterB.length);
        const deltaR = (maxLength - this._convolFilterR.length) / 2;
        const deltaG = (maxLength - this._convolFilterG.length) / 2;
        const deltaB = (maxLength - this._convolFilterB.length) / 2;
        //console.log('deltas :', deltaR, deltaG, deltaB);

        for(let i = 0; i < maxLength; i++) {
            for(let j = 0; j < maxLength; j++) {
                //const filterResultR = this._convolFilterR[i+deltaR][j+deltaR];
                //const filterResultG = this._convolFilterG[i+deltaG][j+deltaG];
                //const filterResultB = this._convolFilterB[i+deltaB][j+deltaB];
                if(i >= deltaR && i < (this._convolFilterR.length + deltaR) && j >= deltaR && j <(this._convolFilterR.length + deltaR)) {
                    const filterResultR = this._convolFilterR[i+deltaR][j+deltaR];
                    let x1 = x0R + i;
                    let y1 = y0R + j;
                    x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                    y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                    const valueR = (this._cells[x1][y1].stateR * coefRedRed + this._cells[x1][y1].stateG * coefRedGreen + this._cells[x1][y1].stateB * coefRedBlue) / (coefRedRed + coefRedGreen + coefRedBlue);
                    sumR += filterResultR * valueR;
                    if(filterResultR > this._countingFloorR) cptR++;
                }

                if(i >= deltaG && i < (this._convolFilterG.length + deltaG) && j >= deltaG && j <(this._convolFilterG.length + deltaG)) {
                    const filterResultG = this._convolFilterG[i+deltaG][j+deltaG];
                    let x1 = x0G + i;
                    let y1 = y0G + j;
                    x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                    y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                    const valueG = (this._cells[x1][y1].stateR * coefGreenRed + this._cells[x1][y1].stateG * coefGreenGreen + this._cells[x1][y1].stateB * coefGreenBlue) / (coefGreenRed + coefGreenGreen + coefGreenBlue);
                    sumG += filterResultG * valueG;
                    if(filterResultG > this._countingFloorG) cptG++;
                }

                if(i >= deltaB && i < (this._convolFilterB.length + deltaB) && j >= deltaB && j <(this._convolFilterB.length + deltaB)) {
                    const filterResultB = this._convolFilterB[i+deltaB][j+deltaB];
                    let x1 = x0B + i;
                    let y1 = y0B + j;
                    x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                    y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                    const valueB = (this._cells[x1][y1].stateR * coefBlueRed + this._cells[x1][y1].stateG * coefBlueGreen + this._cells[x1][y1].stateB * coefBlueBlue) / (coefBlueRed + coefBlueGreen + coefBlueBlue);
                    sumB += filterResultB * valueB;
                    if(filterResultB > this._countingFloorB) cptB++;
                }
            }
            
        }
*/
        /*
        // boucles dans le convolFilter
        let maxRadius = Math.max(this._convolRadiusR, this._convolRadiusG, this._convolRadiusB.length);
        for(let i = 0; i < this._convolFilterR.length; i++) {
            for(let j = 0; j < this._convolFilterR.length; j++) {
                const filterResultR = this._convolFilterR[i][j];
                const filterResultG = this._convolFilterG[i][j];
                const filterResultB = this._convolFilterB[i][j];
                let x1 = x0 + i;
                let y1 = y0 + j;
                // gerer les bords du tableau de 0 a maxI : reboucler
                // gerer les bords du tableau de 0 a maxJ : reboucler
                x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                
                const valueR = (this._cells[x1][y1].stateR * coefRedRed + this._cells[x1][y1].stateG * coefRedGreen + this._cells[x1][y1].stateB * coefRedBlue) / (coefRedRed + coefRedGreen + coefRedBlue);
                const valueG = (this._cells[x1][y1].stateR * coefGreenRed + this._cells[x1][y1].stateG * coefGreenGreen + this._cells[x1][y1].stateB * coefGreenBlue) / (coefGreenRed + coefGreenGreen + coefGreenBlue);
                const valueB = (this._cells[x1][y1].stateR * coefBlueRed + this._cells[x1][y1].stateG * coefBlueGreen + this._cells[x1][y1].stateB * coefBlueBlue) / (coefBlueRed + coefBlueGreen + coefBlueBlue);
                sumR += filterResultR * valueR;
                sumG += filterResultG * valueG;
                sumB += filterResultB * valueB;
                if(filterResultR > this._countingFloorR) cptR++;
                if(filterResultG > this._countingFloorG) cptG++;
                if(filterResultB > this._countingFloorB) cptB++;
            }
        }*/

        for(let i = 0; i < this._convolFilterR.length; i++) {
            for(let j = 0; j < this._convolFilterR.length; j++) {
                const filterResultR = this._convolFilterR[i][j] ; // * this._countingFloorR
                let x1 = x0R + i;
                let y1 = y0R + j;
 
                //x1 = x1 < 0 ? this._maxI + x1 : x1; 
                //x1 = x1 >= this._maxI ? x1 - this._maxI : x1;
                //y1 = y1 < 0 ? this._maxJ + y1 : y1;
                //y1 = y1 >= this._maxJ ? y1 - this._maxJ : y1;
                const cyclicCoords = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ);
                x1 = cyclicCoords.x;
                y1 = cyclicCoords.y;
                const valueR = (this._cells[x1][y1].stateR * coefRedRed + this._cells[x1][y1].stateG * coefRedGreen + this._cells[x1][y1].stateB * coefRedBlue) / (coefRedRed + coefRedGreen + coefRedBlue);
                
                if(filterResultR > this._countingFloorR) {
                    sumR += filterResultR * valueR;
                    cptR++;
                } 
                //cptR++;
            }
        }


        for(let i = 0; i < this._convolFilterG.length; i++) {
            for(let j = 0; j < this._convolFilterG.length; j++) {
                const filterResultG = this._convolFilterG[i][j]; // * this._countingFloorG
                let x1 = x0G + i;
                let y1 = y0G + j;
                const cyclicCoords = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ);
                x1 = cyclicCoords.x;
                y1 = cyclicCoords.y;
                const valueG = (this._cells[x1][y1].stateR * coefGreenRed + this._cells[x1][y1].stateG * coefGreenGreen + this._cells[x1][y1].stateB * coefGreenBlue) / (coefGreenRed + coefGreenGreen + coefGreenBlue);
                if(filterResultG > this._countingFloorG) {
                    sumG += filterResultG * valueG;
                    cptG++; 
                }
                //cptG++;
            }
        }

        for(let i = 0; i < this._convolFilterB.length; i++) {
            for(let j = 0; j < this._convolFilterB.length; j++) {
                const filterResultB = this._convolFilterB[i][j]; //  * this._countingFloorB
                let x1 = x0B + i;
                let y1 = y0B + j;
                const cyclicCoords = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ);
                x1 = cyclicCoords.x;
                y1 = cyclicCoords.y;
                const valueB = (this._cells[x1][y1].stateR * coefBlueRed + this._cells[x1][y1].stateG * coefBlueGreen + this._cells[x1][y1].stateB * coefBlueBlue) / (coefBlueRed + coefBlueGreen + coefBlueBlue);
                if(filterResultB > this._countingFloorB) {
                    sumB += filterResultB * valueB;
                    cptB++;
                }
                //cptB++;
            }
        }


        averages = {
            'red' : (sumR / (cptR)),
            'green' : (sumG / (cptG)),
            'blue' : (sumB / (cptB))
        }; //this._convolFilter.length * this._convolFilter.length
        return averages;
    }

    public generateNextCells(): ICell[][] {
        // faire tableau a renvoyer
        const newCells: ICell[][] = [];
        // boucle sur i de i =13 à maxI - 13
        for(let i = 0; i < this._maxI; i++) {
            // boucle sur j de j =13 à maxJ - 13
            newCells[i] = [];
            for(let j = 0; j < this._maxJ; j++) {
                // boucle sur j de j =13 à maxJ - 13
                const values = this.getFilterResult(i, j);
                let newR = this.getEvolve(this._cells[i][j].stateR, values.red);
                newR = newR < 0 ? 0 : newR;
                newR = newR > 1 ? 1 : newR;
                let newG = this.getEvolve(this._cells[i][j].stateG, values.green);
                newG = newG < 0 ? 0 : newG;
                newG = newG > 1 ? 1 : newG;
                let newB = this.getEvolve(this._cells[i][j].stateB, values.blue);
                newB = newB < 0 ? 0 : newB;
                newB = newB > 1 ? 1 : newB;
                //this._cells[i][j].stateR = newR;
                //this._cells[i][j].stateG = newG;
                //this._cells[i][j].stateB = newB;
                newCells[i][j] = {
                    i: i,
                    j: j,
                    stateR: newR,
                    stateG: newG,
                    stateB: newB
                }
            }
        }
        this._cells = newCells;
        return this._cells;
    }

/*
    public testConvolFilter(i: number, j: number): ICell[][] {
        const i0 = Math.floor(i - this._convolFilterR.length / 2);
        const j0 = Math.floor(j - this._convolFilterR.length / 2);
        //console.log('i0 :', i0, ' j0 :', j0);
        for(let x = 0; x < this._convolFilterR.length; x++) {
            for(let y = 0; y < this._convolFilterR.length; y++) {
                //console.log(this._convolFilterR[x][y]);
                const value = this._convolFilterR[x][y];
                
                this._cells[i0 + x][j0 + y].stateR = value;
                this._cells[i0 + x][j0 + y].stateG = value;
                this._cells[i0 + x][j0 + y].stateB = value;
            }   
        }
        return this._cells;
    }
*/

    /*
    public drawGaussianBlur(i: number, j: number): ICell[][] {
        const blurSize = Math.floor(CellConfig.CELL_BRUSH_SIZE/2);
        const x0 = Math.floor(i - blurSize / 2);
        const y0 = Math.floor(j - blurSize / 2);
        for(let x = 0; x < blurSize; x++) {
            for(let y = 0; y < blurSize; y++) {
                const dist = Math.sqrt((x - blurSize / 2) * (x - blurSize / 2) + (y - blurSize / 2) * (y - blurSize / 2)) / blurSize;
                let value = (1 - Math.exp( -1 * ((dist - 0.5) * (dist - 0.5)) / (2 * 0.25 * 0.25) ))/2;
                value = value > 1 ? 1 : value;
                value = value < 0 ? 0 : value;
                //console.log('value :', value);
                let newRed = this._cells[x0 + x][y0 + y].stateR + value ;
                let newGreen = this._cells[x0 + x][y0 + y].stateG + value;
                let newBlue = this._cells[x0 + x][y0 + y].stateB + value;
                newRed = newRed > 1 ? 1 : newRed;
                newGreen = newGreen > 1 ? 1 : newGreen;
                newBlue = newBlue > 1 ? 1 : newBlue;
                this._cells[x0 + x][y0 + y].stateR = newRed;
                this._cells[x0 + x][y0 + y].stateG = newGreen;
                this._cells[x0 + x][y0 + y].stateB = newBlue;
            }
        }
        return this._cells;
    }
    */

    private getCyclicCoords(x1: number, y1: number, maxI: number, maxJ: number): any {
        x1 = x1 < 0 ? maxI + x1 : x1; 
        x1 = x1 >= maxI ? x1 - maxI : x1;
        y1 = y1 < 0 ? maxJ + y1 : y1;
        y1 = y1 >= maxJ ? y1 - maxJ : y1;
        return {x: x1, y: y1};
    }

    public drawRandowCircle(i: number, j: number): ICell[][] {
        const size = this._brushSize;
        const x0 = Math.floor(i - size / 2);
        const y0 = Math.floor(j - size / 2);
        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                const dist = Math.sqrt((x - size / 2) * (x - size / 2) + (y - size / 2) * (y - size / 2)) / size;
                //console.log('dist :', dist);
                //const value = Math.random();
                if(dist <= 0.5) {
                    let newRed = Math.random();
                    let newGreen = Math.random();
                    let newBlue = Math.random();
                    newRed = newRed > 1 ? 1 : newRed;
                    newGreen = newGreen > 1 ? 1 : newGreen;
                    newBlue = newBlue > 1 ? 1 : newBlue;
                    let x1 = x0 + x;
                    let y1 = y0 + y;
                    /*
                    x1 = x1 < 0 ? this._maxI + x1 : x1; 
                    x1 = x1 >= this._maxI ? x1 - this._maxI : x1;
                    y1 = y1 < 0 ? this._maxJ + y1 : y1;
                    y1 = y1 >= this._maxJ ? y1 - this._maxJ : y1;
                    */
                    x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                    y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                    this._cells[x1][y1].stateR = newRed;
                    this._cells[x1][y1].stateG = newGreen;
                    this._cells[x1][y1].stateB = newBlue;  
                }
            }
        }
        return this._cells;
    }

    public clearCircle(i: number, j: number): ICell[][] {
        const size = this._brushSize;
        const x0 = Math.floor(i - size / 2);
        const y0 = Math.floor(j - size / 2);
        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                const dist = Math.sqrt((x - size / 2) * (x - size / 2) + (y - size / 2) * (y - size / 2)) / size;
                if(dist <= 0.5) {
                    let x1 = x0 + x;
                    let y1 = y0 + y;
                    /*
                    x1 = x1 < 0 ? this._maxI + x1 : x1; 
                    x1 = x1 >= this._maxI ? x1 - this._maxI : x1;
                    y1 = y1 < 0 ? this._maxJ + y1 : y1;
                    y1 = y1 >= this._maxJ ? y1 - this._maxJ : y1;
                    */
                    x1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).x;
                    y1 = this.getCyclicCoords(x1, y1, this._maxI, this._maxJ).y;
                    this._cells[x1][y1].stateR = 0;
                    this._cells[x1][y1].stateG = 0;
                    this._cells[x1][y1].stateB = 0;
                }
            }
        }
        return this._cells;
    }

    public setCellSize(cellSize: number) {
        this._cellSize = cellSize;
        this._maxI = Math.floor(CanvasConfig.CANVAS_WIDTH / this._cellSize);
        this._maxJ = Math.floor(CanvasConfig.CANVAS_HEIGHT / this._cellSize);
    }

    public setConvolRadiusR(convolRadius: number) {
        this._convolRadiusR = convolRadius;
    }

    public setConvolMuR(convolMu: number) {
        this._convolMuR = convolMu;
    }

    public setConvolSigmaR(convolSigma: number) {
        this._convolSigmaR = convolSigma;
    }

    public setConvolRadiusG(convolRadius: number) {
        this._convolRadiusG = convolRadius;
    }

    public setConvolMuG(convolMu: number) {
        this._convolMuG = convolMu;
    }

    public setConvolSigmaG(convolSigma: number) {
        this._convolSigmaG = convolSigma;
    }

    public setConvolRadiusB(convolRadius: number) {
        this._convolRadiusB = convolRadius;
    }

    public setConvolMuB(convolMu: number) {
        this._convolMuB = convolMu;
    }

    public setConvolSigmaB(convolSigma: number) {
        this._convolSigmaB = convolSigma;
    }

    public setBrushSize(brushSize: number) {
        this._brushSize = brushSize;
    }

    public setCellGrowthMu(cellGrowthMu: number) {
        this._cellGrowthMu = cellGrowthMu;
    }
 
    public setCellGrowthSigma(cellGrowthSigma: number) {
        this._cellGrowthSigma = cellGrowthSigma;
    }

    public setCountingFloorR(countingFloorR: number) {
        this._countingFloorR = countingFloorR;
    }

    public setCountingFloorG(countingFloorG: number) {
        this._countingFloorG = countingFloorG;
    }

    public setCountingFloorB(countingFloorB: number) {
        this._countingFloorB = countingFloorB;
    }

    public setColorSensibilityR(colorSensibilityR: [number, number, number]) {
        this._colorSensibilityR = colorSensibilityR;
    }

    public setColorSensibilityG(colorSensibilityG: [number, number, number]) {
        this._colorSensibilityG = colorSensibilityG;
    }

    public setColorSensibilityB(colorSensibilityB: [number, number, number]) {
        this._colorSensibilityB = colorSensibilityB;
    }

    public setCellEvolutionDeltaT(cellEvolutionDeltaT: number) {
        this._cellEvolutionDeltaT = cellEvolutionDeltaT;
    }

    public getCellSize(): number {
        return this._cellSize;
    }

    public getConvolRadiusR(): number {
        return this._convolRadiusR;
    }

    public getConvolMuR(): number {
        return this._convolMuR;
    }

    public getConvolSigmaR(): number {
        return this._convolSigmaR;
    }

    public getConvolRadiusG(): number {
        return this._convolRadiusG;
    }

    public getConvolMuG(): number {
        return this._convolMuG;
    }

    public getConvolSigmaG(): number {
        return this._convolSigmaG;
    }

    public getConvolRadiusB(): number {
        return this._convolRadiusB;
    }

    public getConvolMuB(): number {
        return this._convolMuB;
    }

    public getConvolSigmaB(): number {
        return this._convolSigmaB;
    }

    public getBrushSize(): number {
        return this._brushSize;
    }

    public getCellGrowthMu(): number {
        return this._cellGrowthMu;
    }

    public getCellGrowthSigma(): number {
        return this._cellGrowthSigma;
    }

    public getCountingFloorR(): number {
        return this._countingFloorR;
    }

    public getCountingFloorG(): number {
        return this._countingFloorG;
    }

    public getCountingFloorB(): number {
        return this._countingFloorB;
    }

    public getCells(): ICell[][] {
        return this._cells;
    }

    public getColorSensibilityR(): [number, number, number] {
        return this._colorSensibilityR;
    }

    public getColorSensibilityG(): [number, number, number] {
        return this._colorSensibilityG;
    }

    public getColorSensibilityB(): [number, number, number] {
        return this._colorSensibilityB;
    }

    public getCellEvolutionDeltaT(): number {
        return this._cellEvolutionDeltaT;
    }
}