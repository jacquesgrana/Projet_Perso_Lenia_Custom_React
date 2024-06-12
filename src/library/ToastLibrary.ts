import IToast from "../interface/IToast";

export default class ToastLibrary {
    
    static displayRunToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "RUN",
            subtitle: "Running",
            message: "The simulation is runnning",
            mode: "success",
            delay: 1000
        };
        
        displayToast(toastToDisplay);
    }

    static displayStopToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "STOP",
            subtitle: "Stopped",
            message: "The simulation is stopped",
            mode: "danger",
            delay: 1000
        };

        displayToast(toastToDisplay);
    }

    static displayResetToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "RESET",
            subtitle: "Reset",
            message: "The simulation is reset",
            mode: "warning",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }

    static displayRandomizeToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "RANDOMIZE",
            subtitle: "Randomize",
            message: "The simulation is randomized",
            mode: "info",
            delay: 1500
        };
        displayToast(toastToDisplay);   
    }

    static displayApplyPresetToast = async (name: string, displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "APPLY PRESET",
            subtitle: "Apply Preset",
            message: "The preset '" + name + "' is applied",
            mode: "success",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }

    static displaySavePresetToast = async (name: string, displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "SAVE PRESET",
            subtitle: "Save Preset",
            message: "The preset '" + name + "' is saved",
            mode: "success",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }

    static displayImportPresetDoneToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "IMPORT PRESETS",
            subtitle: "Import Presets",
            message: "The presets are imported",
            mode: "success",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }

    static displayImportPresetErrorToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "ERROR IMPORT PRESETS",
            subtitle: "Error Import Presets",
            message: "The presets are not imported",
            mode: "danger",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }

    static displayDeletePresetToast = async (name: string, displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "DELETE PRESET",
            subtitle: "Delete Preset",
            message: "The preset '" + name + "' is deleted",
            mode: "success",
            delay: 1500
        };
        displayToast(toastToDisplay);
    }
}