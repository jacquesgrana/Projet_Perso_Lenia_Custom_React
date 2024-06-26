import { useEffect, useRef, useState } from "react";
import UseMousePosition from "../../../hook/UseMousePosition";
import CanvasConfig from "../../../config/CanvasConfig";
import ICell from "../../../interface/ICell";
import CellConfig from "../../../config/CellConfig";
import CellService from "../../../service/CellService";
import IToast from "../../../interface/IToast";
import { Accordion, Button } from "react-bootstrap";
import AppConfig from "../../../config/AppConfig";
import PresetSelector from "./PresetSelector";
import IPreset from "../../../interface/IPreset";
import ToastLibrary from "../../../library/ToastLibrary";
import IPresetValues from "../../../interface/IPresetValues";
import PresetService from '../../../service/PresetService';
import LocalStorageService from '../../../service/LocalStorageService';
import BrushSettings from "./BrushSettings";
import Settings from "./Settings";
import ColorLibrary from "../../../library/ColorLibrary";

interface ICustomCanvasProps {
  displayToast: (toast: IToast) => void,
  presets: IPreset[],
  userPresets: IPreset[],
  reloadUserPresetsCB: () => void
}
const CustomCanvas = (props: ICustomCanvasProps) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [virtTimeCounter, setVirtTimeCounter] = useState(0);
    const [coords, handleCoords] = UseMousePosition(true);
    const width = CanvasConfig.CANVAS_WIDTH;
    const height = CanvasConfig.CANVAS_HEIGHT;
    const delay = AppConfig.APP_DELAY;

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
    const [brushHardness, setBrushHardness] = useState<number>(CellConfig.CELL_BRUSH_HARDNESS);
    const [brushIsRandom, setBrushIsRandom] = useState<boolean>(CellConfig.CELL_BRUSH_IS_RANDOM);

    const [brushColor, setBrushColor] = useState<string>(CellConfig.CELL_BRUSH_COLOR);
    const [bgColor, setBgColor] = useState<string>(CellConfig.CELL_BACKGROUND_COLOR);

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

    const mousePositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});

    /**
     * Initialisation : init des services, du tableau des cellules et remplissage des cellules + dessin
     */
    useEffect(() => {
      const fct = async () => {
        presetServiceRef.current = await PresetService.getInstance();
        localStorageServiceRef.current = await LocalStorageService.getInstance();
        cellServiceRef.current = await CellService.getInstance();
        //console.log('presetServiceRef.current :', presetServiceRef.current);
      }
      fct();
      initCells();
      handleFillCells();
      drawCells();
      if (loadCountRef.current < AppConfig.APP_LOAD_COUNT_MAX) {
          loadCountRef.current++;
      }  
      
    }, []);

    /**
     * Appliquer le preset sélectionné
     */
    useEffect(() => {
      setIsNewPresetDivOpen(false);
      if(selectedPreset !== undefined) applyPresetCB(selectedPreset);
    }, [selectedPreset]);

    /**
     * Appliquer le premier preset de la liste props.presets
     */
    useEffect(() => {
      if(props.presets.length > 0) {
        setSelectedPreset((prev) => {
        applyPresetCB(props.presets[0]);
        return props.presets[0]
      });
      }
    }, [props.presets]);

    /**
     * Evolution des cellules : définition de la fonction d'évolution qui est appelée quand isRunning === true
     */
    useEffect(() => {    
        const fct = () => {
          setIsNewPresetDivOpen(false);
          generateNext();
          drawCells();
          if(isMouseOver) drawBrushUsingRef();
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
        
    }, [isRunning, delay, cellEvolutionDeltaT, isMouseOver]); //isMouseOver

    /**
     * Gestion du bouton SAVE
     */
    useEffect(() => {
      const savePresetBtn = document.getElementById("save-preset-button");
      if (savePresetBtn) savePresetBtn.innerText = !isNewPresetDivOpen ? "SAVE" : "CLOSE";
    }, [isNewPresetDivOpen]);

    /**
     * pour fermer la div du formulaire de sauvegarde (à intégrer dans un useEffect précédent ?)
     */
    useEffect(() => {
        setIsNewPresetDivOpen(false);
        if(loadCountRef.current > AppConfig.APP_LOAD_COUNT_MAX) isRunning ? ToastLibrary.displayRunToast(props.displayToast) : ToastLibrary.displayStopToast(props.displayToast);
        else loadCountRef.current++;
    }, [isRunning]);

    /**
     * Gère la modification de la taille des cellules en pixel
     */
    useEffect(() => {
      setIsNewPresetDivOpen(false);
      handleFillCells();
      drawCells();
    }, [cellSize]);

    /**
     * Initialisation des cellules
     */
    const initCells = () => {
        cellsRef.current = cellServiceRef.current.initCells();

        cellServiceRef.current.initValues();
        cellServiceRef.current.initConvolFilters();
        setVirtTimeCounter(0);
        updateSliders();
    }

    /**
     * Wrapper qui appelle la fonction de generation des cellules
     */
    const generateNext = () => {
        cellsRef.current = cellServiceRef.current.generateNextCells();
    }

    /**
     * Remplissage des cellules à partir de la couleur de fond
     */
    const handleFillCells = () => {
        cellsRef.current = cellServiceRef.current.getColoredCells();
        setVirtTimeCounter(0);
    }

    /**
     * Effacement des cellules
     */
    const handleClearCells = () => {
        cellsRef.current = cellServiceRef.current.initCells();
        setVirtTimeCounter(0);
    }

    /**
     * Initialisation des valeurs par défaut : utilisation du premier preset
     */
    const handleDefaultValues = () => {
      const preset: IPreset = {
        id: props.presets[0].id,
        name: props.presets[0].name,
        description: props.presets[0].description,
        pseudo: props.presets[0].pseudo,
        date: props.presets[0].date,
        imageSrc: props.presets[0].imageSrc,
        values: props.presets[0].values
      }
      setSelectedPreset(preset);
      cellServiceRef.current.initConvolFilters();
      updateSliders();
    }

    /**
     * Initialisation des valeurs par défaut : utilisation du preset sélectionné
     */
    const handleResetValues = () => {
      const preset: IPreset = {
        id: selectedPreset.id,
        name: selectedPreset.name,
        description: selectedPreset.description,
        pseudo: selectedPreset.pseudo,
        date: selectedPreset.date,
        imageSrc: selectedPreset.imageSrc,
        values: selectedPreset.values
      }
        setSelectedPreset(preset); // ????
        cellServiceRef.current.initConvolFilters();
        updateSliders();
    }

    /**
     * Ouvre / Ferme la div du formulaire de sauvegarde d'un nouveau preset
     */
    const handleSaveValues = () => {
      setIsNewPresetDivOpen(!isNewPresetDivOpen);
    }

    /**
     * Sauvegarde du nouveau preset dans la liste des presets de l'utilisateur
     */
    const handleSaveNewPresetValues = () => {
      const fieldName = document.getElementById("new-preset-name") as HTMLInputElement | null;
      const fieldDescription = document.getElementById("new-preset-description") as HTMLInputElement | null;
      const fieldPseudo = document.getElementById("new-preset-pseudo") as HTMLInputElement | null;
      const name = fieldName?.value;
      const description = fieldDescription?.value;
      const pseudo = fieldPseudo?.value;
      if(name !== undefined && description !== undefined && pseudo !== undefined) {
        ToastLibrary.displaySavePresetToast(name, props.displayToast);
        const imageData: ImageData = cellServiceRef.current.getImageData(2);
        const squareImageData: ImageData = cellServiceRef.current.getSquareImageData(imageData);
        const src: string = cellServiceRef.current.getImageSrcFromImageData(squareImageData);
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
          imageSrc: src,
          values: newValues
        };
        presetServiceRef.current.saveNewUserPreset(newPreset);
        setIsNewPresetDivOpen(false);
        updateStorageCB();
      }
    }

    /**
     * Gestion du changement du nom du nouveau preset
     * @param e event
     */
    const handleOnChangeNewPresetName = (e: any) => {
      updateSavePresetBtn();
    }

    /**
     * Gestion du changement de la description du nouveau preset
     * @param e event
     */
    const handleOnChangeNewPresetDescription = (e: any) => {
      updateSavePresetBtn();
    }

    /**
     * Gestion du changement du pseudo du nouveau preset
     * @param e event
     */
    const handleOnChangeNewPresetPseudo = (e: any) => {
      updateSavePresetBtn();
    }

    /**
     * Gère l'activation / désactivation du bouton de sauvegarde du nouveau preset
     */
    const updateSavePresetBtn = () => {
      const savePresetBtn = document.getElementById("save-preset-form-button") as HTMLButtonElement | null;
      if (savePresetBtn) {
        const isFormValid = isNewPresetDivFieldsNotEmpty();
        savePresetBtn.disabled = !isFormValid;
      }
    };
    

    /**
     * Vérifie si tous les champs du formulaire de sauvegarde du nouveau preset sont remplis
     * @returns true si tous les champs du formulaire de sauvegarde du nouveau preset sont remplis
     */
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

    /**
     * Dessine les cellules dans le canvas
     */
    const drawCells = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if(ctx && canvasRef.current){
          ctx.fillStyle = `rgb(0, 0, 0)`;
          ctx.fillRect(0, 0, canvasRef.current.width - 1, canvasRef.current.height - 1);
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

    /**
     * Handler du changement du preset selectionné
     * @param preset 
     */
    const handleChangePresetCB = (preset: IPreset) => {
      if(preset !== undefined) setSelectedPreset(preset);
    }

    /**
     * Handler du clic sur le bouton d'exportation de la liste des presets de l'user
     */
    const exportUserPresetsCB = () => {
      presetServiceRef.current.exportUserPresets();
    }

    /**
     * Handler du clic sur le bouton de suppression d'un preset
     * @param preset : preset à supprimer
     */
    const deleteUserPresetCB = (preset: IPreset) => {
      presetServiceRef.current.deleteUserPreset(preset.id);
      props.reloadUserPresetsCB();
      updateStorageCB();
      ToastLibrary.displayDeletePresetToast(preset.name, props.displayToast);
    }

    /**
     * Met à jour la liste des presets de l'user dans le local storage
     */
    const updateStorageCB = () => {
      const fct = async () => {
        await localStorageServiceRef.current.setUserPresets(presetServiceRef.current.getUserPresets());
      }
      fct();
    }

    /**
     * Applique le preset : met à jour les valeurs des sliders et du service
     * @param preset : preset à appliquer
     */
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
      setVirtTimeCounter(0);
      handleFillCells();
      drawCells();
      ToastLibrary.displayApplyPresetToast(preset.name, props.displayToast);
    }

    /**
     * Change la valeur de isRunning et change le texte du bouton RUN / PAUSE
     */
    const toggleIsRunning = () => {
        setIsRunning((prev) => {
            const btn = document.getElementById("button-run");
            if (btn) btn.innerText = !prev ? "PAUSE" : "RUN";
            return !prev;
        });
    }

  // librairie ?
  /**
   * Gère le clic dans le canvas
   * @param e event
   */
  const handleMouseDown = (e: any) => {
    handleCoords((e as unknown) as MouseEvent);
    if (canvasRef.current) {
        const mouseX = coords.x;
        const mouseY = coords.y;
        const mouseI = Math.floor(mouseX / cellSize);
        const mouseJ = Math.floor(mouseY / cellSize);
        if(mouseI >= 0 && mouseI <= maxIRef.current && mouseJ >= 0 && mouseJ <= maxJRef.current){
            if (e.button === 0) {
                if(brushIsRandom){
                  cellsRef.current = cellServiceRef.current.drawRandowCircle(mouseI, mouseJ);
                }
                else {
                  cellsRef.current = cellServiceRef.current.drawColoredCircle(mouseI, mouseJ);
                }
                drawCells();
            }
            else if (e.button === 2) {
                cellsRef.current = cellServiceRef.current.clearCircle(mouseI, mouseJ);
                drawCells();
            }
            updateMousePosition(e);
            if(isMouseOver) drawBrushUsingRef();
        }
    }
  }

  /**
   * Dessine les contours de la brush dans le canvas en tenant compte des coordonnées 'circulaires'
   * Appelle la fonction 'drawBrushCircle'
   */
