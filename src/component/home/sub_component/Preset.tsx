import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import IPreset from '../../../interface/IPreset';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
//import { fr } from "date-fns/locale";

interface IPresetProps {
  preset: IPreset
  applyPresetCB: (preset: IPreset) => void,
  deleteUserPresetCB: (preset: IPreset) => void,
  isDeletable: boolean                     
}
const Preset = (props : IPresetProps) => {
    const titleHoverRef = useRef<string>("");

    /**
     * Initialisation du titre du hover : apparaît au survol
     */
    useEffect(() => {
        titleHoverRef.current = props.preset.name + "\n"  + props.preset.description + "\n" 
        + format(props.preset.date, 'dd MMMM yyyy') + "\n by " + props.preset.pseudo;
    }, []);

    return (
    <Card 
    className="app-preset-card" 
    title={titleHoverRef.current}
    >
      {props.preset.imageSrc.length > 0 && <Card.Img variant="top" src={props.preset.imageSrc} />}
      <Card.Body className="d-flex flex-column">
        <Card.Title><span className="text-color-bg-dark">{props.preset.name}</span></Card.Title>
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