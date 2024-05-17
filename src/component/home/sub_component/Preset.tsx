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
        <div id="app-preset">
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.preset.name}</Card.Title>
        <Card.Text>
        {props.preset.description}<br/>
        {format(props.preset.date, 'dd MMMM yyyy')}<br/>
        {props.preset.pseudo}
        </Card.Text>
        <Button 
          variant="primary" 
          onClick={() => props.applyPresetCB(props.preset)}
        >
          Apply
        </Button>
        {props.isDeletable && <Button 
          onClick={() => props.deleteUserPresetCB(props.preset)} variant="danger">Delete</Button>}
      </Card.Body>
    </Card>
        </div>
        
    );
    
};
export default Preset;

//, { locale: fr }