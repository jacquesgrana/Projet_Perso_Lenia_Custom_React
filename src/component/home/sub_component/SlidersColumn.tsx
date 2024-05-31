import Slider from "rc-slider";
import CellConfig from "../../../config/CellConfig";

interface ISettingsColumnProps {
    title: string;
    floor: number;
    convFilterRadius: number;
    convFilterMu: number;
    convFilterSigma: number;
    colorSensibility: [number, number, number];
    handleOnChangeFloorSlider: (value: any) => void;
    handleOnChangeConvFilterRadiusSlider: (value: any) => void;
    handleOnChangeConvFilterMuSlider: (value: any) => void;
    handleOnChangeConvFilterSigmaSlider: (value: any) => void;
    handleOnChangeSensibilitySliderR: (value: any) => void;
    handleOnChangeSensibilitySliderG: (value: any) => void;
    handleOnChangeSensibilitySliderB: (value: any) => void;
}
const SlidersColumn = (props: ISettingsColumnProps) => {
    return (
        <div className="settings-column">
            <p><strong>{props.title}</strong></p>
            <label>Counting floor : {props.floor}</label>
            <Slider 
                min = {CellConfig.CELL_FILTER_COUNT_FLOOR_MIN}
                max = {CellConfig.CELL_FILTER_COUNT_FLOOR_MAX}
                step = {CellConfig.CELL_FILTER_COUNT_FLOOR_STEP}
                value= {props.floor}
                onChange={props.handleOnChangeFloorSlider}
                className="slider-settings" 
            />
            <p className="mt-2 mb-1"><strong>Convolution filter</strong></p>
            <label>Radius : {props.convFilterRadius}</label>
            <Slider 
                min = {CellConfig.CELL_CONV_FILTER_RADIUS_MIN}
                max = {CellConfig.CELL_CONV_FILTER_RADIUS_MAX}
                step = {CellConfig.CELL_CONV_FILTER_RADIUS_STEP}
                value= {props.convFilterRadius}
                onChange={props.handleOnChangeConvFilterRadiusSlider}
                className="slider-settings" 
            />
            <label>Mu : {props.convFilterMu}</label>
            <Slider 
                min = {CellConfig.CELL_CONV_FILTER_MU_MIN}
                max = {CellConfig.CELL_CONV_FILTER_MU_MAX}
                step = {CellConfig.CELL_CONV_FILTER_MU_STEP}
                value= {props.convFilterMu}
                onChange={props.handleOnChangeConvFilterMuSlider}
                className="slider-settings" 
            />
            <label>Sigma : {props.convFilterSigma}</label>
            <Slider 
                min = {CellConfig.CELL_CONV_FILTER_SIGMA_MIN}
                max = {CellConfig.CELL_CONV_FILTER_SIGMA_MAX}
                step = {CellConfig.CELL_CONV_FILTER_SIGMA_STEP}
                value= {props.convFilterSigma}
                onChange={props.handleOnChangeConvFilterSigmaSlider}
                className="slider-settings" 
            />
            <p className="mt-2 mb-1"><strong>Sensibility</strong></p>
            <label>Red : {props.colorSensibility[0]}</label>
            <Slider 
                min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                value= {props.colorSensibility[0]}
                onChange={props.handleOnChangeSensibilitySliderR}
                className="slider-settings" 
            />
            <label>Green : {props.colorSensibility[1]}</label>
            <Slider 
                min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                value= {props.colorSensibility[1]}
                onChange={props.handleOnChangeSensibilitySliderG}
                className="slider-settings" 
            />
            <label>Blue : {props.colorSensibility[2]}</label>
            <Slider
                min = {CellConfig.CELL_COLOR_SENSIBILITY_MIN}
                max = {CellConfig.CELL_COLOR_SENSIBILITY_MAX}
                step = {CellConfig.CELL_COLOR_SENSIBILITY_STEP}
                value= {props.colorSensibility[2]}
                onChange={props.handleOnChangeSensibilitySliderB}
                className="slider-settings" 
            />
        </div>
    );
};

export default SlidersColumn;