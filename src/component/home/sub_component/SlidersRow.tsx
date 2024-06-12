import Slider from "rc-slider";
import CellConfig from "../../../config/CellConfig";

interface ISlidersRowProps {
    cellEvolutionDeltaT: number
    handleOnChangeCellEvolutionDeltaTSlider: (value: any) => void
    cellGrowthMu: number
    handleOnChangeCellGrowthMuSlider: (value: any) => void
    cellGrowthSigma: number
    handleOnChangeCellGrowthSigmaSlider: (value: any) => void
}

const SlidersRow = (props: ISlidersRowProps) => {
    return (
        <div className="settings-row mt-2">
            <div className="settings-column">
                <label>Delta t : {props.cellEvolutionDeltaT}</label>
                <Slider
                    min = {CellConfig.CELL_EVOLUTION_DELTA_T_MIN}
                    max = {CellConfig.CELL_EVOLUTION_DELTA_T_MAX}
                    step = {CellConfig.CELL_EVOLUTION_DELTA_T_STEP}
                    value= {props.cellEvolutionDeltaT}
                    onChange={props.handleOnChangeCellEvolutionDeltaTSlider}
                    className="slider-settings"
                />
            </div>
            <div className="settings-column">
                <label>Growth function mu : {props.cellGrowthMu}</label>
                <Slider 
                    min = {CellConfig.CELL_GROWTH_MU_MIN}
                    max = {CellConfig.CELL_GROWTH_MU_MAX}
                    step = {CellConfig.CELL_GROWTH_MU_STEP}
                    value= {props.cellGrowthMu}
                    onChange={props.handleOnChangeCellGrowthMuSlider}
                    className="slider-settings"
                />
            </div>
            <div className="settings-column">
                <label>Growth function sigma : {props.cellGrowthSigma}</label>
                <Slider
                    min = {CellConfig.CELL_GROWTH_SIGMA_MIN}
                    max = {CellConfig.CELL_GROWTH_SIGMA_MAX}
                    step = {CellConfig.CELL_GROWTH_SIGMA_STEP}
                    value= {props.cellGrowthSigma}
                    onChange={props.handleOnChangeCellGrowthSigmaSlider}
                    className="slider-settings"
                />
            </div>
        </div>
    );
};
export default SlidersRow;