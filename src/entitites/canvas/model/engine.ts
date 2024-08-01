import type { SongCanvasType, TransformType, ColorType ,EngineType, PositionType, ElementSongType} from "./types"

const FORCE_BACKHOLE = 500;
const PADDING = 5;
const MAX_ELEMENTS_ON_SCREEN = 150;

export const render = (engine:EngineType,arraySongs: Array<SongCanvasType>,stepLoad:number):ElementSongType=>{
    clear(engine)
    return draw(engine,arraySongs,stepLoad);
}



const clear = (engine:EngineType) =>{
    engine.context.clearRect(0,0,engine.canvas.width,engine.canvas.height);
}



const draw = (engine:EngineType,arraySongs: Array<SongCanvasType>,stepLoad:number) : ElementSongType =>{
    const {transformCanvas,context, offset } = engine;
    const length_vector = Math.sqrt((transformCanvas.w/2)*(transformCanvas.w/2) + (transformCanvas.h/2)*(transformCanvas.h/2)) ;
    
    let count_obj_onsceen =0;
    let size = 70;
    let x = 0;
    let y = 0;

    let main_obj:ElementSongType = null;
    let select_obj:ElementSongType = null;
    
    let max_ratting = arraySongs.reduce(
        (accumulator, currentValue) => accumulator.ratting>currentValue.ratting ? accumulator : currentValue,
    ).ratting;

    arraySongs.forEach ((song,index)=>{        
        if(song.step_equals >= stepLoad){
            if(song.ratting) size = 100 * (1 + song.ratting/max_ratting);
            else size = 70;

            if(song.step_equals===1){
                x = offset.x + transformCanvas.x - size/2;
                y = offset.y + transformCanvas.y - size/2;
            }else{
                x = offset.x + transformCanvas.x  + length_vector *  Math.cos((song.step_equals)*index) / ((song.step_equals-stepLoad) * FORCE_BACKHOLE) - size/2;
                y = offset.y + transformCanvas.y  + length_vector *  Math.sin((song.step_equals)*index) / ((song.step_equals-stepLoad) * FORCE_BACKHOLE) - size/2;
            }

            const transform:TransformType={
                x: x,
                y: y,
                w: size,
                h: size
            }
            const color:ColorType={
                r: hash(song.author) + 96,
                g: 32,
                b: hash(song.author)+ 96,
                a: 255 *song.step_equals
            }
            

            if ((transform.x-transform.w>engine.canvas.width*engine.canvas.width || transform.x+transform.w<-engine.canvas.width) && (transform.y-transform.h>engine.canvas.height*engine.canvas.height || transform.y+transform.h<-engine.canvas.height) ){
                    return ;
            }
            if(count_obj_onsceen>=MAX_ELEMENTS_ON_SCREEN && main_obj)return;
            if(!main_obj && song.step_equals===1){
                main_obj = {transform,color,song};
                return ;
            }
            if(count_obj_onsceen<MAX_ELEMENTS_ON_SCREEN){
                if(inArea(transform,engine.mousePosition))
                    select_obj = {transform,color,song};
                songDraw(context,{transform,color,song});
                count_obj_onsceen++;
            }

        }
    });
    
    if(select_obj)moreInfoDraw(context,select_obj);
    if(main_obj) moreInfoDraw(context,main_obj);
    
    if(select_obj) return select_obj;
    return null;
}

const inArea = (transform:TransformType,mousePosition:PositionType): boolean =>{
    if(mousePosition.x>=transform.x-PADDING && mousePosition.x<=transform.x+transform.w+PADDING){
        if(mousePosition.y>=transform.y-PADDING && mousePosition.y<=transform.y+transform.h+PADDING){
            return true;
        }
        return false;
    }
    return false;
}

const hash = (value:string)=>{
    let chr,res = 0;
    if(value.length===0) return res;
    for(let i=0; i<value.length; i++){
        chr = value.charCodeAt(i);
        res = ((res << 5) - res) + chr;
        res |= 0; // добиваем до 32 бит
    }
    return Math.abs(res) % 128;
}

const songDraw = (context: CanvasRenderingContext2D,element:ElementSongType) => {
    if(!element) return;

    if(element.song.step_equals===1){
        context.fillStyle = `rgba(0,0,0,255)`;
        context.fillRect(element.transform.x-PADDING-2,element.transform.y-PADDING-2,element.transform.w+PADDING+4,element.transform.h+PADDING+4);
    }
    context.fillStyle = `rgba(${element.color.r}, ${element.color.b}, ${element.color.g}, ${element.color.a})`;
    context.fillRect(element.transform.x-PADDING,element.transform.y-PADDING,element.transform.w+PADDING,element.transform.h+PADDING);

    context.fillStyle = `rgba(0,0,0,${element.color.a})`;
    context.font = (element.transform.w/element.song.name.length+8)+"px Verdana";
    context.fillText(element.song.name, element.transform.x,element.transform.y+element.transform.h/2,element.transform.w);
    context.font = (element.transform.h/element.song.author.length+6)+"px Verdana";
    context.fillText(element.song.author, element.transform.x,element.transform.y+element.transform.h-PADDING,element.transform.w);
}

const moreInfoDraw = (context: CanvasRenderingContext2D,element:ElementSongType) => {
    if(!element) return;
    songDraw(context,element);

    context.fillStyle = `rgba(0,0,0,255)`;
    context.fillRect(element.transform.x-PADDING,element.transform.y-PADDING-40,element.transform.w+PADDING,30);

    context.fillStyle = `rgba(255,255,255,${element.color.a})`;
    if(element.song.ratting){
        context.font = "12px Verdana";
        context.fillText("Рейтинг: " + element.song.ratting, element.transform.x,element.transform.y-PADDING-28,element.transform.w);
    }
    if(element.song.step_equals){
        context.font = "12px Verdana";
        context.fillText("Сходство: " +element.song.step_equals.toFixed(2), element.transform.x,element.transform.y-PADDING-12,element.transform.w);
    }
}