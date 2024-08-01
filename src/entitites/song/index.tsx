import React,{FC} from "react";

interface IProps{
    track:string,
    albumName:string,
    artist:string,
    size:number
}

export const Song:FC<IProps> = React.memo(({track,albumName,artist,size})=>{
    return(
        <div>
            {track} + {albumName} + {artist} + {size}
        </div>
    );
})