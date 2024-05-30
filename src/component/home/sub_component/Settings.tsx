import Slider from "rc-slider";
import { Button } from "react-bootstrap";
import CellConfig from "../../../config/CellConfig";
import SlidersColumn from "./SlidersColumn";
import SlidersRow from "./SlidersRow";
import ButtonsSettings from "./ButtonsSettings";
import { NewLineKind } from "typescript";
import NewPresetDiv from "./NewPresetDiv";

interface ISettingsProps {
    floorR: number;
    handleOnChangeFloorSliderR: (value: any) => void;
    convFilterRadiusR: number;
    handleOnChangeConvFilterRadiusSliderR: (value: any) => void;
    convFilterMuR: number;
    handleOnChangeConvFilterMuSliderR : (value: any) => void;
    convFilterSigmaR: number;
    handleOnChangeConvFilterSigmaSliderR: (value: any) => void;

    floorG: number;
    handleOnChangeFloorSliderG: (value: any) => void;
    convFilterRadiusG: number;
    handleOnChangeConvFilterRadiusSliderG: (value: any) => void;
    convFilterMuG: number;
    handleOnChangeConvFilterMuSliderG: (value: any) => void;
    convFilterSigmaG: number;
    handleOnChangeConvFilterSigmaSliderG: (value: any) => void;

    floorB: number;
    handleOnChangeFloorSliderB: (value: any) => void;
    convFilterRadiusB: number;
    handleOnChangeConvFilterRadiusSliderB: (value: any) => void;
    convFilterMuB: number;
    handleOnChangeConvFilterMuSliderB: (value: any) => void;
    convFilterSigmaB: number;
    handleOnChangeConvFilterSigmaSliderB: (value: any) => void;

    colorSensibilityR: [number, number, number];
    handleOnChangeSensibilitySliderRR: (value: any) => void;
    handleOnChangeSensibilitySliderRG: (value: any) => void;
    handleOnChangeSensibilitySliderRB: (value: any) => void;
    colorSensibilityG: [number, number, number];
    handleOnChangeSensibilitySliderGR: (value: any) => void;
    handleOnChangeSensibilitySliderGG: (value: any) => void;
    handleOnChangeSensibilitySliderGB: (value: any) => void;
    colorSensibilityB: [number, number, number];
    handleOnChangeSensibilitySliderBR: (value: any) => void;
    handleOnChangeSensibilitySliderBG: (value: any) => void;
    handleOnChangeSensibilitySliderBB: (value: any) => void;

    cellEvolutionDeltaT: number;
    handleOnChangeCellEvolutionDeltaTSlider: (value: any) => void;
    cellGrowthMu: number;
    handleOnChangeCellGrowthMuSlider: (value: any) => void;
    cellGrowthSigma: number;
    handleOnChangeCellGrowthSigmaSlider: (value: any) => void;
    cellSize: number;
    handleOnChangeCellSizeSlider: (value: any) => void;

    handleDefaultValues: () => void;
    handleResetValues: () => void;
    handleSaveValues: () => void;

    isNewPresetDivOpen: boolean;
    handleSaveNewPresetValues: () => void;

    handleOnChangeNewPresetName: (value: any) => void;
    handleOnChangeNewPresetDescription: (value: any) => void;
    handleOnChangeNewPresetPseudo: (value: any) => void;
    isNewPresetDivFieldsNotEmpty: () => boolean;
}

