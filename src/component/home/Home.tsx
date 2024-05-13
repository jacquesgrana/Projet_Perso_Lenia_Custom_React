import { useOutletContext } from "react-router-dom";
import IToast from "../../interface/IToast";
import CustomCanvas from "./sub_component/CustomCanvas";
import { useEffect, useRef, useState } from "react";
import IPreset from "../../interface/IPreset";
import JsonService from '../../service/JsonService';


const Home = () => {

    const { displayToast }: { displayToast: (toast: IToast) => void } = useOutletContext();
    
    const [presets, setPresets] = useState<IPreset[]>([]);

    const jsonServiceRef = useRef<any>(null);

    useEffect(() => {
        const initData = async () => {
          jsonServiceRef.current = await JsonService.getInstance();
          setPresets(await jsonServiceRef.current.findAllPresets());
        };
        initData();
    }, []);

    /*
    useEffect(() => {
        console.log('presets :', presets);
    }, [presets]);
    */
   
    return (
        <div id="app-home">
            <h1 className="text-center">Home</h1>
            <CustomCanvas 
                displayToast={displayToast}
                presets={presets}
            />
        </div>
    );
}

export default Home;