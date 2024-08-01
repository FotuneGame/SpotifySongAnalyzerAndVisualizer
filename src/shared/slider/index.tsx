import React, {FC,useState} from "react";
import "./ui/style.module.css";

interface IProps{
    value: any,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
    disabled?:boolean
    min?: number,
    max?: number,
    step?: number
}

export const Slider:FC<IProps> = React.memo(({value,onChange,disabled,min,max,step})=>{

    const [range] = useState<{maximum:number,minimum:number}>({
        maximum: max ?? 1,
        minimum: min ?? 0
    });

    const valid = (e:React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.value.length>1){
            let value = Number(e.target.value);

            if(value > range.maximum) value = range.maximum;
            else if (value < range.minimum) value = range.minimum;

            e.target.value = value.toString();
        }
        onChange(e);
    }

    return(
        <input step={step} max={range.maximum} min={range.minimum} type={"range"} value={value} onChange={valid} disabled={disabled}/>
    )
})