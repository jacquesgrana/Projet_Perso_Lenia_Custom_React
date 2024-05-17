import { useOutletContext } from "react-router-dom";
import IToast from "../../interface/IToast";
import CustomCanvas from "./sub_component/CustomCanvas";
import { useEffect, useRef, useState } from "react";
import IPreset from "../../interface/IPreset";
import JsonService from '../../service/JsonService';
import PresetService from "../../service/PresetService";


const Home = () => {

    const { displayToast }: { displayToast: (toast: IToast) => void } = useOutletContext();
    
    const [presets, setPresets] = useState<IPreset[]>([]);
    const [userPresets, setUserPresets] = useState<IPreset[]>([]);

    const jsonServiceRef = useRef<any>(null);
    const presetServiceRef = useRef<any>(null);

    useEffect(() => {
        const initData = async () => {
          jsonServiceRef.current = await JsonService.getInstance();
          presetServiceRef.current = await PresetService.getInstance();
          //setPresets(await jsonServiceRef.current.findAllPresets());
          setPresets(presetServiceRef.current.getPresets());
          //setUserPresets(await jsonServiceRef.current.findAllUserPresets());
          setUserPresets(presetServiceRef.current.getUserPresets());
        };
        initData();
    }, []);

    /*
    useEffect(() => {
        console.log('presets :', presets);
    }, [presets]);
    */

    const reloadUserPresetsCB = async () => {
        setUserPresets(presetServiceRef.current.getUserPresets());
    }

    return (
        <div id="app-home">
            <h1 className="text-center">Home</h1>
            <CustomCanvas 
                displayToast={displayToast}
                presets={presets}
                userPresets={userPresets}
                reloadUserPresetsCB={reloadUserPresetsCB}
            />
        </div>
    );
}

export default Home;