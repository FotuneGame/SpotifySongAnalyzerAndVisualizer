import React,{FC, useEffect, useRef, useState} from "react";
import style from './ui/style.module.css';
import type { SongCanvasType, TransformType , EngineType, ElementSongType} from "./model/types";
import {render, useMoveCanvas, useZoom, useMousePosition} from "./model";

interface IProps{
    arraySongs?: Array<SongCanvasType>,
    width: number,
    height: number,
    stepLoading:number,
    callback: (song:string)=>void
}

export const Canvas:FC<IProps> = React.memo(({arraySongs,width,height,stepLoading,callback}) =>{

    const [selectSong,setSelectSong] = useState<ElementSongType>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [transformCanvas,setTransformCanvas] = useState<TransformType>({
        x:0,
        y:0,
        w:width,
        h:height
    });

    const zoomWheel = useZoom({transformCanvas,setTransformCanvas});
    const offset = useMoveCanvas({arraySongs,canvasRef,transformCanvas,setTransformCanvas});
    const mousePosition = useMousePosition(canvasRef);

    const selectSongClick = (e:React.MouseEvent) =>{
        e.preventDefault();
        if(selectSong){
            callback(selectSong.song.name);
            setSelectSong(null);
        }
    }

    useEffect(()=>{
        if(canvasRef && canvasRef.current){
            const context = canvasRef.current.getContext("2d");
            if(context && arraySongs){
                const engine:EngineType ={
                    canvas: canvasRef.current, 
                    transformCanvas:transformCanvas,
                    context: context,
                    offset: offset,
                    mousePosition:mousePosition
                }
                setSelectSong(prev => prev = render(engine,arraySongs,stepLoading));
            }

        }
    },[canvasRef.current,transformCanvas,offset,mousePosition,stepLoading,arraySongs,width,height]);

    return(
        <>
            {arraySongs && arraySongs.length!==0 ?
                <canvas onContextMenu={selectSongClick} onWheel={zoomWheel} className={style.wrapper}  width={width+"px"} height={height+"px"} ref={canvasRef}></canvas>
            :
                <div className={style.wrapper} style={{width:width+"px",height:height+"px"}}>
                    <p>Введите песню в поисковик.</p>
                </div>
                
            }
        </>
    )
})