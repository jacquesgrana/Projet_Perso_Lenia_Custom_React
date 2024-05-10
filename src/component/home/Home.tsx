import { useOutletContext } from "react-router-dom";
import IToast from "../../interface/IToast";
import CustomCanvas from "./sub_component/CustomCanvas";

const Home = () => {

    const { displayToast }: { displayToast: (toast: IToast) => void } = useOutletContext();

    
    return (
        <div id="app-home">
            <h1 className="text-center">Home</h1>
            <CustomCanvas 
                displayToast={displayToast}
            />
        </div>
    );
}

export default Home;