const drawBrushUsingRef = () => {
  const radius = Math.floor((brushSize/2) * cellSize);
  if (canvasRef.current) {
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const ctx = canvasRef.current.getContext("2d");

    const mousePosX = mousePositionRef.current.x;
    const mousePosY = mousePositionRef.current.y;

    if(!isRunning) drawCells();
    
    if (ctx && canvasRef.current) {
      canvasRef.current.style.cursor = 'crosshair';
      const isMouseNearEast = mousePosX - radius < 0;
      const isMouseNearWest = mousePosX + radius > canvasWidth;
      const isMouseNearNorth = mousePosY - radius < 0;
      const isMouseNearSouth = mousePosY + radius > canvasHeight;

      drawBrushCircle(ctx, mousePosX, mousePosY, radius, brushHardness);

      if (isMouseNearEast ) {
        drawBrushCircle(ctx, canvasWidth + mousePosX, mousePosY, radius, brushHardness);
      }

      if (isMouseNearWest) {
        drawBrushCircle(ctx, mousePosX - canvasWidth, mousePosY, radius, brushHardness);
      }

      if (isMouseNearNorth) {
        drawBrushCircle(ctx, mousePosX, canvasHeight + mousePosY, radius, brushHardness);
      }

      if (isMouseNearSouth) {
        drawBrushCircle(ctx, mousePosX, mousePosY - canvasHeight, radius, brushHardness);
      }

      if(isMouseNearEast && isMouseNearNorth) {
        drawBrushCircle(ctx, canvasWidth + mousePosX, canvasHeight + mousePosY, radius, brushHardness);
      }

      if(isMouseNearEast && isMouseNearSouth) {
        drawBrushCircle(ctx, canvasWidth + mousePosX, mousePosY - canvasHeight, radius, brushHardness);
      }

      if(isMouseNearWest && isMouseNearNorth) {
        drawBrushCircle(ctx, mousePosX - canvasWidth, canvasHeight + mousePosY, radius, brushHardness);
      }

      if(isMouseNearWest && isMouseNearSouth) {
        drawBrushCircle(ctx, mousePosX - canvasWidth, mousePosY - canvasHeight, radius, brushHardness);
      }
    }
  }
}

