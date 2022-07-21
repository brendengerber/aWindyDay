//Requires necessary moduals. 
const eventEmitter  = require('./eventEmitter.js');

//Helper function to change the color of an asset based on the time of day (light or dark).
module.exports.updateColorByTime = function(name, state){
    if(state.time.current === 'day'){
        state[name].color = '\x1b[97m';
    }else if(state.time.current === 'night'){
        state[name].color = '\x1b[90m';
    }
};

//Same helper function for use within the module.
let updateColorByTime = function(name, state){
    if(state.time.current === 'day'){
        state[name].color = '\x1b[97m';
    }else if(state.time.current === 'night'){
        state[name].color = '\x1b[90m';
    }
};

module.exports.Star = class{
    //Arguments are entered as integers for the number of desired frames.
    constructor(flickerDelay, flickerDuration){
        this._flickerDelay = flickerDelay;
        this._flickerDuration = flickerDuration;
    };
    get flickerDelay(){
        return this._flickerDelay;
    };
    get flickerDuration(){
        return this._flickerDuration;
    };

    frame1 = [["*"]];

    //The state argument should be a state object for the specific object (as opposed to the full state object).
    update(name, state){
        if(state[name].color === '\x1b[97m' && state[name].counter === this.flickerDelay){
            state[name].color = '\x1b[90m';
            state[name].counter = 0;
        }else if(state[name].color === '\x1b[90m' && state[name].counter === this.flickerDuration){
            state[name].color = '\x1b[97m';
            state[name].counter = 0;
        }else{
            state[name].counter ++;
        }
        if(state.time.current === 'day'){
            state[name].draw = false;
        }else if(state.time.current === 'night'){
            state[name].draw = true;
        }
            
    };
};

module.exports.House1 = class{
    //Argument is entered as integers for the number of desired frames.
    constructor(frameDuration){
        this._frameDuration = frameDuration;
    };
    get frameDuration(){
        return this._frameDruation;
    };
    frame1 = [
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","~"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","~","blank","blank","blank","blank"],
        [" ","_","_","_","_","|","|"],
        ["/","/","/","/","\\","\\","\\","\\"],
        ["|","[","]"," "," ","[","]","|"],
        ["|"," "," ","[","]"," "," ","|"]
    ];

    frame2 = [                
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","~","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        [" ","_","_","_","_","|","|"],
        ["/","/","/","/","\\","\\","\\","\\"],
        ["|","[","]"," "," ","[","]","|"],
        ["|"," "," ","[","]"," "," ","|"]
    ];
    //The state argument should be a state object for the specific object (as opposed to the full state object).
    update(name, state){
        //Updates counter and current frame in the state object, in charge of changing frames.
        if(state[name].frame === 1 && state[name].counter === 30){
            state[name].frame = 2;
            state[name].counter = 0;
        }else if(state[name].frame === 2 && state[name].counter === 30){
            state[name].frame = 1;
            state[name].counter = 0;
        }else{
            state[name].counter ++;
        }
        updateColorByTime(name, state);
    };
}

module.exports.House = class{
    //Argument is entered as integers for the number of desired frames.
    constructor(frameDuration){
        this._frameDuration = frameDuration;
    };
    get frameDuration(){
        return this._frameDruation;
    };
    frame1 = [
        ["~","blank","blank","blank","blank","blank",],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","~","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","|","|","_","_","blank","blank","blank","blank"],
        ["blank","blank","blank","/","/","/","\\","\\","\\"],
        ["blank","blank","blank","|"," ","[","]"," ","|","blank","blank","blank","blank"]
    ];

    frame2 = [                
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","~","blank","blank"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
        ["blank","blank","blank","blank","|","|","_","_","blank","blank","blank","blank"],
        ["blank","blank","blank","/","/","/","\\","\\","\\"],
        ["blank","blank","blank","|"," ","[","]"," ","|","blank","blank","blank","blank"]
    ];

    //The state argument should be a state object for the specific object (as opposed to the full state object).
    update(name, state){
        //Updates counter and current frame in the state object, in charge of changing frames.
        if(state[name].frame === 1 && state[name].counter === 30){
            state[name].frame = 2;
            state[name].counter = 0;
        }else if(state[name].frame === 2 && state[name].counter === 30){
            state[name].frame = 1;
            state[name].counter = 0;
        }else{
            state[name].counter ++;
        }
        updateColorByTime(name, state);
    };
};


module.exports.Tree = class{
    frame1 = [
        ["blank","blank","blank","blank","blank","blank","blank","blank","\\","/","blank","blank","/"],
        ["blank","blank","blank","blank","|","/","blank","blank","/","/","blank","\\","\\","blank","/","/"],
        ["blank","blank","=","=","\\","\\","/","blank","\\","\\","blank","blank","\\","v","/","-"],
        ["blank","blank","blank","blank","blank","\\","\\","blank","/","/","blank","\\","|","|"],
        ["blank","-","-","\\","\\","blank","\\","v","/","\\","\\","blank","/","/","=","=","/"],
        ["blank","blank","blank","blank","blank","=","=","|","|","blank","\\","v","/"],
        ["blank","blank","=","=","/","/","blank","\\","\\","blank","/","/","=","=","="],
        ["blank","/","/","blank","blank","blank","blank","blank","|","V","|"," "," "," ","\\","\\","="],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|","O","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|"],
        ["blank","blank","blank","blank","blank","blank","blank","͡"," ","͡"," ","͡"]
    ];
    update(name, state){
        updateColorByTime(name, state);
    };
};

