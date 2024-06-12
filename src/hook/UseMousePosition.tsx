// copié depuis : https://dev.to/get_pieces/drawing-interactive-shapes-with-canvas-elements-in-a-react-application-3d2n
import { useEffect, useState } from "react";

/**
 * State custom qui gère la position de la souris en temps réel dans son container (event.clientX, event.clientY)
 * @param global boolean indiquant si la fonction doit être appelée dans le contexte global
 * @returns useState<{ x: number; y: number }>
 */
const useMousePosition = (
  global: boolean = false
): [{ x: number; y: number }, (event: MouseEvent) => void] => {
 const [mouseCoords, setMouseCoords] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0
  });

 const handleCursorMovement = (event: MouseEvent): void => {
 //@ts-ignore
 const rect = event.target.getBoundingClientRect();
    setMouseCoords({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };
useEffect(() => {
    if (global) {
        window.addEventListener("mousemove", handleCursorMovement);

        return () => {
            window.removeEventListener("mousemove", handleCursorMovement);
        };
    }
}, [global]);

 return [mouseCoords, handleCursorMovement];
};
export default useMousePosition;