/**
 * Dessine les contours de la brosse
 * @param ctx 
 * @param mouseX 
 * @param mouseY 
 * @param radius 
 * @param hardness 
 */
const drawBrushCircle = (ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, radius: number, hardness: number) => {
  const radiusHardness = hardness === 0 ? 10 : radius * hardness;
  ctx.strokeStyle = CanvasConfig.BRUSH_STROKE_LARGE_COLOR;
  ctx.lineWidth = CanvasConfig.BRUSH_STROKE_LARGE_WIDTH;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = ColorLibrary.hexToRgb(brushColor); // Orange à 100%
  ctx.lineWidth = CanvasConfig.BRUSH_STROKE_WIDTH;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = CanvasConfig.BRUSH_STROKE_MEDIUM_COLOR;
  ctx.lineWidth = CanvasConfig.BRUSH_STROKE_MEDIUM_WIDTH;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radiusHardness, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = ColorLibrary.hexToRgb(brushColor); // Orange à 100%
  ctx.lineWidth = CanvasConfig.BRUSH_STROKE_SMALL_WIDTH;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radiusHardness, 0, 2 * Math.PI);
  ctx.stroke();
}

/**
 * Met à jour les sliders à partir des valeurs du service
 */
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
    setBrushHardness(cellServiceRef.current.getBrushHardness());
    setBrushIsRandom(cellServiceRef.current.getBrushIsRandom());

    setBrushColor(cellServiceRef.current.getBrushColor());
    setBgColor(cellServiceRef.current.getBgColor());

    setFloorR(cellServiceRef.current.getCountingFloorR());
    setFloorG(cellServiceRef.current.getCountingFloorG());
    setFloorB(cellServiceRef.current.getCountingFloorB());

    setColorSensibilityR(cellServiceRef.current.getColorSensibilityR());
    setColorSensibilityG(cellServiceRef.current.getColorSensibilityG());
    setColorSensibilityB(cellServiceRef.current.getColorSensibilityB());

    setCellEvolutionDeltaT(cellServiceRef.current.getCellEvolutionDeltaT());
  };

  /**
   * Handlers des modification des sliders, des color pickers et de la checkbox
   */

  const handleOnChangeCellSizeSlider = (value: any) => {
    setCellSize(value);
    cellServiceRef.current.setCellSize(value);
    
    maxIRef.current = Math.floor(width / value);
    maxJRef.current = Math.floor(height / value);
    cellsRef.current = cellServiceRef.current.initCells();
    setVirtTimeCounter(0);
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

  const handleOnChangeBrushHardnessSlider = (value: any) => {
    setBrushHardness(value);
    cellServiceRef.current.setBrushHardness(value);
  }

  const handleOnChangeBrushIsRandomCheckbox = (value: any) => {
    setBrushIsRandom(value);
    cellServiceRef.current.setBrushIsRandom(value);
  }

  const handleOnChangeBrushColorPicker = (value: any) => {
    setBrushColor(value);
    cellServiceRef.current.setBrushColor(value);
  }

  const handleOnChangeBgColorPicker = (value: any) => {
    setBgColor(value);
    cellServiceRef.current.setBgColor(value);
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

  const handleOnChangeSensibilitySliderRR = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityR()[1] === 0 && cellServiceRef.current.getColorSensibilityR()[2] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityR()[1], cellServiceRef.current.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRG = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityR()[0] === 0 && cellServiceRef.current.getColorSensibilityR()[2] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityR()[0], value, cellServiceRef.current.getColorSensibilityR()[2]];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderRB = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityR()[0] === 0 && cellServiceRef.current.getColorSensibilityR()[1] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityR()[0], cellServiceRef.current.getColorSensibilityR()[1], value];
    setColorSensibilityR(tab);
    cellServiceRef.current.setColorSensibilityR(tab);
  }

  const handleOnChangeSensibilitySliderGR = (value: any) => {
      if(value === 0 && cellServiceRef.current.getColorSensibilityG()[1] === 0 && cellServiceRef.current.getColorSensibilityG()[2] === 0) {
        value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
      }
      const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityG()[1], cellServiceRef.current.getColorSensibilityG()[2]];
      setColorSensibilityG(tab);
      cellServiceRef.current.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGG = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityG()[0] === 0 && cellServiceRef.current.getColorSensibilityG()[2] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityG()[0], value, cellServiceRef.current.getColorSensibilityG()[2]];
    setColorSensibilityG(tab);
    cellServiceRef.current.setColorSensibilityG(tab);
  }

  const handleOnChangeSensibilitySliderGB = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityG()[0] === 0 && cellServiceRef.current.getColorSensibilityG()[1] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityG()[0], cellServiceRef.current.getColorSensibilityG()[1], value];
    setColorSensibilityG(tab);
    cellServiceRef.current.setColorSensibilityG(tab);
  }

  

  const handleOnChangeSensibilitySliderBR = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityB()[1] === 0 && cellServiceRef.current.getColorSensibilityB()[2] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [value, cellServiceRef.current.getColorSensibilityB()[1], cellServiceRef.current.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBG = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityB()[0] === 0 && cellServiceRef.current.getColorSensibilityB()[2] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityB()[0], value, cellServiceRef.current.getColorSensibilityB()[2]];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeSensibilitySliderBB = (value: any) => {
    if(value === 0 && cellServiceRef.current.getColorSensibilityB()[0] === 0 && cellServiceRef.current.getColorSensibilityB()[1] === 0) {
      value = CellConfig.CELL_COLOR_SENSIBILITY_MIN_NOT_NULL;
    }
    const tab: [number, number, number] = [cellServiceRef.current.getColorSensibilityB()[0], cellServiceRef.current.getColorSensibilityB()[1], value];
    setColorSensibilityB(tab);
    cellServiceRef.current.setColorSensibilityB(tab);
  }

  const handleOnChangeCellEvolutionDeltaTSlider = (value: any) => {
      setCellEvolutionDeltaT(value);
      cellServiceRef.current.setCellEvolutionDeltaT(value);
  }

  /**
   * Handler du mouvement de la souris dans le canvas
   * @param e event
   */
  const handleMouseMove = (e: any) => {
    updateMousePosition(e);
    if(!isRunning && isMouseOver) drawBrushUsingRef();
  }

  /**
   * Handler de l'entrée de la souris dans le canvas
   * @param e event
   */
  const handleMouseEnter = (e: any) => {
    updateMousePosition(e);
    setIsMouseOver((prev) => {
      return !prev;
    });
  }

  /**
   * Handler de la sortie de la souris dans le canvas
   * @param e event
   */
  const handleMouseLeave = (e: any) => {
    updateMousePosition(e);
    setIsMouseOver((prev) => {
      //console.log('isMouseOver :', !prev);
      return !prev;
    });
    if(!isRunning) drawCells();
  }

  /**
   * Met à jour la ref de la position de la souris
   * @param e event
   */
  const updateMousePosition = (e: any) => {
    handleCoords((e as unknown) as MouseEvent);
    mousePositionRef.current.x = coords.x;
    mousePositionRef.current.y = coords.y;
  }

  return (
    <div id="app-canvas-container">
      <div id="app-canvas-wrapper" className="">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          id="app-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <p>left-click : add circle / right-click : clear circle</p>

        <p className="text-center"><strong>Virtual time counter : {virtTimeCounter.toFixed(2)} (s)</strong></p>
        <p>Preset : {selectedPreset?.name}</p>
        <div className="d-flex gap-3 justify-content-center mb-3 w-100">
            <Button
            className="btn-1"
            onClick={() => {
                handleFillCells();
                drawCells();
            }}
            >
                FILL
            </Button>
            <Button
            className="btn-1"
            onClick={() => {
                ToastLibrary.displayResetToast(props.displayToast);
                handleClearCells();
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
      </div>
      <Accordion 
      defaultActiveKey={null}
      id="app-accordion"
      className="accordion-container"
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
            <Settings 
              floorR={floorR}
              handleOnChangeFloorSliderR={handleOnChangeFloorSliderR}
              convFilterRadiusR={convFilterRadiusR}
              handleOnChangeConvFilterRadiusSliderR={handleOnChangeConvFilterRadiusSliderR}
              convFilterMuR={convFilterMuR}
              handleOnChangeConvFilterMuSliderR={handleOnChangeConvFilterMuSliderR}
              convFilterSigmaR={convFilterSigmaR}
              handleOnChangeConvFilterSigmaSliderR={handleOnChangeConvFilterSigmaSliderR}

              floorG={floorG}
              handleOnChangeFloorSliderG={handleOnChangeFloorSliderG}
              convFilterRadiusG={convFilterRadiusG}
              handleOnChangeConvFilterRadiusSliderG={handleOnChangeConvFilterRadiusSliderG}
              convFilterMuG={convFilterMuG}
              handleOnChangeConvFilterMuSliderG={handleOnChangeConvFilterMuSliderG}
              convFilterSigmaG={convFilterSigmaG}
              handleOnChangeConvFilterSigmaSliderG={handleOnChangeConvFilterSigmaSliderG}

              floorB={floorB}
              handleOnChangeFloorSliderB={handleOnChangeFloorSliderB}
              convFilterRadiusB={convFilterRadiusB}
              handleOnChangeConvFilterRadiusSliderB={handleOnChangeConvFilterRadiusSliderB}
              convFilterMuB={convFilterMuB}
              handleOnChangeConvFilterMuSliderB={handleOnChangeConvFilterMuSliderB}
              convFilterSigmaB={convFilterSigmaB}
              handleOnChangeConvFilterSigmaSliderB={handleOnChangeConvFilterSigmaSliderB}

              colorSensibilityR={colorSensibilityR}
              handleOnChangeSensibilitySliderRR={handleOnChangeSensibilitySliderRR}
              handleOnChangeSensibilitySliderRG={handleOnChangeSensibilitySliderRG}
              handleOnChangeSensibilitySliderRB={handleOnChangeSensibilitySliderRB}

              colorSensibilityG={colorSensibilityG}
              handleOnChangeSensibilitySliderGR={handleOnChangeSensibilitySliderGR}
              handleOnChangeSensibilitySliderGG={handleOnChangeSensibilitySliderGG}
              handleOnChangeSensibilitySliderGB={handleOnChangeSensibilitySliderGB}

              colorSensibilityB={colorSensibilityB}
              handleOnChangeSensibilitySliderBR={handleOnChangeSensibilitySliderBR}
              handleOnChangeSensibilitySliderBG={handleOnChangeSensibilitySliderBG}
              handleOnChangeSensibilitySliderBB={handleOnChangeSensibilitySliderBB}

              cellEvolutionDeltaT={cellEvolutionDeltaT}
              handleOnChangeCellEvolutionDeltaTSlider={handleOnChangeCellEvolutionDeltaTSlider}
              cellGrowthMu={cellGrowthMu}
              handleOnChangeCellGrowthMuSlider={handleOnChangeCellGrowthMuSlider}
              cellGrowthSigma={cellGrowthSigma}
              handleOnChangeCellGrowthSigmaSlider={handleOnChangeCellGrowthSigmaSlider} 
              cellSize={cellSize}
              handleOnChangeCellSizeSlider={handleOnChangeCellSizeSlider}

              handleDefaultValues={handleDefaultValues}
              handleResetValues={handleResetValues}
              handleSaveValues={handleSaveValues}

              isNewPresetDivOpen={isNewPresetDivOpen}
              handleSaveNewPresetValues={handleSaveNewPresetValues}

              handleOnChangeNewPresetName={handleOnChangeNewPresetName}
              handleOnChangeNewPresetDescription={handleOnChangeNewPresetDescription}
              handleOnChangeNewPresetPseudo={handleOnChangeNewPresetPseudo}
              isNewPresetDivFieldsNotEmpty={isNewPresetDivFieldsNotEmpty}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" >
          <Accordion.Header>Brush & fill settings</Accordion.Header>
          <Accordion.Body className="d-flex flex-column gap-3 align-items-center w-100 min-w-100">
            <BrushSettings 
              brushSize = {brushSize}
              brushHardness = {brushHardness}
              brushIsRandom = {brushIsRandom}
              brushColor = {brushColor}
              bgColor = {bgColor}
              handleOnChangeBrushSizeSlider = {handleOnChangeBrushSizeSlider}
              handleOnChangeBrushHardnessSlider = {handleOnChangeBrushHardnessSlider}
              handleOnChangeBrushIsRandomCheckbox = {handleOnChangeBrushIsRandomCheckbox}
              handleOnChangeBrushColorPicker = {handleOnChangeBrushColorPicker}
              handleOnChangeBgColorPicker = {handleOnChangeBgColorPicker}
              />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export default CustomCanvas;