import React, {FC} from "react";
import style from "./ui/style.module.css";

interface IProps{
    children: React.ReactNode,
    onClick:()=>void,
    disabled?:boolean
}

export const Button:FC<IProps> = React.memo(({children,onClick,disabled})=>{
    return(
        <button className={style.btn} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
})