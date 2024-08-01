import type { Values,Data } from "./types";



export const findSimilarSong = (song:string,values:Values) =>{
    const norm_song = song.toLocaleLowerCase().replace(/[^a-zа-я0-9]+/g,"");

    return values.data.filter(el => {
            const track = el['Track'].toLocaleLowerCase().replace(/[^a-zа-я0-9]+/g,"");
            const artist = el['Artist'].toLocaleLowerCase().replace(/[^a-zа-я0-9]+/g,"");
            const album = el['Album Name'].toLocaleLowerCase().replace(/[^a-zа-я0-9]+/g,"");
            
            return ((track+artist+album).includes(norm_song));
        }
    );
}



export const findSongMap = (song:string,values:Values): Array<{data:Data,step_equals:number,streams_total:number}> =>{
    
    const result: Array<{data:Data,step_equals:number,streams_total:number}> =[];

    const find_song = findSimilarSong(song,values)[0];
    if(!find_song) return result;


    values.data.map(song =>{
        
        //ISRC - уникальный код для песен (index 4 in values_find_song)
        //в файле I Can Do It With a Broken Heart (Taylor Swift) THE TORTURED POETS DEPARTMENT  => (1 и 0.92 т. к. отичаются другие св-ва)

        const values_find_song = Object.values(find_song);
        const values_song = Object.values(song);
        
        let intersection_size =0;
        let union_size = 0;
        values_find_song.map((value_find,index)=>{
            if(index<values_song.length && index!==4 && values_find_song.length!==0 && values_song[index].length!==0){
                intersection_size += calculateLevenshteinDistance(value_find,values_song[index]);
                union_size+=Math.max(values_song.length,value_find.length);
            }
        })    

        
        // коэфицент Жаккара
        const Jaccard= intersection_size / union_size;
        
        let streams=0;
        if(song['Spotify Streams']) streams+= Number(song['Spotify Streams'].replaceAll(",",""));
        if(song['Pandora Streams']) streams+= Number(song['Pandora Streams'].replaceAll(",",""));
        if(song['Soundcloud Streams']) streams+= Number(song['Soundcloud Streams'].replaceAll(",",""));

        result.push({
            data: song,
            streams_total: streams,
            step_equals: 1-Jaccard
        });

    });
    return result;
}


// Растояние Левенштейна
const calculateLevenshteinDistance = (a: string, b: string) => {
    const aLimit = a.length + 1;
    const bLimit = b.length + 1;
    const distance = Array(aLimit);
    for (let i = 0; i < aLimit; ++i) {
        distance[i] = Array(bLimit);
    }
    for (let i = 0; i < aLimit; ++i) {
        distance[i][0] = i;
    }
    for (let j = 0; j < bLimit; ++j) {
        distance[0][j] = j;
    }
    for (let i = 1; i < aLimit; ++i) {
        for (let j = 1; j <  bLimit; ++j) {
            const substitutionCost = (a[i - 1] === b[j - 1] ? 0 : 1);
            distance[i][j] = Math.min(
                distance[i - 1][j] + 1,
                distance[i][j - 1] + 1,
                distance[i - 1][j - 1] + substitutionCost
            );
        }
    }
    return distance[a.length][b.length];
};

