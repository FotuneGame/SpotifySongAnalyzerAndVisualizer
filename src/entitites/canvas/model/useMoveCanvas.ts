import { useEffect, useState} from "react";
import { PositionType, TransformType, SongCanvasType } from "./types";

interface IUseMoveCanvas{
    arraySongs?: Array<SongCanvasType>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    transformCanvas: TransformType,
    setTransformCanvas: React.Dispatch<React.SetStateAction<TransformType>>
}

export const useMoveCanvas = ({arraySongs,canvasRef,transformCanvas,setTransformCanvas}:IUseMoveCanvas) => {
    
    const oldPositionMouseDown:PositionType = {x:0,y:0};
    const lengthMove:PositionType = {x:0,y:0};

    const [oldCenter,setOldCenter] = useState<PositionType>({x:0,y:0});

    function moveMouse (event:MouseEvent){
        lengthMove.x = event.offsetX - oldPositionMouseDown.x;
        lengthMove.y = event.offsetY - oldPositionMouseDown.y;
        setTransformCanvas( (prev) => ({...prev, x:lengthMove.x, y: lengthMove.y}) );
    }

    function mouseDown (event:MouseEvent){
        lengthMove.x = 0;
        lengthMove.y = 0;
        oldPositionMouseDown.x=event.offsetX;
        oldPositionMouseDown.y=event.offsetY;
        canvasRef.current?.addEventListener('mousemove',moveMouse)
    }

    function removeMouse (event:MouseEvent){
        setOldCenter(prev=>({x:prev.x + lengthMove.x ,y:prev.y + lengthMove.y }));
        setTransformCanvas( (prev) => ({...prev, x:0, y: 0}) );
        canvasRef.current?.removeEventListener('mousemove',moveMouse)
    }

    useEffect(()=>{
        if(canvasRef.current){
            setOldCenter({x:canvasRef.current.width/2,y:canvasRef.current.height/2});
            canvasRef.current.onmousedown = mouseDown;
            canvasRef.current.onmouseup = removeMouse;
        }
        return(()=>{
            if(canvasRef.current){
                canvasRef.current.onmousedown = null;
                canvasRef.current.onmouseup = null;
                canvasRef.current.removeEventListener('mousemove',moveMouse)
            }
        })
    },[canvasRef.current,arraySongs]);
    

    return oldCenter;
}