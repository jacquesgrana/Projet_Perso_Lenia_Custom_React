import IToast from "../interface/IToast";

export default class ToastLibrary {
    
    //static
    static displayRunToast = async (displayToast: (toast: IToast) => void) => {
        const toastToDisplay: IToast = {
            title: "RUN",
            subtitle: "Running",
            message: "The simulation is runnning",
            mode: "success",
            delay: 1000
        };
        
        displayToast(toastToDisplay);
        //props.displayToast(toastToDisplay);
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
        //props.displayToast(toastToDisplay);
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
}