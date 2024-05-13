import { useEffect } from "react";
import Preset from "./Preset";


const PresetSelector = (props : any) => {
    
    useEffect(() => {
        console.log('props.presets :', props.presets);
    }, [props.presets]);



    return (
        <div id="app-preset-selector">
            <h4 className="text-center">Preset Selector</h4>
            <div id="presets-container" className="d-flex flex-wrap flex-row gap-3 justify-content-center align-items-center">
                {props.presets.map((preset: any) => <Preset 
                key={preset.id} 
                preset={preset} 
                applyPresetCB={props.applyPresetCB}/>
                )}
            </div>
        </div> 
    );
}

export default PresetSelector;