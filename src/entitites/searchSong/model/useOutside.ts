import { useEffect, useState } from "react";



export function useOutside(ref : React.MutableRefObject<HTMLElement> | React.MutableRefObject<null>) {
    const [outside,setOutside] = useState(false);
    useEffect(() => {
        function handleClickOutside(event:  MouseEvent) {
            if (ref  && event && ref.current && !ref.current.contains(event.target as HTMLElement)) 
                setOutside(true);
            else
                setOutside(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    return outside;
}