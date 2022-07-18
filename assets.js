module.exports.star = class {
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

module.exports.house = class {
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

module.exports.horizon = class {
    frame1 = [
        ["_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_"]
    ]
}

module.exports.tree = class {
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

//not working, how can i set the property based on arg?

// module.exports.horizon = class{
//     constructor(horizonLength){
//         this._horizonLength = horizonLength
//     }
//     get horizonLength(){
//         return this._horizonLength
//     }

//     buildFrame(horizonLength){
//         let frame = []
//         for(let i = horizonLength ; i > 0; i--){
//             frame.push("_")
//         }
//         return frame
//     }

//     frame1 = this.buildFrame(this.horizonLength)
// }








