import { useEffect, useRef, useState } from "react";
import UseMousePosition from "../../../hook/UseMousePosition";
import CanvasConfig from "../../../config/CanvasConfig";
import ICell from "../../../interface/ICell";
import CellConfig from "../../../config/CellConfig";
import CellService from "../../../service/CellService";

const CustomCanvas = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const [coords, handleCoords] = UseMousePosition(true);
    const width = CanvasConfig.CANVAS_WIDTH;
    const height = CanvasConfig.CANVAS_HEIGHT;
    const delay = CanvasConfig.CANVAS_DELAY;
    const cellService = CellService.getInstance();

    const intervalRef = useRef<null | any>(null);

    const maxI = Math.floor(width / CellConfig.CELL_SIZE);
    const maxJ = Math.floor(height / CellConfig.CELL_SIZE);

    //const cells: ICell[][] = [];
    const cellsRef = useRef<ICell[][]>([]);

    useEffect(() => {
        initCells();
        randomizeCells();
        drawCells();
        //generateRandomImage();  
    }, []);

    useEffect(() => {    
        const fct = () => {
            //initCells();
            //generateRandomImage();
            //randomizeCells();
            generateNext();
            drawCells();
            intervalRef.current = setTimeout(fct, delay);
        };
  
        if (isRunning) {
            fct();
        }
    
        // Effet de nettoyage
        return () => {
            clearTimeout(intervalRef.current);
        };

    }, [isRunning, delay]);

    const initCells = () => {
        cellsRef.current = cellService.init();
        /*
        for(let i = 0; i < maxI; i++){ 
            cellsRef.current[i] = new Array<ICell>(maxJ);
        }*/
    }

    const generateNext = () => {
        cellsRef.current = cellService.generateNextCells();
    }

    const randomizeCells = () => {
        cellsRef.current = cellService.getRandomizedCells();
        //cellsRef.current = cellService.getCells();
        /*
        for(let i = 0; i < maxI; i++){ 
            for(let j = 0; j < maxJ; j++){
                cellsRef.current[i][j] = {
                    i: i,
                    j: j,
                    stateR: Math.random(),
                    stateG:Math.random(),
                    stateB: Math.random()
                }
            }
        }*/
    }

    const drawCells = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if(ctx){
            for(let i = 0; i < maxI; i++){ 
                for(let j = 0; j < maxJ; j++){
                    const cell = cellsRef.current[i][j];
                    const x = i * CellConfig.CELL_SIZE;
                    const y = j * CellConfig.CELL_SIZE;
                    const red = Math.floor(cell.stateR * 255);
                    const green = Math.floor(cell.stateG * 255);
                    const blue = Math.floor(cell.stateB * 255);
                    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                    ctx.fillRect(x, y, CellConfig.CELL_SIZE, CellConfig.CELL_SIZE);
                }
            } 
        }
    }

    /*
    const generateRandomImage = () => {
        const ctx = canvasRef.current?.getContext("2d");
            //ctx?.strokeRect(200, 200, 40, 50);
            const imageData = ctx?.createImageData(width, height);
            if(imageData){
                for (let i = 0; i < imageData.data.length; i += 4) {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                const a = 255; // Opacité complète
          
                imageData.data[i] = r;
                imageData.data[i + 1] = g;
                imageData.data[i + 2] = b;
                imageData.data[i + 3] = a;
              }
              ctx?.putImageData(imageData, 0, 0);
            }
    }
    */

    const toggleIsRunning = () => {
        //isRunning.current = !isRunning.current;
        setIsRunning((prev) => {
            //console.log('isRunning button :', !prev);
            const btn = document.getElementById("button-run");
            //console.log('btn :', btn);
            if (btn) btn.innerText = !prev ? "STOP" : "RUN";
            return !prev
        });
        
    }

    const handleClick = (e: any) => {
            handleCoords((e as unknown) as MouseEvent);
            if (canvasRef.current) {
                // récupérer les coordonnées du clic
                const mouseX = coords.x;
                const mouseY = coords.y;
                //console.log("MouseX : ", mouseX, " MouseY : ", mouseY);
                const mouseI = Math.floor(mouseX / CellConfig.CELL_SIZE);
                const mouseJ = Math.floor(mouseY / CellConfig.CELL_SIZE);
                //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
                const radius = CellConfig.CELL_CONV_FILTER_RADIUS;
                if(mouseI >= radius && mouseI < maxI - radius && mouseJ >= radius && mouseJ < maxJ - radius){
                    cellsRef.current = cellService.testConvolFilter(mouseI, mouseJ);
                    drawCells();
                }
                
                //cellsRef.current = cellService.getCells();
            }
          }
    

    return (
        <div className="d-flex flex-column align-items-center gap-3">
            <h2 className="text-center">CustomCanvas</h2>
            <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ border: "1px solid black" }}
            onClick={handleClick}
            /*
            onClick={(e) => {
                handleCoords((e as unknown) as MouseEvent);
                if (canvasRef.current) {
                  const ctx = canvasRef.current.getContext("2d");
                  ctx?.strokeRect(coords.x, coords.y, 40, 40);
                }
              }}
              */
            />
            <button
            type="button"
            onClick={() => {
                randomizeCells();
                drawCells();
            }}
            >
                RESET
            </button>
            <button
            id="button-run"
            type="button"
            onClick={() => toggleIsRunning()}
            >
                RUN
            </button>
        </div>
    );
}

export default CustomCanvas;

/*
{
    if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, width, height);
    }
}
*/