import { cp } from "fs";
import CanvasConfig from "../config/CanvasConfig";
import CellConfig from "../config/CellConfig";
import ICell from "../interface/ICell";
import { countReset } from "console";

export default class CellService {

    private static _instance: CellService | null = null;
    private _cells: ICell[][] = [];
    private _convolFilter: number[][] = [];
    private _maxI: number = 0;
    private _maxJ: number = 0;

    private constructor() {}

    public static getInstance(): CellService {
        if (this._instance === null) {
            this._instance = new CellService();
            this._instance.init();
            this._instance.initConvolFilter();
        }
        return this._instance;
      }

    public init() {
        this._maxI = Math.floor(CanvasConfig.CANVAS_WIDTH / CellConfig.CELL_SIZE);
        this._maxJ = Math.floor(CanvasConfig.CANVAS_HEIGHT / CellConfig.CELL_SIZE);
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

    private initConvolFilter() {
        const r = CellConfig.CELL_CONV_FILTER_RADIUS;
        const x0 = r;
        const y0 = r;
        const mu = CellConfig.CELL_CONV_FILTER_MU;
        const sigma = CellConfig.CELL_CONV_FILTER_SIGMA;

        for(let x = 0; x < 2 * r + 1; x++) {
            this._convolFilter[x] = [];
            for(let y = 0; y < 2 * r + 1; y++) {
                const dist = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))/r;
                //console.log('dist :', dist);
                const convolValue = Math.exp( -1 * ((dist - mu) * (dist - mu)) / (2 * sigma * sigma) );
                this._convolFilter[x][y] = convolValue;
                //this._convolFilter[x][j] = Math.exp( -((i - x0) * (i - x0) + (j - y0) * (j - y0)) / (2 * sigma * sigma) ) * (1 / (2 * Math.PI * sigma * sigma));
            }
        }

        //console.log(this._convolFilter);
    }

    // a mettre dans une lib !
    private getGrowth(u: number): number {
        const mu = CellConfig.CELL_GROWTH_MU;
        const sigma = CellConfig.CELL_GROWTH_SIGMA;
        const value = 2 * Math.exp( -1 * ((u - mu) * (u - mu)) / (2 * sigma * sigma)) - 1;
        return value;
    }

    // a mettre dans une lib !
    private getEvolve(x: number, u: number): number {
        const dt = CellConfig.CELL_GENERATION_DELTA_T;
        x += dt * this.getGrowth(u);
        return x;
        
    }

    // a mettre dans une lib ?
    private getFilterResult(x: number, y: number): number {
        const coefRed = 1;
        const coefGreen = 1;
        const coefBlue = 1;
        const x0 = Math.floor(x - this._convolFilter.length / 2) + 1;
        const y0 = Math.floor(y - this._convolFilter.length / 2) + 1;
        let average = 0;
        let sum = 0;
        let cpt = 0;
        const floor = 0.1;
        // boucles dans le convolFilter
        for(let i = 0; i < this._convolFilter.length; i++) {
            for(let j = 0; j < this._convolFilter.length; j++) {
                const value = this._convolFilter[i][j];
                let x1 = x0 + i;
                let y1 = y0 + j;
                // gerer les bords du tableau de 0 a maxI : reboucler
                // gerer les bords du tableau de 0 a maxJ : reboucler
                x1 = x1 < 0 ? this._maxI + x1 : x1; 
                x1 = x1 >= this._maxI ? x1 - this._maxI : x1;
                y1 = y1 < 0 ? this._maxJ + y1 : y1;
                y1 = y1 >= this._maxJ ? y1 - this._maxJ : y1;
                const value2 = (this._cells[x1][y1].stateR * coefRed + this._cells[x1][y1].stateG * coefGreen + this._cells[x1][y1].stateB * coefBlue) / (coefRed + coefGreen + coefBlue);
                sum += value * value2;
                if(value > floor) cpt++;
            }
        }
        average = sum / (cpt); //this._convolFilter.length * this._convolFilter.length
        return average;
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
                const value = this.getFilterResult(i, j);
                let newR = this.getEvolve(this._cells[i][j].stateR, value);
                newR = newR < 0 ? 0 : newR;
                newR = newR > 1 ? 1 : newR;
                let newG = this.getEvolve(this._cells[i][j].stateG, value);
                newG = newG < 0 ? 0 : newG;
                newG = newG > 1 ? 1 : newG;
                let newB = this.getEvolve(this._cells[i][j].stateB, value);
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
/*
        // copier tableau newCells dans this._cells a partir de 13 à maxI - 13 et de 13 à maxJ - 13
        for(let i = 0; i < this._maxI; i++) {
            for(let j = 0; j < this._maxJ; j++) {
                this._cells[i][j] = newCells[i][j];
            }
        }*/
        this._cells = newCells;
        return this._cells;
    }


    public testConvolFilter(i: number, j: number): ICell[][] {
        const i0 = Math.floor(i - this._convolFilter.length / 2);
        const j0 = Math.floor(j - this._convolFilter.length / 2);
        //console.log('i0 :', i0, ' j0 :', j0);
        for(let x = 0; x < this._convolFilter.length; x++) {
            for(let y = 0; y < this._convolFilter.length; y++) {
                //console.log(this._convolFilter[x][y]);
                const value = this._convolFilter[x][y];
                
                this._cells[i0 + x][j0 + y].stateR = value;
                this._cells[i0 + x][j0 + y].stateG = value;
                this._cells[i0 + x][j0 + y].stateB = value;
            }   
        }
        return this._cells;
    }

    public drawGaussianBlur(i: number, j: number): ICell[][] {
        const blurSize = 32;
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

    public drawRandowSquare(i: number, j: number): ICell[][] {
        const size = 64;
        const x0 = Math.floor(i - size / 2);
        const y0 = Math.floor(j - size / 2);
        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                //const value = Math.random();
                let newRed = Math.random();
                let newGreen = Math.random();
                let newBlue = Math.random();
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

    public getCells(): ICell[][] {
        return this._cells;
    }
}