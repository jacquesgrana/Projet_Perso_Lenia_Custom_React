import { useEffect, useRef, useState } from "react";
import UseMousePosition from "../../../hook/UseMousePosition";
import CanvasConfig from "../../../config/CanvasConfig";
import ICell from "../../../interface/ICell";
import CellConfig from "../../../config/CellConfig";
import CellService from "../../../service/CellService";
import IToast from "../../../interface/IToast";
import { Accordion } from "react-bootstrap";
import Slider from 'rc-slider';
//import 'rc-slider/assets/index.css';

const CustomCanvas = (props: any) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [virtTimeCounter, setVirtTimeCounter] = useState(0);
    const [coords, handleCoords] = UseMousePosition(true);
    const width = CanvasConfig.CANVAS_WIDTH;
    const height = CanvasConfig.CANVAS_HEIGHT;
    const delay = CanvasConfig.CANVAS_DELAY;
    const cellService = CellService.getInstance();

    const [floorR, setFloorR] = useState<number>(cellService.getCountingFloorR());
    const [floorG, setFloorG] = useState<number>(cellService.getCountingFloorG());
    const [floorB, setFloorB] = useState<number>(cellService.getCountingFloorB());

    const intervalRef = useRef<null | any>(null);

    const maxI = Math.floor(width / CellConfig.CELL_SIZE);
    const maxJ = Math.floor(height / CellConfig.CELL_SIZE);

    //const cells: ICell[][] = [];
    const cellsRef = useRef<ICell[][]>([]);
    let firsloadRef = useRef<boolean>(true);

    useEffect(() => {
        initCells();
        randomizeCells();
        drawCells();
        if (firsloadRef.current) {
            firsloadRef.current = false;
        }
        //generateRandomImage();  
    }, []);

    useEffect(() => {    
        const fct = () => {
            //initCells();
            //generateRandomImage();
            //randomizeCells();
            generateNext();
            drawCells();
            setVirtTimeCounter((prev: number) => prev + CellConfig.CELL_GENERATION_DELTA_T);
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

    useEffect(() => {

        !firsloadRef.current && isRunning ? displayRunToast() : displayStopToast();
    }, [isRunning]);

    const initCells = () => {
        cellsRef.current = cellService.init();
        updateFloors();
        setVirtTimeCounter(0);
        /*
        for(let i = 0; i < maxI; i++){ 
            cellsRef.current[i] = new Array<ICell>(maxJ);
        }*/
        updateSliders();
    }

    const generateNext = () => {
        cellsRef.current = cellService.generateNextCells();
    }

    const randomizeCells = () => {
        cellsRef.current = cellService.init();
        updateFloors();
        cellsRef.current = cellService.getRandomizedCells();
        setVirtTimeCounter(0);
        updateSliders();
    }

    const clearCells = () => {
        cellsRef.current = cellService.init();
        updateFloors();
        setVirtTimeCounter(0);
    }

    const updateFloors = () => {
        setFloorR(cellService.getCountingFloorR());
        setFloorG(cellService.getCountingFloorG());
        setFloorB(cellService.getCountingFloorB());
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
            if (btn) btn.innerText = !prev ? "PAUSE" : "RUN";
            //!prev ? displayRunToast() : displayStopToast();
            //!prev ? displayRunToast() : displayStopToast();
            return !prev;
        });
        //!isRunning ? displayRunToast() : displayStopToast();
    }

    const displayRunToast = async () => {
        const toastToDisplay: IToast = {
            title: "RUN",
            subtitle: "Running",
            message: "The simulation is runnning",
            mode: "success",
            delay: 1000
        };
        
        props.displayToast(toastToDisplay);
        //props.displayToast(toastToDisplay);
    }

    const displayStopToast = async () => {
        const toastToDisplay: IToast = {
            title: "STOP",
            subtitle: "Stopped",
            message: "The simulation is stopped",
            mode: "danger",
            delay: 1000
        };

        props.displayToast(toastToDisplay);
        //props.displayToast(toastToDisplay);
    }

    const displayResetToast = () => {
        const toastToDisplay: IToast = {
            title: "RESET",
            subtitle: "Reset",
            message: "The simulation is reset",
            mode: "warning",
            delay: 1500
        };
        props.displayToast(toastToDisplay);
    }

    const displayRandomizeToast = () => {
        const toastToDisplay: IToast = {
            title: "RANDOMIZE",
            subtitle: "Randomize",
            message: "The simulation is randomized",
            mode: "info",
            delay: 1500
        };
        props.displayToast(toastToDisplay);   
    }

    const handleMouseDown = (e: any) => {
            handleCoords((e as unknown) as MouseEvent);
            if (canvasRef.current) {
                // récupérer les coordonnées du clic
                const mouseX = coords.x;
                const mouseY = coords.y;
                //console.log("MouseX : ", mouseX, " MouseY : ", mouseY);
                const mouseI = Math.floor(mouseX / CellConfig.CELL_SIZE);
                const mouseJ = Math.floor(mouseY / CellConfig.CELL_SIZE);
                //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
                const radius = Math.floor(CellConfig.CELL_BRUSH_SIZE/2);
                if(mouseI >= radius && mouseI <= maxI - radius && mouseJ >= radius && mouseJ <= maxJ - radius){
                    //console.log('e.button :', e.button);
                    if (e.button === 0) {
                        const ctx = canvasRef.current.getContext("2d");
                        ctx?.ellipse(mouseX, mouseY, radius * CellConfig.CELL_SIZE, radius * CellConfig.CELL_SIZE, 0, 0, 2 * Math.PI);
                        //console.log('clic')
                        
                        cellsRef.current = cellService.drawRandowCircle(mouseI, mouseJ);
                        drawCells();
                    }
                    else if (e.button === 2) {
                        //e.preventDefault();
                        //console.log('clic droit')
                        cellsRef.current = cellService.clearCircle(mouseI, mouseJ);
                        drawCells();
                    }
                    
                }
                
                //cellsRef.current = cellService.getCells();
            }
          }

          // marche pas correctement : ajouter state de type booleen pour gerer le survol et gerer l'event onMouseLeave
/*
          const handleMouseOver = (e: any) => {
            console.log('mouse over');
            handleCoords((e as unknown) as MouseEvent);
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext("2d");

              const mouseX = coords.x;
              const mouseY = coords.y;
              //console.log("MouseX : ", mouseX, " MouseY : ", mouseY);
              const mouseI = Math.floor(mouseX / CellConfig.CELL_SIZE);
              const mouseJ = Math.floor(mouseY / CellConfig.CELL_SIZE);
              //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
              const radius = 32;
              if(mouseI >= radius && mouseI <= maxI - radius && mouseJ >= radius && mouseJ <= maxJ - radius){
                    const ctx = canvasRef.current.getContext("2d");
                    if(ctx){
                        ctx?.beginPath(); // Commencez un nouveau chemin
                        ctx.ellipse(mouseX, mouseY, radius * CellConfig.CELL_SIZE, radius * CellConfig.CELL_SIZE, 0, 0, 2 * Math.PI); // Dessinez l'ellipse

                        // Définissez la couleur de remplissage
                        ctx.fillStyle = 'rgba(255, 165, 0, 0.4)'; // Orange transparent à 40%
                        ctx.fill(); // Remplissez l'ellipse avec la couleur de remplissage

                        // Définissez la couleur du trait
                        ctx.strokeStyle = 'rgba(255, 165, 0, 1)'; // Orange à 100%
                        ctx.lineWidth = 2; // Définissez l'épaisseur du trait (ajustez selon vos besoins)
                        ctx.stroke(); // Dessinez le contour de l'ellipse avec la couleur du trait
                  }

              }
              
            }
          }
*/

const updateSliders = () => {
    setFloorR(cellService.getCountingFloorR());
    setFloorG(cellService.getCountingFloorG());
    setFloorB(cellService.getCountingFloorB());
  };
  const handleOnChangeFloorSliderR = (value: any) => {
    setFloorR(value);
    cellService.setCountingFloorR(value);
  };
  
  const handleOnChangeFloorSliderG = (value: any) => {
    setFloorG(value);
    cellService.setCountingFloorG(value);
  };
  
  const handleOnChangeFloorSliderB = (value: any) => {
    setFloorB(value);
    cellService.setCountingFloorB(value);
  };

    return (
        <div className="d-flex flex-column align-items-center gap-3">
            <h2 className="text-center">CustomCanvas</h2>
           
            <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ border: "1px solid black" }}
            onMouseDown={handleMouseDown}
            //onMouseOver={handleMouseOver}
            />
            <p>left-click : add circle / right-click : clear circle</p>
            <h3 className="text-center mt-2">Virtual time counter : {virtTimeCounter.toFixed(2)} (s)</h3>
            <div className="d-flex gap-3 justify-content-center mb-2">
                <button
                className="btn-1"
                type="button"
                onClick={() => {
                    displayRandomizeToast();
                    randomizeCells();
                    drawCells();
                }}
                >
                    RANDOM
                </button>
                <button
                className="btn-1"
                type="button"
                onClick={() => {
                    displayResetToast();
                    clearCells();
                    drawCells();
                }}
                >
                    CLEAR
                </button>
                <button
                className="btn-1" 
                id="button-run"
                type="button"
                onClick={() => toggleIsRunning()}
                >
                    RUN
                </button>  
            </div>
            <Accordion 
            defaultActiveKey={null}
            className="accordion-container mb-5"
            >
                <Accordion.Item eventKey="0" >
                    <Accordion.Header>Settings</Accordion.Header>
                    <Accordion.Body>
                    <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center">
                        <div className="settings-color-column">
                            <p><strong>Red</strong></p>
                            <label>Counting floor : {floorR}</label>
                            <Slider 
                            min = {0}
                            max = {1}
                            step = {0.01}
                            value= {floorR}
                            onChange={handleOnChangeFloorSliderR}
                            className="slider-floor" 
                            />
                        </div>
                        <div className="settings-color-column">
                            <p><strong>Green</strong></p>
                            <label>Counting floor : {floorG}</label>
                            <Slider 
                            min = {0}
                            max = {1}
                            step = {0.01}
                            value= {floorG}
                            onChange={handleOnChangeFloorSliderG}
                            className="slider-floor"
                            />
                        </div>
                        <div className="settings-color-column">
                            <p><strong>Blue</strong></p>
                            <label>Counting floor : {floorB}</label>
                            <Slider 
                            min = {0}
                            max = {1}
                            step = {0.01}
                            value= {floorB}
                            onChange={handleOnChangeFloorSliderB}
                            className="slider-floor"
                            />
                        </div>
                    </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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