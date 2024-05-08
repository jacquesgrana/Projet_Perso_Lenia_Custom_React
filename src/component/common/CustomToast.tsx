import { Toast } from "react-bootstrap"
import IToast from "../../interface/IToast";

interface CustomToastProps {
    show: boolean,
    toast: IToast,
    toggleShow: () => void
}
const CustomToast = (props: CustomToastProps) => {
    const TOAST_DELAY = 5000;
    return(
        <Toast 
        show={props.show} 
        onClose={props.toggleShow}
        className={`custom-toast-${props.toast.mode} custom-toast`}
        id="custom-toast"
        delay={TOAST_DELAY} 
        autohide
        >
            <Toast.Header>
                <strong 
                className={`custom-toast-${props.toast.mode} me-auto`}
                >
                    {props.toast.title}
                </strong>
                <small 
                className={`custom-toast-${props.toast.mode}`}
                >
                    {props.toast.subtitle}
                </small>
            </Toast.Header>
            <Toast.Body
            className={`text-white`}
            >
                {props.toast.message}
            </Toast.Body>
        </Toast>
    );
}

export default CustomToast;