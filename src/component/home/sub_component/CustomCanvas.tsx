import { useEffect, useRef, useState } from "react";
import UseMousePosition from "../../../hook/UseMousePosition";
import CanvasConfig from "../../../config/CanvasConfig";
import ICell from "../../../interface/ICell";
import CellConfig from "../../../config/CellConfig";
import CellService from "../../../service/CellService";
import IToast from "../../../interface/IToast";
import { Accordion, Button } from "react-bootstrap";
import Slider from 'rc-slider';
import AppConfig from "../../../config/AppConfig";
import PresetSelector from "./PresetSelector";
import IPreset from "../../../interface/IPreset";
import ToastLibrary from "../../../library/ToastLibrary";
import IPresetValues from "../../../interface/IPresetValues";
//import 'rc-slider/assets/index.css';
import PresetService from '../../../service/PresetService';

interface ICustomCanvasProps {
  displayToast: (toast: IToast) => void,
  presets: IPreset[],
  userPresets: IPreset[],
  reloadUserPresetsCB: () => void
}
const CustomCanvas = (props: ICustomCanvasProps) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    //const [isMouseOver, setIsMouseOver] = useState(false);
    const [virtTimeCounter, setVirtTimeCounter] = useState(0);
    const [coords, handleCoords] = UseMousePosition(true);
    const width = CanvasConfig.CANVAS_WIDTH;
    const height = CanvasConfig.CANVAS_HEIGHT;
    const delay = AppConfig.APP_DELAY;
    const cellService = CellService.getInstance();

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
    
    const [selectedPreset, setSelectedPreset] = useState<IPreset>(props.presets[0]);

    const [isNewPresetDivOpen, setIsNewPresetDivOpen] = useState<boolean>(false);

    const intervalRef = useRef<null | any>(null);

    const maxIRef = useRef<number>(Math.floor(width / CellConfig.CELL_SIZE));
    const maxJRef = useRef<number>(Math.floor(height / CellConfig.CELL_SIZE));

    //const cells: ICell[][] = [];
    const cellsRef = useRef<ICell[][]>([]);
    const loadCountRef = useRef<number>(0);

    const presetServiceRef = useRef<any>(null);

    useEffect(() => {
        initCells();
        randomizeCells();
        drawCells();
        if (loadCountRef.current < AppConfig.APP_LOAD_COUNT_MAX) {
            loadCountRef.current++;
        }
        const fct = async () => {
          presetServiceRef.current = await PresetService.getInstance();
          //console.log('presetServiceRef.current :', presetServiceRef.current);
        }
        fct();
        //generateRandomImage();  
        
    }, []);

    useEffect(() => {
      setIsNewPresetDivOpen(false);
      if(selectedPreset !== undefined) applyPresetCB(selectedPreset);
    }, [selectedPreset]);

    useEffect(() => {
      if(props.presets.length > 0) {
        setSelectedPreset((prev) => {
        applyPresetCB(props.presets[0]);
        return props.presets[0]
      });
      }
    }, [props.presets]);

    useEffect(() => {    
        const fct = () => {
          setIsNewPresetDivOpen(false);
            //initCells();
            //generateRandomImage();
            //randomizeCells();
          generateNext();
          drawCells();
          setVirtTimeCounter((prev: number) => prev + cellEvolutionDeltaT);
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
      const savePresetBtn = document.getElementById("save-preset-button");
      if (savePresetBtn) savePresetBtn.innerText = !isNewPresetDivOpen ? "SAVE" : "CLOSE";
    }, [isNewPresetDivOpen]);

    useEffect(() => {
        //console.log('firsloadRef.current :', firsloadRef.current);
        //console.log('load count :', AppConfig.APP_LOAD_COUNT_MAX);
        setIsNewPresetDivOpen(false);
        if(loadCountRef.current > AppConfig.APP_LOAD_COUNT_MAX) isRunning ? ToastLibrary.displayRunToast(props.displayToast) : ToastLibrary.displayStopToast(props.displayToast);
        else loadCountRef.current++;
    }, [isRunning]);

    useEffect(() => {
      setIsNewPresetDivOpen(false);
      randomizeCells();
      drawCells();
    }, [cellSize]);

    const initCells = () => {
        cellsRef.current = cellService.initCells();

        cellService.initValues();
        cellService.initConvolFilters();
        setVirtTimeCounter(0);
        updateSliders();
    }

    const generateNext = () => {
        cellsRef.current = cellService.generateNextCells();
    }

    const randomizeCells = () => {
        //cellsRef.current = cellService.init();
        //cellService.initConvolFilters();
        cellsRef.current = cellService.getRandomizedCells();
        setVirtTimeCounter(0);
        //updateSliders();
    }

    const clearCells = () => {
        cellsRef.current = cellService.initCells();
        //cellService.initConvolFilters();
        setVirtTimeCounter(0);
        //updateSliders();
    }

    const handleDefaultValues = () => {
      const preset: IPreset = {
        id: props.presets[0].id,
        name: props.presets[0].name,
        description: props.presets[0].description,
        pseudo: props.presets[0].pseudo,
        date: props.presets[0].date,
        values: props.presets[0].values

      }
        setSelectedPreset(preset);
        //cellService.initValues();
        cellService.initConvolFilters();
        updateSliders();
    }

    const handleResetValues = () => {
      const preset: IPreset = {
        id: selectedPreset.id,
        name: selectedPreset.name,
        description: selectedPreset.description,
        pseudo: selectedPreset.pseudo,
        date: selectedPreset.date,
        values: selectedPreset.values
      }
        setSelectedPreset(preset);
        //cellService.initValues();
        cellService.initConvolFilters();
        updateSliders();
    }

    const handleSaveValues = () => {
      //const savePresetBtn = document.getElementById("save-preset-button");
      //if (savePresetBtn) savePresetBtn.innerText = isNewPresetDivOpen ? "SAVE" : "CLOSE";
      setIsNewPresetDivOpen(!isNewPresetDivOpen);
    }

    const handleSaveNewPresetValues = () => {
      const fieldName = document.getElementById("new-preset-name") as HTMLInputElement | null;
      const fieldDescription = document.getElementById("new-preset-description") as HTMLInputElement | null;
      const fieldPseudo = document.getElementById("new-preset-pseudo") as HTMLInputElement | null;
      const name = fieldName?.value;
      const description = fieldDescription?.value;
      const pseudo = fieldPseudo?.value;
      if(name !== undefined && description !== undefined && pseudo !== undefined) {
        ToastLibrary.displaySavePresetToast(name, props.displayToast);
        const newValues: IPresetValues = {
          floorR: floorR,
          floorG: floorG,
          floorB: floorB,
          convFilterRadiusR: convFilterRadiusR,
          convFilterMuR: convFilterMuR,
          convFilterSigmaR: convFilterSigmaR,
          convFilterRadiusG: convFilterRadiusG,
          convFilterMuG: convFilterMuG,
          convFilterSigmaG: convFilterSigmaG,
          convFilterRadiusB: convFilterRadiusB,
          convFilterMuB: convFilterMuB,
          convFilterSigmaB: convFilterSigmaB,
          colorSensibilityR: colorSensibilityR,
          colorSensibilityG: colorSensibilityG,
          colorSensibilityB: colorSensibilityB,
          cellEvolutionDeltaT: cellEvolutionDeltaT,
          cellGrowthMu: cellGrowthMu,
          cellGrowthSigma: cellGrowthSigma
        };
        const id = props.userPresets.length > 0 ? Math.max(...props.userPresets.map(preset => preset.id)) + 1: 0;
        const date = new Date().toISOString();
        const newPreset: IPreset = {
          id: id,
          name: name,
          description: description,
          pseudo: pseudo,
          date: date,
          values: newValues
        };
        //console.log('newPreset :', newPreset);
        presetServiceRef.current.saveNewUserPreset(newPreset);
        setIsNewPresetDivOpen(false);
        // TODO vider les inputs **********************************************************************************
        // TODO changer nom bouton "save" par "close" **********************************************************************************
        //const savePresetBtn = document.getElementById("save-preset-button");
        //if (savePresetBtn) savePresetBtn.innerText = isNewPresetDivOpen ? "SAVE" : "CLOSE";
      }
      //console.log('name :', fieldName?.value, 'description :', fieldDescription?.value, 'pseudo :', fieldPseudo?.value);
    }

    const handleOnChangeNewPresetName = (e: any) => {
      updateSavePresetBtn();
    }

    const handleOnChangeNewPresetDescription = (e: any) => {
      updateSavePresetBtn();
    }

    const handleOnChangeNewPresetPseudo = (e: any) => {
      updateSavePresetBtn();
    }

    const updateSavePresetBtn = () => {
      const savePresetBtn = document.getElementById("save-preset-form-button") as HTMLButtonElement | null;
      if (savePresetBtn) {
        const isFormValid = isNewPresetDivFieldsNotEmpty();
        savePresetBtn.disabled = !isFormValid;
      }
    };
    

    const isNewPresetDivFieldsNotEmpty = (): boolean => {
      let toReturn: boolean = false;
      const fieldName = document.getElementById("new-preset-name") as HTMLInputElement | null;
      const fieldDescription = document.getElementById("new-preset-description") as HTMLInputElement | null;
      const fieldPseudo = document.getElementById("new-preset-pseudo") as HTMLInputElement | null;
      if(fieldName && fieldDescription && fieldPseudo) {
        toReturn = fieldName.value !== "" && fieldDescription.value !== "" && fieldPseudo.value !== "";
      }
      return toReturn;
    }

    const drawCells = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if(ctx){
            for(let i = 0; i < maxIRef.current; i++){ 
                for(let j = 0; j < maxJRef.current; j++){
                    const cell = cellsRef.current[i][j];
                    const x = i * cellSize;
                    const y = j * cellSize;
                    const red = Math.floor(cell.stateR * 255);
                    const green = Math.floor(cell.stateG * 255);
                    const blue = Math.floor(cell.stateB * 255);
                    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                    ctx.fillRect(x, y, cellSize, cellSize);
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

    const handleChangePresetCB = (preset: IPreset) => {
      if(preset !== undefined) setSelectedPreset(preset);
    }

    const exportUserPresetsCB = () => {
      presetServiceRef.current.exportUserPresets();
    }

    const deleteUserPresetCB = (preset: IPreset) => {
      presetServiceRef.current.deleteUserPreset(preset.id);
      props.reloadUserPresetsCB();
    }

    const applyPresetCB = (preset: IPreset) => {
      setFloorR(preset.values.floorR);
      cellService.setCountingFloorR(preset.values.floorR);
      setFloorG(preset.values.floorG);
      cellService.setCountingFloorG(preset.values.floorG);
      setFloorB(preset.values.floorB);
      cellService.setCountingFloorB(preset.values.floorB);

      setConvFilterRadiusR(preset.values.convFilterRadiusR);
      cellService.setConvolRadiusR(preset.values.convFilterRadiusR);
      setConvFilterMuR(preset.values.convFilterMuR);
      cellService.setConvolMuR(preset.values.convFilterMuR);
      setConvFilterSigmaR(preset.values.convFilterSigmaR);
      cellService.setConvolSigmaR(preset.values.convFilterSigmaR);

      setConvFilterRadiusG(preset.values.convFilterRadiusG);
      cellService.setConvolRadiusG(preset.values.convFilterRadiusG);
      setConvFilterMuG(preset.values.convFilterMuG);
      cellService.setConvolMuG(preset.values.convFilterMuG);
      setConvFilterSigmaG(preset.values.convFilterSigmaG);
      cellService.setConvolSigmaG(preset.values.convFilterSigmaG);

      setConvFilterRadiusB(preset.values.convFilterRadiusB);
      cellService.setConvolRadiusB(preset.values.convFilterRadiusB);
      setConvFilterMuB(preset.values.convFilterMuB);
      cellService.setConvolMuB(preset.values.convFilterMuB);
      setConvFilterSigmaB(preset.values.convFilterSigmaB);
      cellService.setConvolSigmaB(preset.values.convFilterSigmaB);

      setColorSensibilityR(preset.values.colorSensibilityR);
      cellService.setColorSensibilityR(preset.values.colorSensibilityR);
      setColorSensibilityG(preset.values.colorSensibilityG);
      cellService.setColorSensibilityG(preset.values.colorSensibilityG);
      setColorSensibilityB(preset.values.colorSensibilityB);
      cellService.setColorSensibilityB(preset.values.colorSensibilityB);

      setCellEvolutionDeltaT(preset.values.cellEvolutionDeltaT);
      cellService.setCellEvolutionDeltaT(preset.values.cellEvolutionDeltaT);

      setCellGrowthMu(preset.values.cellGrowthMu);
      cellService.setCellGrowthMu(preset.values.cellGrowthMu);
      setCellGrowthSigma(preset.values.cellGrowthSigma);
      cellService.setCellGrowthSigma(preset.values.cellGrowthSigma);

      cellService.initConvolFilters();
      //updateSliders();
      setVirtTimeCounter(0);
      randomizeCells();
      drawCells();
      ToastLibrary.displayApplyPresetToast(preset.name, props.displayToast);
    }

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

    /*
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
*/
/*
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
*/
/*
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
*/
/*
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
*/
/*
    const displayApplyPresetToast = (name: string) => {
        const toastToDisplay: IToast = {
            title: "APPLY PRESET",
            subtitle: "Apply Preset",
            message: "The preset '" + name + "' is applied",
            mode: "success",
            delay: 1500
        };
        props.displayToast(toastToDisplay);
    }
*/
    const handleMouseDown = (e: any) => {
            handleCoords((e as unknown) as MouseEvent);
            if (canvasRef.current) {
                // récupérer les coordonnées du clic
                const mouseX = coords.x;
                const mouseY = coords.y;
                //console.log("MouseX : ", mouseX, " MouseY : ", mouseY);
                const mouseI = Math.floor(mouseX / cellSize);
                const mouseJ = Math.floor(mouseY / cellSize);
                //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
                const radius = Math.floor(brushSize/2);
                if(mouseI >= 0 && mouseI <= maxIRef.current && mouseJ >= 0 && mouseJ <= maxJRef.current){
                    //console.log('e.button :', e.button);
                    if (e.button === 0) {
                        const ctx = canvasRef.current.getContext("2d");
                        ctx?.ellipse(mouseX, mouseY, radius * cellSize, radius * cellSize, 0, 0, 2 * Math.PI);
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
            const mouseI = Math.floor(mouseX / cellSize);
            const mouseJ = Math.floor(mouseY / cellSize);
            //console.log("MouseI : ", mouseI, " MouseJ : ", mouseJ);
            const radius = Math.floor(brushSize/2);
            if(mouseI >= radius && mouseI <= maxIRef.current - radius && mouseJ >= radius && mouseJ <= maxJRef.current - radius){
                    //const ctx = canvasRef.current.getContext("2d");
                    if(ctx){
                        ctx.ellipse(mouseX, mouseY, radius * cellSize, radius * cellSize, 0, 0, 2 * Math.PI); // Dessinez l'ellipse

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
    setCellSize(cellService.getCellSize());

    setConvFilterRadiusR(cellService.getConvolRadiusR());
    setConvFilterMuR(cellService.getConvolMuR());
    setConvFilterSigmaR(cellService.getConvolSigmaR());

    setConvFilterRadiusG(cellService.getConvolRadiusG());
    setConvFilterMuG(cellService.getConvolMuG());
    setConvFilterSigmaG(cellService.getConvolSigmaG());

    setConvFilterRadiusB(cellService.getConvolRadiusB());
    setConvFilterMuB(cellService.getConvolMuB());
    setConvFilterSigmaB(cellService.getConvolSigmaB());

    setCellGrowthMu(cellService.getCellGrowthMu());
    setCellGrowthSigma(cellService.getCellGrowthSigma());

    setBrushSize(cellService.getBrushSize());

    setFloorR(cellService.getCountingFloorR());
    setFloorG(cellService.getCountingFloorG());
    setFloorB(cellService.getCountingFloorB());

    setColorSensibilityR(cellService.getColorSensibilityR());
    setColorSensibilityG(cellService.getColorSensibilityG());
    setColorSensibilityB(cellService.getColorSensibilityB());

    setCellEvolutionDeltaT(cellService.getCellEvolutionDeltaT());
  };

  const handleOnChangeCellSizeSlider = (value: any) => {
    setCellSize(value);
    cellService.setCellSize(value);
    
    maxIRef.current = Math.floor(width / value);
    maxJRef.current = Math.floor(height / value);
    cellsRef.current = cellService.initCells();

    //drawCells();
    //cellsRef.current = cellService.getRandomizedCells();
    setVirtTimeCounter(0);

    //randomizeCells();
    //drawCells();
  }

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

  const handleOnChangeCellGrowthMuSlider = (value: any) => {
    setCellGrowthMu(value);
    cellService.setCellGrowthMu(value);
  }

  const handleOnChangeCellGrowthSigmaSlider = (value: any) => {
    setCellGrowthSigma(value);
    cellService.setCellGrowthSigma(value);
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

  const handleOnChangeCellEvolutionDeltaTSlider = (value: any) => {
      setCellEvolutionDeltaT(value);
      cellService.setCellEvolutionDeltaT(value);
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
            <h4>Preset : {selectedPreset?.name}</h4>
            <div className="d-flex gap-3 justify-content-center mb-2">
                <Button
                className="btn-1"
                onClick={() => {
                    ToastLibrary.displayRandomizeToast(props.displayToast);
                    randomizeCells();
                    drawCells();
                }}
                >
                    RANDOM
                </Button>
                <Button
                className="btn-1"
                onClick={() => {
                    ToastLibrary.displayResetToast(props.displayToast);
                    clearCells();
                    drawCells();
                }}
                >
                    CLEAR
                </Button>
                <Button
                className="btn-1" 
                id="button-run"
                onClick={() => toggleIsRunning()}
                >
                    RUN
                </Button>  
            </div>
            <Accordion 
            defaultActiveKey={null}
            className="accordion-container mb-5"
            >
              <Accordion.Item eventKey="0" >
                <Accordion.Header>Presets</Accordion.Header>
                <Accordion.Body className="d-flex flex-column gap-3 align-items-center w-100 min-w-100">
                  <PresetSelector 
                  applyPresetCB={handleChangePresetCB}
                  presets={props.presets} 
                  userPresets={props.userPresets}
                  exportUserPresetsCB={exportUserPresetsCB}
                  reloadUserPresetsCB={props.reloadUserPresetsCB}
                  deleteUserPresetCB={deleteUserPresetCB}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" >
                  <Accordion.Header>Settings</Accordion.Header>
                  <Accordion.Body className="d-flex flex-column gap-3 align-items-center w-100 min-w-100">
                  <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center w-100">
                      <div className="settings-column">
                          <p><strong>Red</strong></p>
                          <label>Counting floor : {floorR}</label>
                          <Slider 
                          min = {CellConfig.CELL_FILTER_COUNT_FLOOR_MIN}
                          max = {CellConfig.CELL_FILTER_COUNT_FLOOR_MAX}
                          step = {CellConfig.CELL_FILTER_COUNT_FLOOR_STEP}
                          value= {floorR}
                          onChange={handleOnChangeFloorSliderR}
                          className="slider-floor" 
                          />
                          <p className="mt-2 mb-1"><strong>Convolution filter</strong></p>
                          <label>Radius : {convFilterRadiusR}</label>
                          <Slider 
                          min = {CellConfig.CELL_CONV_FILTER_RADIUS_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_RADIUS_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_RADIUS_STEP}
                          value= {convFilterRadiusR}
                          onChange={handleOnChangeConvFilterRadiusSliderR}
                          className="slider-floor" 
                          />
                          <label>Mu : {convFilterMuR}</label>
                          <Slider 
                          min = {CellConfig.CELL_CONV_FILTER_MU_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_MU_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_MU_STEP}
                          value= {convFilterMuR}
                          onChange={handleOnChangeConvFilterMuSliderR}
                          className="slider-floor" 
                          />
                          <label>Sigma : {convFilterSigmaR}</label>
                          <Slider 
                          min = {CellConfig.CELL_CONV_FILTER_SIGMA_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_SIGMA_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_SIGMA_STEP}
                          value= {convFilterSigmaR}
                          onChange={handleOnChangeConvFilterSigmaSliderR}
                          className="slider-floor" 
                          />
                          <p className="mt-2 mb-1"><strong>Sensibility floor</strong></p>
                          <label>Red : {colorSensibilityR[0]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityR[0]}
                          onChange={handleOnChangeSensibilitySliderRR}
                          className="slider-floor" 
                          />
                          <label>Green : {colorSensibilityR[1]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityR[1]}
                          onChange={handleOnChangeSensibilitySliderRG}
                          className="slider-floor" 
                          />
                          <label>Blue : {colorSensibilityR[2]}</label>
                          <Slider
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityR[2]}
                          onChange={handleOnChangeSensibilitySliderRB}
                          className="slider-floor" 
                          />
                      </div>
                      <div className="settings-column">
                          <p><strong>Green</strong></p>
                          <label>Counting floor : {floorG}</label>
                          <Slider 
                          min = {CellConfig.CELL_FILTER_COUNT_FLOOR_MIN}
                          max = {CellConfig.CELL_FILTER_COUNT_FLOOR_MAX}
                          step = {CellConfig.CELL_FILTER_COUNT_FLOOR_STEP}
                          value= {floorG}
                          onChange={handleOnChangeFloorSliderG}
                          className="slider-floor"
                          />

                          <p className="mt-2 mb-1"><strong>Convolution filter</strong></p>
                          <label>Radius : {convFilterRadiusG}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_RADIUS_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_RADIUS_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_RADIUS_STEP}
                          value= {convFilterRadiusG}
                          onChange={handleOnChangeConvFilterRadiusSliderG}
                          className="slider-floor"
                          />
                          <label>Mu : {convFilterMuG}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_MU_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_MU_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_MU_STEP}
                          value= {convFilterMuG}
                          onChange={handleOnChangeConvFilterMuSliderG}
                          className="slider-floor"
                          />
                          <label>Sigma : {convFilterSigmaG}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_SIGMA_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_SIGMA_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_SIGMA_STEP}
                          value= {convFilterSigmaG}
                          onChange={handleOnChangeConvFilterSigmaSliderG}
                          className="slider-floor"
                          />

                          <p className="mt-2 mb-1"><strong>Sensibility floor</strong></p>
                          <label>Red : {colorSensibilityG[0]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityG[0]}
                          onChange={handleOnChangeSensibilitySliderGR}
                          className="slider-floor" 
                          />
                          <label>Green : {colorSensibilityG[1]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityG[1]}
                          onChange={handleOnChangeSensibilitySliderGG}
                          className="slider-floor" 
                          />
                          <label>Blue : {colorSensibilityG[2]}</label>
                          <Slider
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityG[2]}
                          onChange={handleOnChangeSensibilitySliderGB}
                          className="slider-floor" 
                          />
                      </div>
                      <div className="settings-column">
                          <p><strong>Blue</strong></p>
                          <label>Counting floor : {floorB}</label>
                          <Slider 
                          min = {CellConfig.CELL_FILTER_COUNT_FLOOR_MIN}
                          max = {CellConfig.CELL_FILTER_COUNT_FLOOR_MAX}
                          step = {CellConfig.CELL_FILTER_COUNT_FLOOR_STEP}
                          value= {floorB}
                          onChange={handleOnChangeFloorSliderB}
                          className="slider-floor"
                          />

                          <p className="mt-2 mb-1"><strong>Convolution filter</strong></p>
                          <label>Radius : {convFilterRadiusB}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_RADIUS_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_RADIUS_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_RADIUS_STEP}
                          value= {convFilterRadiusB}
                          onChange={handleOnChangeConvFilterRadiusSliderB}
                          className="slider-floor"
                          />
                          <label>Mu : {convFilterMuB}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_MU_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_MU_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_MU_STEP}
                          value= {convFilterMuB}
                          onChange={handleOnChangeConvFilterMuSliderB}
                          className="slider-floor"
                          />
                          <label>Sigma : {convFilterSigmaB}</label>
                          <Slider
                          min = {CellConfig.CELL_CONV_FILTER_SIGMA_MIN}
                          max = {CellConfig.CELL_CONV_FILTER_SIGMA_MAX}
                          step = {CellConfig.CELL_CONV_FILTER_SIGMA_STEP}
                          value= {convFilterSigmaB}
                          onChange={handleOnChangeConvFilterSigmaSliderB}
                          className="slider-floor"
                          />

                          <p className="mt-2 mb-1"><strong>Sensibility floor</strong></p>
                          <label>Red : {colorSensibilityB[0]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityB[0]}
                          onChange={handleOnChangeSensibilitySliderBR}
                          className="slider-floor" 
                          />
                          <label>Green : {colorSensibilityB[1]}</label>
                          <Slider 
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityB[1]}
                          onChange={handleOnChangeSensibilitySliderBG}
                          className="slider-floor" 
                          />
                          <label>Blue : {colorSensibilityB[2]}</label>
                          <Slider
                          min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                          max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                          step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                          value= {colorSensibilityB[2]}
                          onChange={handleOnChangeSensibilitySliderBB}
                          className="slider-floor" 
                          />
                      </div>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center w-100">
                      <div className="settings-row mt-2">
                        <div className="settings-column">
                              <label>Delta t : {cellEvolutionDeltaT}</label>
                              <Slider
                              min = {CellConfig.CELL_EVOLUTION_DELTA_T_MIN}
                              max = {CellConfig.CELL_EVOLUTION_DELTA_T_MAX}
                              step = {CellConfig.CELL_EVOLUTION_DELTA_T_STEP}
                              value= {cellEvolutionDeltaT}
                              onChange={handleOnChangeCellEvolutionDeltaTSlider}
                              className="slider-floor"
                              />
                          </div>
                          <div className="settings-column">
                              <label>Growth function mu : {cellGrowthMu}</label>
                              <Slider 
                              min = {CellConfig.CELL_GROWTH_MU_MIN}
                              max = {CellConfig.CELL_GROWTH_MU_MAX}
                              step = {CellConfig.CELL_GROWTH_MU_STEP}
                              value= {cellGrowthMu}
                              onChange={handleOnChangeCellGrowthMuSlider}
                              className="slider-floor"
                              />
                          </div>
                          <div className="settings-column">
                              <label>Growth function sigma : {cellGrowthSigma}</label>
                              <Slider
                              min = {CellConfig.CELL_GROWTH_SIGMA_MIN}
                              max = {CellConfig.CELL_GROWTH_SIGMA_MAX}
                              step = {CellConfig.CELL_GROWTH_SIGMA_STEP}
                              value= {cellGrowthSigma}
                              onChange={handleOnChangeCellGrowthSigmaSlider}
                              className="slider-floor"
                              />
                          </div>
                      </div>
                      <div className="settings-row mt-2">
                          <div className="settings-column">
                              <label>Brush size : {brushSize} (cell)</label>
                              <Slider 
                              min = {CellConfig.CELL_BRUSH_SIZE_MIN}
                              max = {CellConfig.CELL_BRUSH_SIZE_MAX}
                              step = {CellConfig.CELL_BRUSH_SIZE_STEP}
                              value= {brushSize}
                              onChange={handleOnChangeBrushSizeSlider}
                              className="slider-floor"
                              />
                          </div>
                          <div className="settings-column">
                              <label>Cell size : {cellSize} (pix)</label>
                              <Slider
                              min = {CellConfig.CELL_SIZE_MIN}
                              max = {CellConfig.CELL_SIZE_MAX}
                              step = {CellConfig.CELL_SIZE_STEP}
                              value= {cellSize}
                              onChange={handleOnChangeCellSizeSlider}
                              className="slider-floor"
                              />
                          </div>

                      </div>


                  </div>
                  <div className="d-flex gap-3 justify-content-center mb-2">
                    <Button
                    className="btn-1"
                    onClick={() => {
                        handleDefaultValues();
                    }}
                    >
                        DEFAULT
                    </Button>
                    <Button
                    className="btn-1"
                    onClick={() => {
                        handleResetValues();
                    }}
                    >
                        RESET
                    </Button>
                    <Button
                    className="btn-1"
                    id="save-preset-button"
                    onClick={() => {
                        handleSaveValues();
                    }}
                    >
                        SAVE
                    </Button>

                  </div>
                    {isNewPresetDivOpen ? (
                      <>
                       <h5>New preset</h5>
                        <div className="d-flex gap-3 justify-content-center flex-wrap mb-2">
                         
                          <div>
                            <label htmlFor="new-preset-name">Name :</label>
                            <input 
                            type="text" 
                            id="new-preset-name" 
                            className="form-control" 
                            placeholder="Preset name" 
                            onChange={handleOnChangeNewPresetName}
                            />
                          </div>
                          <div>
                            <label htmlFor="new-preset-description">Description :</label>
                            <input 
                            type="text" 
                            id="new-preset-description" 
                            className="form-control" 
                            placeholder="Preset description" 
                            onChange={handleOnChangeNewPresetDescription}
                            />
                          </div>
                          <div>
                            <label htmlFor="new-preset-pseudo">User pseudo :</label>
                            <input 
                            type="text" 
                            id="new-preset-pseudo" 
                            className="form-control" 
                            placeholder="Preset user pseudo" 
                            onChange = {handleOnChangeNewPresetPseudo}
                            />
                          </div>

                        </div>
                        <Button
                        className="btn-1"
                        id="save-preset-form-button"
                        disabled={!isNewPresetDivFieldsNotEmpty()}
                        onClick={() => {
                            handleSaveNewPresetValues();
                            //console.log('click save');

                        }}
                        >
                            SAVE
                        </Button>
                        </>
                    ) : null
                    }
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