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
import PresetService from '../../../service/PresetService';
import LocalStorageService from '../../../service/LocalStorageService';

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
    //const cellService = CellService.getInstance();

    const [cellSize, setCellSize] = useState<number>(CellConfig.CELL_SIZE);

    const [convFilterRadiusR, setConvFilterRadiusR] = useState<number>(CellConfig.CELL_CONV_FILTER_RADIUS_RED);
    const [convFilterMuR, setConvFilterMuR] = useState<number>(CellConfig.CELL_CONV_FILTER_MU_RED);
    const [convFilterSigmaR, setConvFilterSigmaR] = useState<number>(CellConfig.CELL_CONV_FILTER_SIGMA_RED);

    const [convFilterRadiusG, setConvFilterRadiusG] = useState<number>(CellConfig.CELL_CONV_FILTER_RADIUS_GREEN);
    const [convFilterMuG, setConvFilterMuG] = useState<number>(CellConfig.CELL_CONV_FILTER_MU_GREEN);
    const [convFilterSigmaG, setConvFilterSigmaG] = useState<number>(CellConfig.CELL_CONV_FILTER_SIGMA_GREEN);

    const [convFilterRadiusB, setConvFilterRadiusB] = useState<number>(CellConfig.CELL_CONV_FILTER_RADIUS_BLUE);
    const [convFilterMuB, setConvFilterMuB] = useState<number>(CellConfig.CELL_CONV_FILTER_MU_BLUE);
    const [convFilterSigmaB, setConvFilterSigmaB] = useState<number>(CellConfig.CELL_CONV_FILTER_SIGMA_BLUE);

    const [cellGrowthMu, setCellGrowthMu] = useState<number>(CellConfig.CELL_GROWTH_MU);
    const [cellGrowthSigma, setCellGrowthSigma] = useState<number>(CellConfig.CELL_GROWTH_SIGMA);

    const [brushSize, setBrushSize] = useState<number>(CellConfig.CELL_BRUSH_SIZE);

    const [floorR, setFloorR] = useState<number>(CellConfig.CELL_FILTER_COUNT_FLOOR_RED);
    const [floorG, setFloorG] = useState<number>(CellConfig.CELL_FILTER_COUNT_FLOOR_GREEN);
    const [floorB, setFloorB] = useState<number>(CellConfig.CELL_FILTER_COUNT_FLOOR_BLUE);

    const [colorSensibilityR, setColorSensibilityR] = useState<[number, number, number]>(CellConfig.CELL_COLOR_SENSIBILITY_RED);
    const [colorSensibilityG, setColorSensibilityG] = useState<[number, number, number]>(CellConfig.CELL_COLOR_SENSIBILITY_GREEN);
    const [colorSensibilityB, setColorSensibilityB] = useState<[number, number, number]>(CellConfig.CELL_COLOR_SENSIBILITY_BLUE);

    const [cellEvolutionDeltaT, setCellEvolutionDeltaT] = useState<number>(CellConfig.CELL_EVOLUTION_DELTA_T);
    
    const [selectedPreset, setSelectedPreset] = useState<IPreset>(props.presets[0]);

    const [isNewPresetDivOpen, setIsNewPresetDivOpen] = useState<boolean>(false);

    const intervalRef = useRef<null | any>(null);

    const maxIRef = useRef<number>(Math.floor(width / CellConfig.CELL_SIZE));
    const maxJRef = useRef<number>(Math.floor(height / CellConfig.CELL_SIZE));

    //const cells: ICell[][] = [];
    const cellsRef = useRef<ICell[][]>([]);
    const loadCountRef = useRef<number>(0);

    const presetServiceRef = useRef<any>(null);
    const localStorageServiceRef = useRef<any>(null);
    const cellServiceRef = useRef<any>(CellService.getInstance());

    useEffect(() => {

      const fct = async () => {
        presetServiceRef.current = await PresetService.getInstance();
        localStorageServiceRef.current = await LocalStorageService.getInstance();
        cellServiceRef.current = await CellService.getInstance();
        //console.log('presetServiceRef.current :', presetServiceRef.current);
      }
      fct();
      initCells();
      randomizeCells();
      drawCells();
      if (loadCountRef.current < AppConfig.APP_LOAD_COUNT_MAX) {
          loadCountRef.current++;
      }        
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
      //cellServiceRef.current.setCellSize(cellSize);
      setIsNewPresetDivOpen(false);
      randomizeCells();
      drawCells();
    }, [cellSize]);

    const initCells = () => {
        cellsRef.current = cellServiceRef.current.initCells();

        cellServiceRef.current.initValues();
        cellServiceRef.current.initConvolFilters();
        setVirtTimeCounter(0);
        updateSliders();
    }

    const generateNext = () => {
        cellsRef.current = cellServiceRef.current.generateNextCells();
    }

    const randomizeCells = () => {
        //cellsRef.current = cellServiceRef.current.init();
        //cellServiceRef.current.initConvolFilters();
        cellsRef.current = cellServiceRef.current.getRandomizedCells();
        setVirtTimeCounter(0);
        //updateSliders();
    }

    const clearCells = () => {
        cellsRef.current = cellServiceRef.current.initCells();
        //cellServiceRef.current.initConvolFilters();
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
        //cellServiceRef.current.initValues();
        cellServiceRef.current.initConvolFilters();
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
        //cellServiceRef.current.initValues();
        cellServiceRef.current.initConvolFilters();
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
        presetServiceRef.current.saveNewUserPreset(newPreset);
        setIsNewPresetDivOpen(false);
        updateStorageCB();
      }
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

    const handleChangePresetCB = (preset: IPreset) => {
      if(preset !== undefined) setSelectedPreset(preset);
    }

    const exportUserPresetsCB = () => {
      presetServiceRef.current.exportUserPresets();
    }

    const deleteUserPresetCB = (preset: IPreset) => {
      presetServiceRef.current.deleteUserPreset(preset.id);
      props.reloadUserPresetsCB();
      updateStorageCB();
      ToastLibrary.displayDeletePresetToast(preset.name, props.displayToast);
    }

    const updateStorageCB = () => {
      const fct = async () => {
        await localStorageServiceRef.current.setUserPresets(presetServiceRef.current.getUserPresets());
      }
      fct();
    }

    const applyPresetCB = (preset: IPreset) => {
      setFloorR(preset.values.floorR);
      cellServiceRef.current.setCountingFloorR(preset.values.floorR);
      setFloorG(preset.values.floorG);
      cellServiceRef.current.setCountingFloorG(preset.values.floorG);
      setFloorB(preset.values.floorB);
      cellServiceRef.current.setCountingFloorB(preset.values.floorB);

      setConvFilterRadiusR(preset.values.convFilterRadiusR);
      cellServiceRef.current.setConvolRadiusR(preset.values.convFilterRadiusR);
      setConvFilterMuR(preset.values.convFilterMuR);
      cellServiceRef.current.setConvolMuR(preset.values.convFilterMuR);
      setConvFilterSigmaR(preset.values.convFilterSigmaR);
      cellServiceRef.current.setConvolSigmaR(preset.values.convFilterSigmaR);

      setConvFilterRadiusG(preset.values.convFilterRadiusG);
      cellServiceRef.current.setConvolRadiusG(preset.values.convFilterRadiusG);
      setConvFilterMuG(preset.values.convFilterMuG);
      cellServiceRef.current.setConvolMuG(preset.values.convFilterMuG);
      setConvFilterSigmaG(preset.values.convFilterSigmaG);
      cellServiceRef.current.setConvolSigmaG(preset.values.convFilterSigmaG);

      setConvFilterRadiusB(preset.values.convFilterRadiusB);
      cellServiceRef.current.setConvolRadiusB(preset.values.convFilterRadiusB);
      setConvFilterMuB(preset.values.convFilterMuB);
      cellServiceRef.current.setConvolMuB(preset.values.convFilterMuB);
      setConvFilterSigmaB(preset.values.convFilterSigmaB);
      cellServiceRef.current.setConvolSigmaB(preset.values.convFilterSigmaB);

      setColorSensibilityR(preset.values.colorSensibilityR);
      cellServiceRef.current.setColorSensibilityR(preset.values.colorSensibilityR);
      setColorSensibilityG(preset.values.colorSensibilityG);
      cellServiceRef.current.setColorSensibilityG(preset.values.colorSensibilityG);
      setColorSensibilityB(preset.values.colorSensibilityB);
      cellServiceRef.current.setColorSensibilityB(preset.values.colorSensibilityB);

      setCellEvolutionDeltaT(preset.values.cellEvolutionDeltaT);
      cellServiceRef.current.setCellEvolutionDeltaT(preset.values.cellEvolutionDeltaT);

      setCellGrowthMu(preset.values.cellGrowthMu);
      cellServiceRef.current.setCellGrowthMu(preset.values.cellGrowthMu);
      setCellGrowthSigma(preset.values.cellGrowthSigma);
      cellServiceRef.current.setCellGrowthSigma(preset.values.cellGrowthSigma);

      cellServiceRef.current.initConvolFilters();
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
                        
                        cellsRef.current = cellServiceRef.current.drawRandowCircle(mouseI, mouseJ);
                        drawCells();
                    }
                    else if (e.button === 2) {
                        //e.preventDefault();
                        //console.log('clic droit')
                        cellsRef.current = cellServiceRef.current.clearCircle(mouseI, mouseJ);
                        drawCells();
                    }
                    
                }
                
                //cellsRef.current = cellServiceRef.current.getCells();
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
    setCellSize(cellServiceRef.current.getCellSize());

    setConvFilterRadiusR(cellServiceRef.current.getConvolRadiusR());
    setConvFilterMuR(cellServiceRef.current.getConvolMuR());
    setConvFilterSigmaR(cellServiceRef.current.getConvolSigmaR());

    setConvFilterRadiusG(cellServiceRef.current.getConvolRadiusG());
    setConvFilterMuG(cellServiceRef.current.getConvolMuG());
    setConvFilterSigmaG(cellServiceRef.current.getConvolSigmaG());

    setConvFilterRadiusB(cellServiceRef.current.getConvolRadiusB());
    setConvFilterMuB(cellServiceRef.current.getConvolMuB());
    setConvFilterSigmaB(cellServiceRef.current.getConvolSigmaB());

    setCellGrowthMu(cellServiceRef.current.getCellGrowthMu());
    setCellGrowthSigma(cellServiceRef.current.getCellGrowthSigma());

    setBrushSize(cellServiceRef.current.getBrushSize());

    setFloorR(cellServiceRef.current.getCountingFloorR());
    setFloorG(cellServiceRef.current.getCountingFloorG());
    setFloorB(cellServiceRef.current.getCountingFloorB());

    setColorSensibilityR(cellServiceRef.current.getColorSensibilityR());
    setColorSensibilityG(cellServiceRef.current.getColorSensibilityG());
    setColorSensibilityB(cellServiceRef.current.getColorSensibilityB());

    setCellEvolutionDeltaT(cellServiceRef.current.getCellEvolutionDeltaT());
  };

  const handleOnChangeCellSizeSlider = (value: any) => {
    setCellSize(value);
    cellServiceRef.current.setCellSize(value);
    
    maxIRef.current = Math.floor(width / value);
    maxJRef.current = Math.floor(height / value);
    cellsRef.current = cellServiceRef.current.initCells();

    //drawCells();
    //cellsRef.current = cellServiceRef.current.getRandomizedCells();
    setVirtTimeCounter(0);

    //randomizeCells();
    //drawCells();
  }

  const handleOnChangeConvFilterRadiusSliderR = (value: any) => {
    setConvFilterRadiusR(value);
    cellServiceRef.current.setConvolRadiusR(value);
    cellServiceRef.current.initConvolFilterR();
  }

  const handleOnChangeConvFilterMuSliderR = (value: any) => {
    setConvFilterMuR(value);
    cellServiceRef.current.setConvolMuR(value);
    cellServiceRef.current.initConvolFilterR();
  }

  const handleOnChangeConvFilterSigmaSliderR = (value: any) => {
    setConvFilterSigmaR(value);
    cellServiceRef.current.setConvolSigmaR(value);
    cellServiceRef.current.initConvolFilterR();
  }

  const handleOnChangeConvFilterRadiusSliderG = (value: any) => {
    setConvFilterRadiusG(value);
    cellServiceRef.current.setConvolRadiusG(value);
    cellServiceRef.current.initConvolFilterG();
  }

  const handleOnChangeConvFilterMuSliderG = (value: any) => {
    setConvFilterMuG(value);
    cellServiceRef.current.setConvolMuG(value);
    cellServiceRef.current.initConvolFilterG();
  }

  const handleOnChangeConvFilterSigmaSliderG = (value: any) => {
    setConvFilterSigmaG(value);
    cellServiceRef.current.setConvolSigmaG(value);
    cellServiceRef.current.initConvolFilterG();
  }

  const handleOnChangeConvFilterRadiusSliderB = (value: any) => {
    setConvFilterRadiusB(value);
    cellServiceRef.current.setConvolRadiusB(value);
    cellServiceRef.current.initConvolFilterB();
  }

  const handleOnChangeConvFilterMuSliderB = (value: any) => {
    setConvFilterMuB(value);
    cellServiceRef.current.setConvolMuB(value);
    cellServiceRef.current.initConvolFilterB();
  }

  const handleOnChangeConvFilterSigmaSliderB = (value: any) => {
    setConvFilterSigmaB(value);
    cellServiceRef.current.setConvolSigmaB(value);
    cellServiceRef.current.initConvolFilterB();
  }

  const handleOnChangeCellGrowthMuSlider = (value: any) => {
    setCellGrowthMu(value);
    cellServiceRef.current.setCellGrowthMu(value);
  }

  const handleOnChangeCellGrowthSigmaSlider = (value: any) => {
    setCellGrowthSigma(value);
    cellServiceRef.current.setCellGrowthSigma(value);
  }

  const handleOnChangeBrushSizeSlider = (value: any) => {
    setBrushSize(value);
    cellServiceRef.current.setBrushSize(value);
  }
  const handleOnChangeFloorSliderR = (value: any) => {
    setFloorR(value);
    cellServiceRef.current.setCountingFloorR(value);
  };
  
  const handleOnChangeFloorSliderG = (value: any) => {
    setFloorG(value);
    cellServiceRef.current.setCountingFloorG(value);
  };
  
  const handleOnChangeFloorSliderB = (value: any) => {
    setFloorB(value);
    cellServiceRef.current.setCountingFloorB(value);
  };

  /*
  const handleOnChangeSensibilitySliderR = (value: any) => {
    setColorSensibilityR(value);
    cellServiceRef.current.setColorSensibilityR(value);
  }*/

  const handleOnChangeSensibilitySliderRR = (value: any) => {
    const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityR()[1], cellServiceRef.current.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRG = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityR()[0], value, cellServiceRef.current.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRB = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityR()[0], cellServiceRef.current.getColorSensibilityR()[1], value];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderGR = (value: any) => {
      const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityG()[1], cellServiceRef.current.getColorSensibilityG()[2]];
      setColorSensibilityG(tab);
      cellServiceRef.current.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGG = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityG()[0], value, cellServiceRef.current.getColorSensibilityG()[2]];
    setColorSensibilityG(tab);
    cellServiceRef.current.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGB = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityG()[0], cellServiceRef.current.getColorSensibilityG()[1], value];
    setColorSensibilityG(tab);
    cellServiceRef.current.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderBR = (value: any) => {
    const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityB()[1], cellServiceRef.current.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBG = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityB()[0], value, cellServiceRef.current.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBB = (value: any) => {
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityB()[0], cellServiceRef.current.getColorSensibilityB()[1], value];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeCellEvolutionDeltaTSlider = (value: any) => {
      setCellEvolutionDeltaT(value);
      cellServiceRef.current.setCellEvolutionDeltaT(value);
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
                  displayToast={props.displayToast}
                  updateStorageCB={updateStorageCB}
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
                            <p className="mt-2 mb-1"><strong>Sensibility</strong></p>
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

                            <p className="mt-2 mb-1"><strong>Sensibility</strong></p>
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

                            <p className="mt-2 mb-1"><strong>Sensibility</strong></p>
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
                        <div>
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
                          </div>
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