import { SearchSong,Canvas } from "@/entitites";
import React, { useEffect, useState } from "react";
import style from "./ui/style.module.css";

import { useReadCVS,findSongMap,findSimilarSong } from "./model";
import { SongCanvasType } from "@/entitites/canvas/model/types";
import { Slider } from "@/shared";

export const Workspace = ({})=>{

    const songs = useReadCVS();
    const [arrayHelp,setArrayHelp] = useState<Array<string>>();
    const [stepLoading,setStepLoading] = useState<number>(0.7);
    const [arraySongs,setArraySongs]= useState<Array<SongCanvasType>>();

    const search = (song:string) =>{
        const array:Array<SongCanvasType> = [];
        const res = findSongMap(song,songs);
        res.map((el)=>{
            array.push({
                name:el.data['Track'],
                author:el.data['Artist'],
                ratting:el.streams_total,
                step_equals:el.step_equals,
            })
        });
        setArraySongs([...array]);
    }

    // Только 10 первых аудиозаписей похожих на запрос
    const write = (song:string) =>{
        const songs_similar = findSimilarSong(song,songs);
        const array:Array<string> = [];
        songs_similar.map((el,index)=>{
            if(index > 9) return;
            else return array.push(el['Track']+" ("+el['Artist']+ ") " +el['Album Name'])
        })
        setArrayHelp(prev=>prev=array);
    }

    return(
        <div className={style.workspace}>
            <div className={style.settings_menu}>
                <SearchSong callbackButton={search} callbackInput={write} arrayHelpSearch={arrayHelp}/>
                <div className={style.step_loading}>
                    <p>Степень сходства: {stepLoading}</p>
                    <Slider  onChange={(e)=>setStepLoading(Number(e.target.value))} value={stepLoading} step={0.01} min={0.5} max={1}/>
                </div>
            </div>
            <div className={style.canvas}>
                <Canvas callback={search} width={window.innerWidth-100} height={window.innerHeight-200} arraySongs={arraySongs} stepLoading={stepLoading}/>
            </div>
            <div className={style.guide}>
                <p>P.S. (Zoom - колёсико мыши), (Перемещение - правая кнопка мыши), (Перейти к выбранной песне - левая кнопка мыши)</p>
            </div>
        </div>
    );
}