import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { format } from "date-fns";
import IPreset from '../../../interface/IPreset';
//import { fr } from "date-fns/locale";

interface IPresetProps {
  preset: IPreset
  applyPresetCB: (preset: IPreset) => void,
  deleteUserPresetCB: (preset: IPreset) => void,
  isDeletable: boolean                     
}
const Preset = (props : IPresetProps) => {

    return (
    <Card className="app-preset-card">
      {props.preset.imageSrc.length > 0 && <Card.Img variant="top" src={props.preset.imageSrc} />}
      <Card.Body className="d-flex flex-column">
        <Card.Title><span className="text-color-bg-dark">{props.preset.name}</span></Card.Title>
        <Card.Text>
        {props.preset.description}<br/>
        <i><span className="text-color-bg">{format(props.preset.date, 'dd MMMM yyyy')}</span></i><br/>
        By <strong><span className="text-color-bg-dark">{props.preset.pseudo}</span></strong>
        </Card.Text>
        <div className="flex-grow-1"></div>
        <div className="d-flex justify-content-center gap-2">
          <Button 
            className="btn-sm-1"
            variant="primary" 
            onClick={() => props.applyPresetCB(props.preset)}
          >
            Apply
          </Button>
          {props.isDeletable && <Button 
            className="btn-sm-2" onClick={() => props.deleteUserPresetCB(props.preset)} variant="danger">Delete</Button>}
        </div>

      </Card.Body>
    </Card>
        
    );
    
};
export default Preset;