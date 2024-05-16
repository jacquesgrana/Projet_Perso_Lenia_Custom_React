import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { format } from "date-fns";
import { fr } from "date-fns/locale";


const Preset = (props : any) => {

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
        <Button variant="primary" onClick={() => props.applyPresetCB(props.preset)}>Apply</Button>
      </Card.Body>
    </Card>
        </div>
        
    );
    
};
export default Preset;

//, { locale: fr }