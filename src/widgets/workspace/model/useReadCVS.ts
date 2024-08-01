import Papa, { ParseResult } from "papaparse";
import { useState,useEffect } from "react";
import type { Values,Data } from "./types";

export const useReadCVS = () : Values =>{

    const [values,setValues] = useState<Values>({
        data:[]
    });

    const parse = () =>{
        Papa.parse("/data/test.csv", {
            header: true,
            download: true,
            //encoding: "utf-8", пытался поменять кодировку но не помогло с ���������������������
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: ParseResult<Data>) => {
                setValues(results);
            },
        })
    }

    useEffect(()=>{
        parse()
    },[]);

    return values;
}