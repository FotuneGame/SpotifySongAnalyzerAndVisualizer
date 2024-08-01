import { Button, Input } from "@/shared";
import React, {FC, useState, useEffect, useRef} from "react";
import style from "./ui/style.module.css";
import { useOutside } from "./model";

interface IProps{
    callbackInput: (song:string)=>void,
    callbackButton: (song:string)=>void,
    arrayHelpSearch?: Array<string>
}

export const SearchSong:FC<IProps> = React.memo(({callbackButton,callbackInput,arrayHelpSearch}) =>{
    const [song,setSong] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const ref = useRef(null);
    const outside = useOutside(ref);

    const click = () =>{
        callbackButton(song);
        setSong("");
        setActive(false);
    }

    const write = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setSong(e.target.value);
        callbackInput(e.target.value);
        setActive(true);
    }

    useEffect(()=>{
        if(outside){
            setActive(false);
        }
    },[outside,song,arrayHelpSearch]);

    return(
        <>
            <div className={style.search_tool} ref={ref}>
                <Input placeholder="введите песню..." type="text" value={song} onChange={write} />
                <Button onClick={click}>Начать</Button>
                {song && active ? (arrayHelpSearch && arrayHelpSearch.length!==0 ? 
                    <div className={style.menu_help}>
                        <ul className={style.list}>
                            {arrayHelpSearch.map((el,index) => {
                                return(
                                    <li className={style.list_element} key={"help_input_menu"+index} onClick={()=>{callbackButton(el);setSong("");setActive(false);}}>
                                        {el}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    :
                    <div className={style.menu_help}>
                        Ничего аналогичного нет на свете...
                    </div>
                )
                :
                    null
                }
            </div>
        </>
    )
})