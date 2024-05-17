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
      <Card.Body className="d-flex flex-column">
        <Card.Title>{props.preset.name}</Card.Title>
        <Card.Text>
        {props.preset.description}<br/>
        {format(props.preset.date, 'dd MMMM yyyy')}<br/>
        {props.preset.pseudo}
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

//, { locale: fr }