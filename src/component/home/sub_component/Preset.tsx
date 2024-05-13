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
        <p>{props.preset.description}</p>
        <p>{format(props.preset.date, 'dd MMMM yyyy', { locale: fr })}</p>
        </Card.Text>
        <Button variant="primary" onClick={() => props.applyPresetCB(props.preset)}>Apply</Button>
      </Card.Body>
    </Card>
        </div>
        
    );
    
};
export default Preset;