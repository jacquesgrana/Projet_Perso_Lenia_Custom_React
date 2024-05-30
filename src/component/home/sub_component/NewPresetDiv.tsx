import { Button } from "react-bootstrap";

interface INewPresetDivProps {
    handleOnChangeNewPresetName: (event: any) => void
    handleOnChangeNewPresetDescription: (event: any) => void
    handleOnChangeNewPresetPseudo: (event: any) => void
    isNewPresetDivFieldsNotEmpty: () => boolean
    handleSaveNewPresetValues: () => void
}

const NewPresetDiv = (props: INewPresetDivProps) => {
    return (
        <div className="d-flex gap-3 justify-content-center flex-wrap mb-2">
            <h5>New preset</h5>
            <div className="d-flex gap-3 justify-content-center flex-wrap mb-2">
            
                <div>
                    <label htmlFor="new-preset-name">Name :</label>
                    <input 
                        type="text" 
                        id="new-preset-name" 
                        className="form-control" 
                        placeholder="Preset name" 
                        onChange={props.handleOnChangeNewPresetName}
                    />
                </div>
                <div>
                    <label htmlFor="new-preset-description">Description :</label>
                    <input 
                        type="text"
                        id="new-preset-description" 
                        className="form-control" 
                        placeholder="Preset description" 
                        onChange={props.handleOnChangeNewPresetDescription}
                    />
                </div>
                <div>
                    <label htmlFor="new-preset-pseudo">User pseudo :</label>
                    <input 
                        type="text" 
                        id="new-preset-pseudo" 
                        className="form-control" 
                        placeholder="Preset user pseudo" 
                        onChange = {props.handleOnChangeNewPresetPseudo}
                    />
            </div>

            </div>
            <Button
                className="btn-1"
                id="save-preset-form-button"
                disabled={!props.isNewPresetDivFieldsNotEmpty()}
                onClick={() => {
                    props.handleSaveNewPresetValues();
                    //console.log('click save');
                }}
            >
                SAVE
            </Button>
        </div>
    );
}

export default NewPresetDiv;