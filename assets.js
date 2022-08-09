//ADDING NEW ASSETS
    //Create asset in assets.js as a class.
    //Assets should be an array of arrays. Use draw.stringToArray to convert multi line string art into an asset.
    //Assets should be rectangular i.e., all rows should be the same length, and all columns should be the same length. The draw.makeRectangular method can help by adding blank space to the end of shorter rows. 
    //Transparent characters should be 'blank' while ' ' is used for solid space. This allows for the layering of sprites with transparent backgrounds.
    
    //Add any new instances to game.assets.
    //Add default individual state object to full state object via settings.
    //The first object in settings will be drawn as the top layer, with all subsequent objects drawn below in decending order.

    //When adding a new asset the following are required.
    //State setting offset. Set to an object such as {X:1, y:2}.
    //State setting frame. Set to 1. Even if there is only one frame, as it is needed for the loop to recognize and draw.
    //State setting draw. Set either to true or false.
    //Asset property frame1. Set to a 2D array consisting of what will be drawn. Further frames can be numbered frame2, frame3, etc.
    
    //Update methods are optional.
    //Update methods should accept two args: state which is the full state object, followed by name which will be the name of the object (used for accessing it's own individual state).
    //Color state is optional and default is white.

const eventEmitter  = require('./eventEmitter.js');

//Updates the color in an asset's state based on the time of day.
let updateColorByTime = function(name, state){
    if(state.time.current === 'day'){
        state[name].color = '\x1b[97m';
    }else if(state.time.current === 'night'){
        state[name].color = '\x1b[90m';
    }
};

//Simple and concise field asset based on the more robust Field class.
//Used for drawing only, while robust Field class is used for processing changes and checking for win/loss/move validity.
module.exports.FieldAsset = class{
    constructor(field){
        this.frame1 = field.playField
    }
    //State argument should be the full state object.
    update(name, state){
        updateColorByTime(name, state)
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

    //State argument should be the full state object.
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

module.exports.House = class{
    //Argument is entered as integers for the number of desired frames.
    constructor(frameDuration){
        this._frameDuration = frameDuration;
    };
    get frameDuration(){
        return this._frameDruation;
    };
    frame1 = [
      ["~","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","~","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","|","|","_","_","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","/","/","/","\\","\\","\\","blank","blank","blank","blank"],
      ["blank","blank","blank","|"," ","[","]"," ","|","blank","blank","blank","blank"]
    ];

    frame2 = [
      ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","~","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","|","|","_","_","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","/","/","/","\\","\\","\\","blank","blank","blank","blank"],
      ["blank","blank","blank","|"," ","[","]"," ","|","blank","blank","blank","blank"]
    ];

    //State argument should be the full state object.
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
      ["blank","blank","blank","blank","blank","blank","blank","blank","\\","/","blank","blank","/","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","|","/","blank","blank","/","/","blank","\\","\\","blank","/","/","blank"],
      ["blank","blank","=","=","\\","\\","/","blank","\\","\\","blank","blank","\\","v","/","-","blank"],
      ["blank","blank","blank","blank","blank","\\","\\","blank","/","/","blank","\\","|","|","blank","blank","blank"],
      ["blank","-","-","\\","\\","blank","\\","v","/","\\","\\","blank","/","/","=","=","/"],
      ["blank","blank","blank","blank","blank","=","=","|","|","blank","\\","v","/","blank","blank","blank","blank"],
      ["blank","blank","=","=","/","/","blank","\\","\\","blank","/","/","=","=","=","blank","blank"],
      ["blank","/","/","blank","blank","blank","blank","blank","|","V","|"," "," "," ","\\","\\","="],
      ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","blank","|","O","|","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","blank","|"," ","|","blank","blank","blank","blank","blank","blank"],
      ["blank","blank","blank","blank","blank","blank","blank","͡"," ","͡"," ","͡","blank","blank","blank","blank","blank"]
    ];
    update(name, state){
        updateColorByTime(name, state);
    };
};

module.exports.Grass = class{
    frame1 = [
      [" ","\\","/"," "," "," "," ","\\"," "," "," ","/"," "," "," "," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," ","\\","/"," "," "," ","/"," "," "," "," "," "," ","\\"," "," "," ","/"],
      [" "," "," ","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\","/","blank","blank","blank","blank","blank","blank","blank"],
      [" "," "," "," "," "," ","\\"," "," "," ","\\","/"," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," ","\\"," "," "," "," "," "," "," "," "," "," ","\\","/"],
      ["\\","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," ","/"," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," ","/","blank","blank","blank","blank"],
      [" "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","\\","/","blank","blank","blank","blank","blank","blank","blank"],
      [" "," ","\\"," "," "," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," ","/"," "," "," "," "," "," "," "," "," "," ","\\"],
      [" "," "," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," ","\\"," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," ","\\"," "," "," "," "," "," "," "," ","/","blank","blank","blank","blank","blank","blank"],
      [" ","/"," "," "," "," ","\\","/"," "," "," "," "," "," "," ","\\"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," ","\\","/","blank"],
      [" "," "," "," "," "," "," "," "," "," "," ","/"," "," "," "," "," "," "," "," ","\\","/"," "," "," "," ","\\"," "," "," "," "," "," ","\\","/"," "," "," "," "," "," "," "," "," "," "," "," ","blank","blank","blank","blank"],
      [" "," ","\\","/"," "," "," "," ","\\"," "," "," "," "," ","\\","/"," "," "," "," "," "," "," ","/"," "," "," "," "," "," ","\\"," "," "," "," "," "," "," ","/"," "," "," "," ","\\","/"," "," "," "," "," ","/"]
    ];
    //State argument should be the full state object.
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
    //State argument should be the full state object.
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
    //State argument should be the full state object.
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
            state[name].offset.y = state[name].offset.y - 2;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes directtion after desired steps are reached.
            if(state[name].steps === 3){
                state[name].steps = 0;
                state[name].direction = 'up';
            }
        //Controlls the final ascent.    
        }else if(state[name].counter === delay && state[name].direction === 'up'){
            state[name].offset.x = state[name].offset.x + 4;
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
            state[name].offset.x = state[name].offset.x + 8;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes direction after desired steps are reached.
            if(state[name].steps === 1){
                state[name].steps = 0;
                state[name].direction = 'down';
            }
        //Controlls the descent.
        }else if(state[name].counter === delay && state[name].direction === 'down'){
            state[name].offset.x = state[name].offset.x + 4;
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
            state[name].offset.y = state[name].offset.y + 2;
            state[name].counter = 0;
            state[name].steps ++;
            //Changes directtion after desired steps are reached.
            if(state[name].steps === 4){
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
};

module.exports.Cloud = class{
    frame1 = [
      ["blank","blank","blank","_","_","_","blank","blank","blank","blank"],
      ["blank","_","(","_","_","_",")","_","_","blank"],
      ["(","_","_","_","_","_","(","_","_",")"]
    ];
    //State argument should be the full state object.
    update(name, state){
        updateColorByTime(name, state);
        //Resets the cloud after it has moved completely out of frame on the left.
        if(state[name].offset.x < -10){
            state[name].offset.x = state[name].initialOffset.x;
        }
        //Moves the cloud to the left.
        if(state[name].counter === 5){
            state[name].offset.x--;
            state[name].counter = 0;
        }else{
            state[name].counter++;
        }
        
    };
};



