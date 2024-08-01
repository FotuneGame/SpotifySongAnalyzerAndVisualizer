import { useEffect, useState } from "react"
import { PositionType } from "./types"

export const useMousePosition = (canvasRef:React.RefObject<HTMLCanvasElement>):PositionType =>{
    const [mousePosition,setMousePosition] = useState<PositionType>({x:0,y:0});
    
    useEffect(()=>{
        function mousePositionHandler (e:MouseEvent){
            setMousePosition({x:e.offsetX,y:e.offsetY});
        }
        if(canvasRef.current){
            canvasRef.current.addEventListener("mousemove",mousePositionHandler);
        }
        return(()=>{
            if(canvasRef.current)
                canvasRef.current.removeEventListener("mousemove",mousePositionHandler);
        })
    },[canvasRef,canvasRef.current]);

    return mousePosition
}