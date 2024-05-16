//import { useEffect, useState } from "react";
import Preset from "./Preset";
import IPreset from "../../../interface/IPreset";
import { Button } from "react-bootstrap";

interface IPresetSelectorProps {
    presets: IPreset[];
    userPresets: IPreset[];
    applyPresetCB: (preset: IPreset) => void;
    exportUserPresetsCB: () => void;
}

const PresetSelector = (props : IPresetSelectorProps) => {

    //const [presets, setPresets] = useState<IPreset[]>([]);
    //const [userPresets, setUserPresets] = useState<IPreset[]>([]);
    /*
    useEffect(() => {
        //console.log('props.presets :', props.presets);
        //setPresets(props.presets);
    }, [props.presets]);

    useEffect(() => {
        //console.log('props.userPresets :', props.userPresets);
        //setUserPresets(props.userPresets);
    },  [props.userPresets]);
*/
    return (
        <div id="app-preset-selector">
            <h4 className="text-center">Preset Selector</h4>
            <h5 className="text-center mt-3">Default presets</h5>
            <div id="presets-container" className="d-flex flex-wrap flex-row gap-3 justify-content-center align-items-center">
                {props.presets.map((preset: IPreset) => <Preset 
                key={preset.id} 
                preset={preset} 
                applyPresetCB={props.applyPresetCB}/>
                )}
            </div>

            {props.userPresets && props.userPresets.length > 0 ? (
            <div className="d-flex flex-column align-items-center ">
                <h5 className="text-center mt-3">User preset(s)</h5>
                <div id="presets-container" className="d-flex flex-wrap flex-row gap-3 justify-content-center align-items-center">
                    {props.userPresets.map((userPreset: IPreset) => <Preset
                        key={userPreset.id}
                        preset={userPreset}
                        applyPresetCB={props.applyPresetCB}/>
                    )}
                </div>
                <Button
                    className="btn-1 mt-3"
                    onClick={() => {
                        props.exportUserPresetsCB();
                    }}
                    >
                        EXPORT
                </Button>
            </div>
        ) : null}
        </div> 
    );
}

export default PresetSelector;