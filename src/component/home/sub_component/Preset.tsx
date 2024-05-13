import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Preset = (props : any) => {

    return (
        <div id="app-preset">
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.preset.name}</Card.Title>
        <Card.Text>
        <p>{props.preset.description}</p>
        <p>{props.preset.date}</p>
        </Card.Text>
        <Button variant="primary" onClick={() => props.applyPresetCB(props.preset)}>Apply</Button>
      </Card.Body>
    </Card>
        </div>
        
    );
    
};
export default Preset;