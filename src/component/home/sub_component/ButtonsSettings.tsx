import { Button } from "react-bootstrap";

interface IButtonsSettingsProps {
    handleDefaultValues: () => void;
    handleResetValues: () => void;
    handleSaveValues: () => void;
}

const ButtonsSettings = (props: IButtonsSettingsProps) => {
    return (
        <div className="d-flex gap-3 justify-content-center mb-2">
            <Button
                className="btn-1"
                onClick={() => {
                    props.handleDefaultValues();
                }}
            >
                DEFAULT
            </Button>
            <Button
                className="btn-1"
                onClick={() => {
                    props.handleResetValues();
                }}
            >
                RESET
            </Button>
            <Button
                className="btn-1"
                id="save-preset-button"
                onClick={() => {
                    props.handleSaveValues();
                }}
            >
                SAVE
            </Button>
        </div>
    );
};
export default ButtonsSettings;