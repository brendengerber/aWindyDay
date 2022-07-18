///////////Change classes and calls to uppercase!!!!!!!!!!!

module.exports.Star = class {
    //Arguments are entered as integers for the number of desired frames.
    constructor(flickerDelay, flickerDuration){
        this._flickerDelay = flickerDelay;
        this._flickerDuration = flickerDuration;
    }
    get flickerDelay(){
        return this._flickerDelay;
    }
    get flickerDuration(){
        return this._flickerDuration
    }

    frame1 = [['*']];

    //The state argument should be a state object for the specific object (as opposed to the full state object).
    update(state){
        if(state.color === '\x1b[97m' && state.counter === this.flickerDelay){
            state.color = '\x1b[90m';
            state.counter = 0;
        }else if(state.color === '\x1b[90m' && state.counter === this.flickerDuration){
            state.color = '\x1b[97m';
            state.counter = 0;
        }else{
            state.counter ++;
        }
    }
    
}

module.exports.House = class {
    //Argument is entered as integers for the number of desired frames.
    constructor(frameDuration){
        this._frameDuration = frameDuration
    }
    get frameDuration(){
        return this._frameDruation
    }
    frame1 = [
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","~"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","blank","~","blank","blank","blank","blank"],
        ["blank","blank","_","_","|","|","blank","blank","blank","blank"],
        ["blank","/","/","/","\\","\\","\\"],
        ["blank","|","_","[","]","_","|","blank","blank","blank","blank"]
    ]

    frame2 = [                
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","blank","~","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","_","_","|","|","blank","blank","blank","blank"],
        ["blank","/","/","/","\\","\\","\\"],
        ["blank","|","_","[","]","_","|","blank","blank","blank","blank"]
    ]

    //The state argument should be a state object for the specific object (as opposed to the full state object).
    update(state){
        //Updates counter and current frame in the state object, in charge of changing frames.
        if(state.frame === 1 && state.counter === 30){
            state.frame = 2;
            state.counter = 0;
        }else if(state.frame === 2 && state.counter === 30){
            state.frame = 1;
            state.counter = 0;
        }else{
            state.counter ++;
        }
    }
}


module.exports.Tree = class {
    frame1 = [
        ["blank","blank","blank","blank","blank","blank","blank","blank","\\","/"," "," ","/"],
        ["blank","blank","blank","blank","|","/"," "," ","/","/"," ","\\","\\"," ","/","/"],
        ["blank","blank","=","=","\\","\\","/"," ","\\","\\"," "," ","\\","v","/","-"],
        ["blank","blank","blank","blank","blank","\\","\\"," ","/","/"," ","\\","|","|"],
        ["blank","-","-","\\","\\"," ","\\","v","/","\\","\\"," ","/","/","=","=","/"],
        ["blank","blank","blank","blank","blank","=","=","|","|"," ","\\","v","/"],
        ["blank","blank","=","=","/","/"," ","\\","\\"," ","/","/","=","=","="],
        ["blank","/"," "," "," "," "," "," ","|","V","|"," "," "," ","\\","\\","="],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|","0","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","͡"," ","͡"," ","͡"]
    ]
}


module.exports.Horizon = class{
    //Take an integer as an argument for how long to draw the horizon.
    constructor(horizonLength){
        this.frame1 = this.buildFrame(horizonLength)
    }
    //Builds the asset array based on the constructor
    buildFrame(horizonLength){
        let frame = [[]]
        for(let i = horizonLength ; i > 0; i--){
            frame[0].push("_")
        }
        return frame
    }
}
module.exports.Fence = class {
    //Takes integers for the size of the field it will contain.
    constructor(x,y){
        this.frame1 = this.buildFrame(x,y)
    }
    buildFrame(x,y){
        let frame = []
        //Builds the left side of the frame.
        for(let i = y; i > 0; i--){
            frame.push(['‡'])
        }
        //Fills the middle with 'blank' to make it transparent.
        for(let i = x; i > 0; i--){
            for(let row of frame){
                row.push('blank')
            }
        }
        //Builds the right side of the fence.
        for(let row of frame){
            row.push('‡')
        }
        //Builds the bottom of the fence.
        frame.push([])
        for(let i = x + 2; i > 0; i--){
            frame[frame.length - 1].push('‡')
        }
        //Builds the top of the fence.
        frame.unshift([])
        for(let i = x + 2; i > 0; i--){
            frame[0].push('‡')
        }
        //Builds the fence's door.
        if(frame[0].length % 2 === 0){
            frame[0][frame[0].length/2 - 1] = '-'
            frame[0][frame[0].length/2] = '-'
        }else{
            frame[0][Math.floor((frame[0].length/2))] = '-'
        }
        return frame
    }
}