const Settings = (props: ISettingsProps) => {
    return (
        <>
            {/* Settings */}
            <h4 className="text-center mt-2">Settings</h4>
            <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center w-100">
                {/* Red */}
                <SlidersColumn 
                    title="Red"
                    floor={props.floorR}
                    convFilterRadius={props.convFilterRadiusR}
                    convFilterMu={props.convFilterMuR}
                    convFilterSigma={props.convFilterSigmaR}
                    colorSensibility={props.colorSensibilityR}
                    handleOnChangeFloorSlider={props.handleOnChangeFloorSliderR}
                    handleOnChangeConvFilterRadiusSlider={props.handleOnChangeConvFilterRadiusSliderR}
                    handleOnChangeConvFilterMuSlider={props.handleOnChangeConvFilterMuSliderR}
                    handleOnChangeConvFilterSigmaSlider={props.handleOnChangeConvFilterSigmaSliderR}
                    handleOnChangeSensibilitySliderR={props.handleOnChangeSensibilitySliderRR}
                    handleOnChangeSensibilitySliderG={props.handleOnChangeSensibilitySliderRG}
                    handleOnChangeSensibilitySliderB={props.handleOnChangeSensibilitySliderRB}
                />

                {/* Green */}
                <SlidersColumn 
                    title="Green"
                    floor={props.floorG}
                    convFilterRadius={props.convFilterRadiusG}
                    convFilterMu={props.convFilterMuG}
                    convFilterSigma={props.convFilterSigmaG}
                    colorSensibility={props.colorSensibilityG}
                    handleOnChangeFloorSlider={props.handleOnChangeFloorSliderG}
                    handleOnChangeConvFilterRadiusSlider={props.handleOnChangeConvFilterRadiusSliderG}
                    handleOnChangeConvFilterMuSlider={props.handleOnChangeConvFilterMuSliderG}
                    handleOnChangeConvFilterSigmaSlider={props.handleOnChangeConvFilterSigmaSliderG}
                    handleOnChangeSensibilitySliderR={props.handleOnChangeSensibilitySliderGR}
                    handleOnChangeSensibilitySliderG={props.handleOnChangeSensibilitySliderGG}
                    handleOnChangeSensibilitySliderB={props.handleOnChangeSensibilitySliderGB}  
                />

                {/* Blue */}
                <SlidersColumn 
                    title="Blue"
                    floor={props.floorB}
                    convFilterRadius={props.convFilterRadiusB}
                    convFilterMu={props.convFilterMuB}
                    convFilterSigma={props.convFilterSigmaB}
                    colorSensibility={props.colorSensibilityB}
                    handleOnChangeFloorSlider={props.handleOnChangeFloorSliderB}
                    handleOnChangeConvFilterRadiusSlider={props.handleOnChangeConvFilterRadiusSliderB}
                    handleOnChangeConvFilterMuSlider={props.handleOnChangeConvFilterMuSliderB}
                    handleOnChangeConvFilterSigmaSlider={props.handleOnChangeConvFilterSigmaSliderB}
                    handleOnChangeSensibilitySliderR={props.handleOnChangeSensibilitySliderBR}
                    handleOnChangeSensibilitySliderG={props.handleOnChangeSensibilitySliderBG}
                    handleOnChangeSensibilitySliderB={props.handleOnChangeSensibilitySliderBB}  
                />
            </div>
            <div className="d-flex flex-row align-items-center gap-3 flex-wrap justify-content-center w-100">
                <SlidersRow 
                    cellEvolutionDeltaT={props.cellEvolutionDeltaT}
                    handleOnChangeCellEvolutionDeltaTSlider={props.handleOnChangeCellEvolutionDeltaTSlider}
                    cellGrowthMu={props.cellGrowthMu}
                    handleOnChangeCellGrowthMuSlider={props.handleOnChangeCellGrowthMuSlider}
                    cellGrowthSigma={props.cellGrowthSigma}
                    handleOnChangeCellGrowthSigmaSlider={props.handleOnChangeCellGrowthSigmaSlider}
                />
                
                <div className="settings-row mt-2">
                    <div className="settings-column">
                        <label>Cell size : {props.cellSize} (pix)</label>
                        <Slider
                            min = {CellConfig.CELL_SIZE_MIN}
                            max = {CellConfig.CELL_SIZE_MAX}
                            step = {CellConfig.CELL_SIZE_STEP}
                            value= {props.cellSize}
                            onChange={props.handleOnChangeCellSizeSlider}
                            className="slider-settings"
                        />
                    </div>
                </div>
            </div>
            <ButtonsSettings 
                handleDefaultValues={props.handleDefaultValues}
                handleResetValues={props.handleResetValues}
                handleSaveValues={props.handleSaveValues}
            />
            
            {props.isNewPresetDivOpen ? (
                <NewPresetDiv
                    handleOnChangeNewPresetName={props.handleOnChangeNewPresetName}
                    handleOnChangeNewPresetDescription={props.handleOnChangeNewPresetDescription}
                    handleOnChangeNewPresetPseudo={props.handleOnChangeNewPresetPseudo}
                    isNewPresetDivFieldsNotEmpty={props.isNewPresetDivFieldsNotEmpty}
                    handleSaveNewPresetValues={props.handleSaveNewPresetValues}
                />
                ) : null
            }
            {/* fin settings */}
        </>
    );
}

export default Settings;