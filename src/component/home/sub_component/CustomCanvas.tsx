import { useEffect, useRef, useState } from "react";
import UseMousePosition from "../../../hook/UseMousePosition";
import CanvasConfig from "../../../config/CanvasConfig";
import ICell from "../../../interface/ICell";
import CellConfig from "../../../config/CellConfig";
import CellService from "../../../service/CellService";
import IToast from "../../../interface/IToast";
import { Accordion } from "react-bootstrap";
import Slider from 'rc-slider';
import AppConfig from "../../../config/AppConfig";
//import 'rc-slider/assets/index.css';

const CustomCanvas = (props: any) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    //const [isMouseOver, setIsMouseOver] = useState(false);
    const [virtTimeCounter, setVirtTimeCounter] = useState(0);
    const [coords, handleCoords] = UseMousePosition(true);
    const width = CanvasConfig.CANVAS_WIDTH;
    const height = CanvasConfig.CANVAS_HEIGHT;
    const delay = AppConfig.APP_DELAY;
    const cellService = CellService.getInstance();

    const [convFilterRadiusR, setConvFilterRadiusR] = useState<number>(cellService.getConvolRadiusR());
    const [convFilterMuR, setConvFilterMuR] = useState<number>(cellService.getConvolMuR());
    const [convFilterSigmaR, setConvFilterSigmaR] = useState<number>(cellService.getConvolSigmaR());
    const [convFilterRadiusG, setConvFilterRadiusG] = useState<number>(cellService.getConvolRadiusG());
    const [convFilterMuG, setConvFilterMuG] = useState<number>(cellService.getConvolMuG());
    const [convFilterSigmaG, setConvFilterSigmaG] = useState<number>(cellService.getConvolSigmaG());
    const [convFilterRadiusB, setConvFilterRadiusB] = useState<number>(cellService.getConvolRadiusB());
    const [convFilterMuB, setConvFilterMuB] = useState<number>(cellService.getConvolMuB());
    const [convFilterSigmaB, setConvFilterSigmaB] = useState<number>(cellService.getConvolSigmaB());

    const [brushSize, setBrushSize] = useState<number>(cellService.getBrushSize());
    const [floorR, setFloorR] = useState<number>(cellService.getCountingFloorR());
    const [floorG, setFloorG] = useState<number>(cellService.getCountingFloorG());
    const [floorB, setFloorB] = useState<number>(cellService.getCountingFloorB());
    const [colorSensibilityR, setColorSensibilityR] = useState(cellService.getColorSensibilityR());
    const [colorSensibilityG, setColorSensibilityG] = useState(cellService.getColorSensibilityG());
    const [colorSensibilityB, setColorSensibilityB] = useState(cellService.getColorSensibilityB());
    //const [sensibilityR, setSensibilityR] = useState([10, 1, 1]);

    const intervalRef = useRef<null | any>(null);

    const maxI = Math.floor(width / CellConfig.CELL_SIZE);
    const maxJ = Math.floor(height / CellConfig.CELL_SIZE);

    //const cells: ICell[][] = [];
    const cellsRef = useRef<ICell[][]>([]);
    const loadCountRef = useRef<number>(0);

    useEffect(() => {
        initCells();
        randomizeCells();
        drawCells();
        if (loadCountRef.current < AppConfig.APP_LOAD_COUNT_MAX) {
            loadCountRef.current++;
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
        //console.log('firsloadRef.current :', firsloadRef.current);
        //console.log('load count :', AppConfig.APP_LOAD_COUNT_MAX);
        if(loadCountRef.current > AppConfig.APP_LOAD_COUNT_MAX) isRunning ? displayRunToast() : displayStopToast();
        else loadCountRef.current++;
    }, [isRunning]);

    const initCells = () => {
        cellsRef.current = cellService.init();
        cellService.initConvolFilters();
        updateSliders();
        setVirtTimeCounter(0);
        updateSliders();
    }

    const generateNext = () => {
        cellsRef.current = cellService.generateNextCells();
    }

    const randomizeCells = () => {
        cellsRef.current = cellService.init();
        cellService.initConvolFilters();
        cellsRef.current = cellService.getRandomizedCells();
        setVirtTimeCounter(0);
        updateSliders();
    }

    const clearCells = () => {
        cellsRef.current = cellService.init();
        cellService.initConvolFilters();
        updateSliders();
        setVirtTimeCounter(0);
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
                const radius = Math.floor(brushSize/2);
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

    const drawBrush = (e: any) => {
        handleCoords((e as unknown) as MouseEvent);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            const mouseX = coords.x;
            const mouseY = coords.y;
            //console.log("MouseX : ", mouseX, " MouseY : ", mouseY);
            const mouseI = Math.floor(mouseX / CellConfig.CELL_SIZE);
            const mouseJ = Math.floor(mouseY / CellConfig.CELL_SIZE);
            //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
            const radius = Math.floor(brushSize/2);
            if(mouseI >= radius && mouseI <= maxI - radius && mouseJ >= radius && mouseJ <= maxJ - radius){
                    //const ctx = canvasRef.current.getContext("2d");
                    if(ctx){
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

const updateSliders = () => {
    setConvFilterRadiusR(cellService.getConvolRadiusR());
    setConvFilterMuR(cellService.getConvolMuR());
    setConvFilterSigmaR(cellService.getConvolSigmaR());

    setConvFilterRadiusG(cellService.getConvolRadiusG());
    setConvFilterMuG(cellService.getConvolMuG());
    setConvFilterSigmaG(cellService.getConvolSigmaG());

    setConvFilterRadiusB(cellService.getConvolRadiusB());
    setConvFilterMuB(cellService.getConvolMuB());
    setConvFilterSigmaB(cellService.getConvolSigmaB());

    setBrushSize(cellService.getBrushSize());

    setFloorR(cellService.getCountingFloorR());
    setFloorG(cellService.getCountingFloorG());
    setFloorB(cellService.getCountingFloorB());

    setColorSensibilityR(cellService.getColorSensibilityR());
    setColorSensibilityG(cellService.getColorSensibilityG());
    setColorSensibilityB(cellService.getColorSensibilityB());
  };

  const handleOnChangeConvFilterRadiusSliderR = (value: any) => {
    setConvFilterRadiusR(value);
    cellService.setConvolRadiusR(value);
    cellService.initConvolFilterR();
  }

  const handleOnChangeConvFilterMuSliderR = (value: any) => {
    setConvFilterMuR(value);
    cellService.setConvolMuR(value);
    cellService.initConvolFilterR();
  }

  const handleOnChangeConvFilterSigmaSliderR = (value: any) => {
    setConvFilterSigmaR(value);
    cellService.setConvolSigmaR(value);
    cellService.initConvolFilterR();
  }

  const handleOnChangeConvFilterRadiusSliderG = (value: any) => {
    setConvFilterRadiusG(value);
    cellService.setConvolRadiusG(value);
    cellService.initConvolFilterG();
  }

  const handleOnChangeConvFilterMuSliderG = (value: any) => {
    setConvFilterMuG(value);
    cellService.setConvolMuG(value);
    cellService.initConvolFilterG();
  }

  const handleOnChangeConvFilterSigmaSliderG = (value: any) => {
    setConvFilterSigmaG(value);
    cellService.setConvolSigmaG(value);
    cellService.initConvolFilterG();
  }

  const handleOnChangeConvFilterRadiusSliderB = (value: any) => {
    setConvFilterRadiusB(value);
    cellService.setConvolRadiusB(value);
    cellService.initConvolFilterB();
  }

  const handleOnChangeConvFilterMuSliderB = (value: any) => {
    setConvFilterMuB(value);
    cellService.setConvolMuB(value);
    cellService.initConvolFilterB();
  }

  const handleOnChangeConvFilterSigmaSliderB = (value: any) => {
    setConvFilterSigmaB(value);
    cellService.setConvolSigmaB(value);
    cellService.initConvolFilterB();
  }

  const handleOnChangeBrushSizeSlider = (value: any) => {
    setBrushSize(value);
    cellService.setBrushSize(value);
  }
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

  /*
  const handleOnChangeSensibilitySliderR = (value: any) => {
    setColorSensibilityR(value);
    cellService.setColorSensibilityR(value);
  }*/

  const handleOnChangeSensibilitySliderRR = (value: any) => {
    const tab: [number, number, number] = [value, cellService.getColorSensibilityR()[1], cellService.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellService.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRG = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityR()[0], value, cellService.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellService.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRB = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityR()[0], cellService.getColorSensibilityR()[1], value];
    setColorSensibilityR(tab);
    cellService.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderGR = (value: any) => {
      const tab: [number, number, number] = [value, cellService.getColorSensibilityG()[1], cellService.getColorSensibilityG()[2]];
      setColorSensibilityG(tab);
      cellService.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGG = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityG()[0], value, cellService.getColorSensibilityG()[2]];
    setColorSensibilityG(tab);
    cellService.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGB = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityG()[0], cellService.getColorSensibilityG()[1], value];
    setColorSensibilityG(tab);
    cellService.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderBR = (value: any) => {
    const tab: [number, number, number] = [value, cellService.getColorSensibilityB()[1], cellService.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellService.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBG = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityB()[0], value, cellService.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellService.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBB = (value: any) => {
    const tab: [number, number, number] = [cellService.getColorSensibilityB()[0], cellService.getColorSensibilityB()[1], value];
    setColorSensibilityB(tab);
    cellService.setColorSensibilityB(tab);
  }

  /*
  const handleMouseEnter = () => {
    setIsMouseOver((prev) => {
      console.log('isMouseOver :', !prev);
      return !prev;
    });
    //drawBrush();
  }

  const handleMouseLeave = () => {
    setIsMouseOver((prev) => {
      console.log('isMouseOver :', !prev);
      return !prev;
    });
  }
*/

  const handleMouseOver = (e: any) => {
    console.log('mouseOver');
    drawBrush(e);
    /*
      if(isMouseOver){
        console.log('isMouseOver 2 :', isMouseOver);

        drawBrush(e);
      }*/
  }

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
            //onMouseMove={handleMouseOver}
            //onMouseEnter={handleMouseEnter}
            //onMouseLeave={handleMouseLeave}
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
                        <div className="settings-column">
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

                            <label>Conv. radius : {convFilterRadiusR}</label>
                            <Slider 
                            min = {8}
                            max = {26}
                            step = {1}
                            value= {convFilterRadiusR}
                            onChange={handleOnChangeConvFilterRadiusSliderR}
                            className="slider-floor" 
                            />
                            <label>Conv. mu : {convFilterMuR}</label>
                            <Slider 
                            min = {0.1}
                            max = {0.9}
                            step = {0.01}
                            value= {convFilterMuR}
                            onChange={handleOnChangeConvFilterMuSliderR}
                            className="slider-floor" 
                            />
                            <label>Conv. sigma : {convFilterSigmaR}</label>
                            <Slider 
                            min = {0.05}
                            max = {0.5}
                            step = {0.01}
                            value= {convFilterSigmaR}
                            onChange={handleOnChangeConvFilterSigmaSliderR}
                            className="slider-floor" 
                            />

                            <label>Sensibility Red : {colorSensibilityR[0]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityR[0]}
                            onChange={handleOnChangeSensibilitySliderRR}
                            className="slider-floor" 
                            />
                            <label>Sensibility Green : {colorSensibilityR[1]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityR[1]}
                            onChange={handleOnChangeSensibilitySliderRG}
                            className="slider-floor" 
                            />
                            <label>Sensibility Blue : {colorSensibilityR[2]}</label>
                            <Slider
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityR[2]}
                            onChange={handleOnChangeSensibilitySliderRB}
                            className="slider-floor" 
                            />
                        </div>
                        <div className="settings-column">
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

                            <label>Conv. radius : {convFilterRadiusG}</label>
                            <Slider
                            min = {8}
                            max = {26}
                            step = {1}
                            value= {convFilterRadiusG}
                            onChange={handleOnChangeConvFilterRadiusSliderG}
                            className="slider-floor"
                            />
                            <label>Conv. mu : {convFilterMuG}</label>
                            <Slider
                            min = {0.1}
                            max = {0.9}
                            step = {0.01}
                            value= {convFilterMuG}
                            onChange={handleOnChangeConvFilterMuSliderG}
                            className="slider-floor"
                            />
                            <label>Conv. sigma : {convFilterSigmaG}</label>
                            <Slider
                            min = {0.05}
                            max = {0.5}
                            step = {0.01}
                            value= {convFilterSigmaG}
                            onChange={handleOnChangeConvFilterSigmaSliderG}
                            className="slider-floor"
                            />

                            <label>Sensibility Red : {colorSensibilityG[0]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityG[0]}
                            onChange={handleOnChangeSensibilitySliderGR}
                            className="slider-floor" 
                            />
                            <label>Sensibility Green : {colorSensibilityG[1]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityG[1]}
                            onChange={handleOnChangeSensibilitySliderGG}
                            className="slider-floor" 
                            />
                            <label>Sensibility Blue : {colorSensibilityG[2]}</label>
                            <Slider
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityG[2]}
                            onChange={handleOnChangeSensibilitySliderGB}
                            className="slider-floor" 
                            />
                        </div>
                        <div className="settings-column">
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

                            <label>Conv. radius : {convFilterRadiusB}</label>
                            <Slider
                            min = {8}
                            max = {26}
                            step = {1}
                            value= {convFilterRadiusB}
                            onChange={handleOnChangeConvFilterRadiusSliderB}
                            className="slider-floor"
                            />
                            <label>Conv. mu : {convFilterMuB}</label>
                            <Slider
                            min = {0.1}
                            max = {0.9}
                            step = {0.01}
                            value= {convFilterMuB}
                            onChange={handleOnChangeConvFilterMuSliderB}
                            className="slider-floor"
                            />
                            <label>Conv. sigma : {convFilterSigmaB}</label>
                            <Slider
                            min = {0.05}
                            max = {0.5}
                            step = {0.01}
                            value= {convFilterSigmaB}
                            onChange={handleOnChangeConvFilterSigmaSliderB}
                            className="slider-floor"
                            />

                            <label>Sensibility Red : {colorSensibilityB[0]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityB[0]}
                            onChange={handleOnChangeSensibilitySliderBR}
                            className="slider-floor" 
                            />
                            <label>Sensibility Green : {colorSensibilityB[1]}</label>
                            <Slider 
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityB[1]}
                            onChange={handleOnChangeSensibilitySliderBG}
                            className="slider-floor" 
                            />
                            <label>Sensibility Blue : {colorSensibilityB[2]}</label>
                            <Slider
                            min = {0}
                            max = {24}
                            step = {0.1}
                            value= {colorSensibilityB[2]}
                            onChange={handleOnChangeSensibilitySliderBB}
                            className="slider-floor" 
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center">
                        <div className="settings-column mt-4">
                            <label>Brush size : {brushSize}</label>
                            <Slider 
                            min = {10}
                            max = {64}
                            step = {2}
                            value= {brushSize}
                            onChange={handleOnChangeBrushSizeSlider}
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