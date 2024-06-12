//import { useEffect, useState } from "react";
import Preset from "./Preset";
import IPreset from "../../../interface/IPreset";
import { Button } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import PresetService from "../../../service/PresetService";
import { se } from "date-fns/locale";
import IToast from "../../../interface/IToast";
import ToastLibrary from "../../../library/ToastLibrary";
//import CellService from '../../../service/CellService';

interface IPresetSelectorProps {
    presets: IPreset[],
    userPresets: IPreset[],
    applyPresetCB: (preset: IPreset) => void,
    exportUserPresetsCB: () => void,
    reloadUserPresetsCB: () => void,
    deleteUserPresetCB: (preset: IPreset) => void
    displayToast: (toast: IToast) => void,
    updateStorageCB: () => void
}

const PresetSelector = (props : IPresetSelectorProps) => {

const [isImportDivOpen, setIsImportDivOpen] = useState<boolean>(false);

const [file, setFile] = useState<File | null>(null);

const presetServiceRef = useRef<PresetService>();

/**
 * Initialisation du service
 */
useEffect(() => {
    const fct = async () => {
        presetServiceRef.current = await PresetService.getInstance();
    };
    fct();
}, []);

/**
 * Gère le fichier à importer
 * @param e event
 */
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
};

// TODO librairie ?
/**
 * Gère l'import du fichier
 * @param e event
 */
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result;
            // TODO faire des tests sur la structure des données du fichier
            if (fileContent) {
                try {
                    const fileObject = JSON.parse(fileContent as string);
                    const userPresetsToAdd: IPreset[] = fileObject.user_presets;
                    presetServiceRef.current?.addUserPresets(userPresetsToAdd);
                    props.reloadUserPresetsCB();
                    ToastLibrary.displayImportPresetDoneToast(props.displayToast);
                    setFile(null);
                    setIsImportDivOpen(false);
                    props.updateStorageCB();

                }
                catch (error) {
                    console.error('Error parsing JSON:', error);
                    ToastLibrary.displayImportPresetErrorToast(props.displayToast);
                    setFile(null);
                    setIsImportDivOpen(false);
                }                
            }
        };
        reader.readAsText(file);
    }
  };

    return (
        <div id="app-preset-selector" className="d-flex flex-column align-items-center justify-content-center">
            <h4 className="text-center mt-2">Preset Selector</h4>
            <h5 className="text-center mt-3">Default presets</h5>
            <div id="presets-container" className="d-flex flex-wrap flex-row gap-3 justify-content-center align-items-center">
                {props.presets.map((preset: IPreset) => 
                <Preset 
                    key={preset.id} 
                    preset={preset} 
                    applyPresetCB={props.applyPresetCB}
                    isDeletable={false}
                    deleteUserPresetCB={() => {}}
                />
                )}
            </div>

            {props.userPresets && props.userPresets.length > 0 ? (
            <div className="d-flex flex-column align-items-center ">
                <h5 className="text-center mt-3">User preset(s)</h5>
                <div id="presets-container" className="d-flex flex-wrap flex-row gap-3 justify-content-center align-items-center">
                    {props.userPresets.map((userPreset: IPreset) => 
                    <Preset
                        key={userPreset.id}
                        preset={userPreset}
                        applyPresetCB={props.applyPresetCB}
                        isDeletable={true}
                        deleteUserPresetCB={props.deleteUserPresetCB}
                    />
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
        <Button
        className="btn-1 mt-3"
        onClick={() => {
            setIsImportDivOpen(!isImportDivOpen);
        }}
        >
            IMPORT
        </Button>
        {isImportDivOpen && (
            <form onSubmit={handleFormSubmit} className="d-flex flex-column align-items-center ">
                
                <p>Import file</p>
                <input type="file" onChange={handleFileChange} />
                <Button
                className="btn-1 mt-3"
                type="submit"
                >
                    UPLOAD
                </Button>
            </form>
        )}
        </div> 
    );
};
export default PresetSelector;