export type SongCanvasType = {
    name:string,
    author:string,
    ratting:number,
    step_equals:number,
}

export type PositionType ={
    x:number,
    y:number,
}


export type TransformType = PositionType & {
    w:number,
    h:number
}

export type ColorType = {
    r:number,
    g:number,
    b:number,
    a:number
}

export type EngineType = {
    canvas: HTMLCanvasElement, 
    transformCanvas:TransformType,
    context: CanvasRenderingContext2D,
    offset: PositionType,
    mousePosition: PositionType,
}

export type ElementSongType={
    transform: TransformType, 
    color:ColorType, 
    song: SongCanvasType
} | null