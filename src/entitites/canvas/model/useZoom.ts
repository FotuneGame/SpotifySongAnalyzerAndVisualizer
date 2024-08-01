import {TransformType} from "./types";

interface IUseZoom{
    transformCanvas: TransformType,
    setTransformCanvas: React.Dispatch<React.SetStateAction<TransformType>>
}

export const useZoom = ({transformCanvas,setTransformCanvas}:IUseZoom) =>{


    const zoomWheel = (event: React.WheelEvent) =>{
        event.stopPropagation();
        if(transformCanvas.w>Math.abs(event.deltaY) && transformCanvas.h>Math.abs(event.deltaY))
            setTransformCanvas( (prev) => ({...prev, w:prev.w + event.deltaY, h:prev.h + event.deltaY}) );
        else
            setTransformCanvas( (prev) => ({...prev, w: Math.abs(event.deltaY), h: Math.abs(event.deltaY)}));
    }

    return zoomWheel;
}