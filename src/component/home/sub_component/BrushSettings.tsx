import CellConfig from "../../../config/CellConfig";
import Slider from "rc-slider";
import { ToggleButton } from "react-bootstrap";
import ColorLibrary from "../../../library/ColorLibrary";

interface IBrushSettingsProps {
    brushSize: number,
    brushHardness: number,
    brushIsRandom: boolean,
    brushColor: string,
    bgColor: string,
    handleOnChangeBrushSizeSlider: (value: number) => void,
    handleOnChangeBrushHardnessSlider: (value: number) => void,
    handleOnChangeBrushIsRandomCheckbox: (value: boolean) => void,
    handleOnChangeBrushColorPicker: (value: string) => void,
    handleOnChangeBgColorPicker: (value: string) => void
}

const BrushSettings = (props: IBrushSettingsProps) => {

    // TODO librairie?
    /**
     * Génère un commentaire à afficher selon les valeurs de la couleur 
     * @param color string
     * @returns commentaire à afficher : string
     */
    const getCellValuesComment = (color: string) => {
        const r = Math.round(ColorLibrary.rgbToCellValues(ColorLibrary.hexToRgb(color)).red * 100) / 100;
        const g = Math.round(ColorLibrary.rgbToCellValues(ColorLibrary.hexToRgb(color)).green * 100) / 100;
        const b = Math.round(ColorLibrary.rgbToCellValues(ColorLibrary.hexToRgb(color)).blue * 100) / 100;
        return r + " / " + g + " / " + b;
    }

    return (
        <div id="app-brush-settings" className="d-flex flex-column align-items-center w-100">
            <h4 className="text-center mt-2">Brush & fill Settings</h4>

            <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center w-100">
                <div className="settings-column" title="Change brush size">
                    <label>Brush size : {props.brushSize} (cell)</label>
                    <Slider 
                    min = {CellConfig.CELL_BRUSH_SIZE_MIN}
                    max = {CellConfig.CELL_BRUSH_SIZE_MAX}
                    step = {CellConfig.CELL_BRUSH_SIZE_STEP}
                    value= {props.brushSize}
                    onChange={
                        (value: any) => {
                            props.handleOnChangeBrushSizeSlider(value);
                        }}
                    className="slider-settings"
                    />
                </div>     
                <div className="settings-column" title="Change brush hardness">
                    <label>Brush hardness : {Math.floor(props.brushHardness * 100)} (%)</label>
                    <Slider 
                    min = {CellConfig.CELL_BRUSH_HARDNESS_MIN}
                    max = {CellConfig.CELL_BRUSH_HARDNESS_MAX}
                    step = {CellConfig.CELL_BRUSH_HARDNESS_STEP}
                    value= {props.brushHardness}
                    onChange={
                        (value: any) => {
                            props.handleOnChangeBrushHardnessSlider(value);
                        }}
                    className="slider-settings"
                    />
                </div>
                <div className="settings-column">
                    <label>Random brush : {props.brushIsRandom ? "On" : "Off"}</label>
                        <ToggleButton
                        id="toggle-check"
                        type="checkbox"
                        className={props.brushIsRandom ? "chckbx-1 chckbx-1-checked" : "chckbx-1"}
                        checked={props.brushIsRandom}
                        value="1"
                        onChange={(e) => props.handleOnChangeBrushIsRandomCheckbox(e.currentTarget.checked)} //e.currentTarget.checked
                        title="Toggle random brush"
                        >
                        Random
                        </ToggleButton>

                </div>
                <div className="settings-column">
                    <label>Brush color : {getCellValuesComment(props.brushColor)}</label>
                    <input type="color"
                        id="brushColorInput"
                        value={props.brushColor}
                        onChange={(e) => {
                            props.handleOnChangeBrushColorPicker(e.target.value);
                        }}
                        title="Choose brush color" 
                    />
                </div>
                <div className="settings-column">
                    <label>Bg fill color : {getCellValuesComment(props.bgColor)}</label>
                    <input type="color"
                        id="bgColorInput"
                        value={props.bgColor}
                        onChange={(e) => {
                            props.handleOnChangeBgColorPicker(e.target.value);
                        }}
                        title="Choose fill background color" 
                    />
                </div>
            </div>
        </div>
    )
};
export default BrushSettings;