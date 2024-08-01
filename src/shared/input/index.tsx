import React, {FC} from "react";
import style from "./ui/style.module.css";

interface IProps{
    value: any,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
    type: string,
    placeholder?: string,
    disabled?:boolean
}

export const Input:FC<IProps> = React.memo(({value,onChange,type,placeholder,disabled})=>{
    return(
        <input className={style.input_text} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}/>
    )
})