module.exports.Grass = class{
    frame1 = [
        [" ","\\","/"," "," "," "," ","\\"," "," "," ","/"," "," "," "," "," "," "," "," "," "," "," ","\\"," "," "," "," "," ","\\","/"],
        [" "," "," ","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","/"],
        [" "," "," "," "," "," ","\\"," "," "," ","\\","/"," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," ","\\"," "," "," "," "," "," ","/"],
        ["\\","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\"," "," "," "," "," "," "," "," ","/"],
        [" "," ","\\"," "," "," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," "," ","\\"],
        [" "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," "," ","\\"," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," ","\\"],
        [" ","/"," "," "," "," ","\\","/"," "," "," "," ","\\"," "," ","\\","/"," "," "," "," "," "," ","\\"," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," ","/"],
        [],
        []
    ];
    update(name, state){
        updateColorByTime(name, state);
    };
};

module.exports.Horizon = class{
    //Take an integer as an argument for how long to draw the horizon.
    constructor(horizonLength){
        this.frame1 = this.buildFrame(horizonLength);
    };
    //Builds the asset array based on the constructor
    buildFrame(horizonLength){
        let frame = [[]];
        for(let i = horizonLength ; i > 0; i--){
            frame[0].push("_");
        }
        return frame;
    };
    update(name, state){
        updateColorByTime(name, state);
    };
};

module.exports.Fence = class{
    //Takes integers for the size of the field it will contain.
    constructor(x,y){
        this.frame1 = this.buildFrame(x,y);
    };
    buildFrame(x,y){
        let frame = [];
        //Builds the left side of the frame.
        for(let i = y; i > 0; i--){
            frame.push(["‡"]);
        }
        //Fills the middle with 'blank' to make it transparent.
        for(let i = x; i > 0; i--){
            for(let row of frame){
                row.push("blank");
            }
        }
        //Builds the right side of the fence.
        for(let row of frame){
            row.push("‡");
        }
        //Builds the bottom of the fence.
        frame.push([]);
        for(let i = x + 2; i > 0; i--){
            frame[frame.length - 1].push("‡");
        }
        //Builds the top of the fence.
        frame.unshift([]);
        for(let i = x + 2; i > 0; i--){
            frame[0].push("‡")
        }
        //Builds the fence's door.
        if(frame[0].length % 2 === 0){
            frame[0][frame[0].length/2 - 1] = "-";
            frame[0][frame[0].length/2] = "-";
        }else{
            frame[0][Math.floor((frame[0].length/2))] = "-";
        }
        //Adds a margin to the right and left (looks better when layered over the grass)
        for(let row of frame){
            row.unshift(" ");
            row.push(" ");
        }
        return frame;
    };
    update(name, state){
        updateColorByTime(name, state);
    };
};

module.exports.CelestialBody = class{
    frame1 = [["\x1b[1mO"]];
    frame2 = [["\x1b[1mC"]];
    update(name, state){
        //Sets the movement delay in number of frames.
        let delay = 20;
        let initialOffset = {x: state[name].initialOffset.x, y: state[name].initialOffset.y};
        //Controls the initial ascent.        
        if(state[name].counter === delay && state[name].direction === 'rise'){
            state[name].offset.x = state[name].offset.x + 2;
            state[name].offset.y = state[name].offset.y - 1;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes directtion after desired steps are reached.
            if(state[name].steps === 2){
                state[name].steps = 0;
                state[name].direction = 'up';
            }
        //Controlls the final ascent.    
        }else if(state[name].counter === delay && state[name].direction === 'up'){
            state[name].offset.x = state[name].offset.x + 3;
            state[name].offset.y = state[name].offset.y - 1;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes directtion after desired steps are reached.
            if(state[name].steps === 4){
                state[name].steps = 0;
                state[name].direction = 'parallel';
            }
        //Controlls paralell movement    
        }else if(state[name].counter === delay && state[name].direction === 'parallel'){
            state[name].offset.x = state[name].offset.x + 3;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes direction after desired steps are reached.
            if(state[name].steps === 1){
                state[name].steps = 0;
                state[name].direction = 'down';
            }
        //Controlls the descent.
        }else if(state[name].counter === delay && state[name].direction === 'down'){
            state[name].offset.x = state[name].offset.x + 3;
            state[name].offset.y = state[name].offset.y + 1;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes celestial body and resets the offset.
            if(state[name].steps === 4){
                state[name].steps = 0;
                state[name].direction = 'set';
            }
        //Controlls the final decent.    
        }else if(state[name].counter === delay && state[name].direction === 'set'){
            state[name].offset.x = state[name].offset.x + 2;
            state[name].offset.y = state[name].offset.y + 1;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes directtion after desired steps are reached.
            if(state[name].steps === 3){
                state[name].steps = 0;
                state[name].direction = 'rise';
                state[name].offset = initialOffset;
                // eventEmitter.emit("loss")
                if(state[name].frame === 1){
                    state[name].frame = 2;
                    state.time.current = 'night';
                }else if(state[name].frame === 2){
                    state[name].frame = 1;
                    state.time.current = 'day';
                    eventEmitter.emit('day');
                }
            }
        }else{
            state[name].counter++;
        }
    }
}

module.exports.Cloud = class{
    frame1 = [
        //**need to reverse */
        ["blank","blank","blank","blank","_","_","_"],
        ["blank","_","_","(","_","_","_",")","_"],
        ["(","_","_",")","_","_","_","_","_",")"],
    ];
    update(name, state){
        updateColorByTime(name, state);
        if(state[name].offset.x < -10){
            state[name].offset.x = state[name].initialOffset.x;
        }
        if(state[name].counter === 5){
            state[name].offset.x--;
            state[name].counter = 0;
        }
        state[name].counter++;
    };
}
