
//make an asset field class? Which takes the array as the constructor to contain all that logic in the assets?
//make field and fence offsets populate automatically based on field size if possible
//Make a settings propertie that is an array with the draw order, then loop through that with the main drawer
//Add a note about transparent backgrounds
//add clouds, could be fun to have it move across the screen and not stop for day or night, i.e. be the only state that doesnt reset somehow
//make an asset that builds a margin that can be placed to hide things like clouds that go off screen


// NEXT
// make an assets module to store them.
// include class for stars so that i can give them different flicker delays (the delay will be an arg for the constructor)

// NEXT 
// Does the postioning method mutate the original?
// Setting new position should be done in update (i.e. updating state), but actual positioning should be done in draw, since it is the act of drawing. 
// should color and possition be methods on draw, or each asset?
// maybe position sprite should not be a method of  each asset. Draw should loop through and draw each sprite (and possition them), based on the current state. That means move position sprite out of the asset. Should all be called using a loop in the composite stage. That way to add an object, you just have to add the object and the state, you dont have to updtade draw, position, and color too. Draw frame can loop through all assets, color them, and then possition/layer them. It will be a loop so that assets dont have to be called individually. The functions can take in the state object, and the asset array. Each asset it checks it's state. colors it, possitions it, and at the end draws it all.  state[asset].color can work for all of them

// NEXT
// /there will be an update and draw method that loops through the assets. update will call the update method inside the asset by using brackets for asset of assets, assets[asset].update. Don't call assets.house.update, like it is now, way harder to maintian as you wuold have to add a statement for each object rather than letting a loop do it.
// should possition stay to act like a counter to update? A draw method for each asset could run color and possition and then return the final array which would be used in the loop to push to the final array which drawFrame would then draw.

// FINAL
// update will be a function that calls all the assets update methods, draw will be a function that calls all of the assets draw methods, adding them to an array which will then be composited using the draw method
// each draw method on the assets will consist of a possition call and color call. Both calls are methods of draw. Call color first inside of possition. Each take an array and return an array. Color returns a new version of the stock, which is the array arg for possition which returns a colored and possitioned.
// can the color and possition be standard somehow?

// For interview, might be good to eliminate hidden field. Make field an asset. Can create field based on the array made by generate valid field. But each space is an object, frame is grass, and a state for hole and hat as well. check move then checks the state of that object.
// alternatively i can set the field asset rather than a field property. that field object can have a state object that is the current field and the hidden field. then check move checks the state to see the validity of the move. 
// either way would want to add field to assets and remove the function that draws it in the draw current frame method.

// draw current frame vs composite frame, should all be in draw? where does color go? How can I color and possitions without muitating the original?
// add more assets like shimmering sun and fense. easy to do now that the logic is there, and makes it way nicer
// add emotions convo, makes him more quarky and grumpy
// simple stats logic
// Make sure there is an explanation about hwo the sprites work using invisible margins

// have an old offset and a new offset, if new offset = old offset, then do not redraw possitioned sprite. If update changes new offset, then redraw the sprite
// should test how it works redrawing each time first though just to see, maybe it wont impact performance much

//possible to set field and fense default offsets based on field size using constructor? Makes it easier to tweak difficulty

// in a perfect world I would make each grass it's own object. Have the object contain if it has a hole. Then when landing on that grid space, would run a check to see. That would allow me to have larger assets.  Game could be a grid with the center of the objects on the grid point and the assets bounce from one to the next and check other objects with that state. could even make hitboxes that way by having their state contain several points connected to the middle.

// reorganize shit

// move field to assets?
// can add a state for the order of layering, then have the loop adding them check that and add in order

// Inspired by maze craze



// could be fun to have a biger field, and a snake thats chasing you or a bird 
// could add a loop to go through all assets and call their draws, would need a state draw: true
// bigger hat ˄

//ADDING NEW ASSETS
    //Create asset in assets.js as a class.
    //Add any new instances to game.assets.
    //Add default individual state object to full state object via settings.
    //The first object in settings will be drawn as the top layer, with all subsequent objects drawn below in decending order.

    //When adding a new asset the following are required.
    //State setting offset. Set to an object such as {X:1, y:2}.
    //State setting frame. Set to 1. Even if there is only one frame, as it is needed for the loop to recognize and draw.
    //State setting draw. Set either to true or false.
    //Asset property frame1. Set to a 2D array consisting of what will be drawn. Further frames can be numbered frame2, frame3, etc.
    
    //The draw.stringToArray() method can be used to make the array for asset objects.
    //Update methods are optional.
    //Update methods should accept two args: state which is the full state object, followed by name which will be the name of the object (used for accessing it's own individual state).
    //Color state is optional and default is white.


//Requires necessary modules.
const fs = require('fs');
const eventEmitter  = require('./eventEmitter.js');
const readlineSync = require('readline-sync');
const hideCursor = require('hide-terminal-cursor');
const showCursor = require("show-terminal-cursor");
const _ = require('lodash');
const assets = require('./assets.js');

//Sets game characters.
const hat = '^';
const hole = 'O';
const grass = '░';
const path = ' ';
// const grass = chalk.green('░');
// const path = chalk.hex('#B87333').visible('░');
const avatar = '8';
// const avatar = '\u03EE';
// const avatar = "𓀠";

//Used to create a new player and to track stats.
class Player{
    constructor(name){
        this.name = name;
    };
    stats = {
        easy: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0,
            totalDaysToWin: 0 
        },

        medium: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0,
            totalDaysToWin: 0 
        },

        hard: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0,
            totalDaysToWin: 0 
        },
    }
        games = [];

        firstLoss = false;
    
    static processStats(player){
        let processedStats = {};
        for(difficulty in player.stats){
            
        }


//***add stats logic here */

        
        return processedStats;
    };
};

//Sets ifficulty settings and default settings.
//Balancing and tweaks can be done here.
let settings = {
    //Used to set the number of holes and field dimensions for each difficulty level as well as states dependent on difficulty.
    easy: {
        fieldSettings:{
            holes: 3, 
            dimensions:{x:6, y:3}
        }, 
        states:{
            field:{
                offset: {x:16, y:9},
            },
            fence: {
                offset: {x:14, y: 8}
            }  
        }
    },
    medium: {
        fieldSettings:{
            holes: 7, 
            dimensions:{x:8, y:5}
        }, 
        states:{
            field: {
                offset: {x:15, y:9}
            },
            fence: {
                offset: {x:13, y:8}

            }  
        }
    },
    hard: {
        fieldSettings:{
            holes: 15, 
            dimensions:{x:12, y:8}
        }, 
        states:{
            field:{
                offset: {x:13, y:9}
            },
            fence: {
                offset: {x:11, y:8}
            }  
        }
    },
    //Sets the default states not dependent on difficulty
    initialStates: {
        field: {
            draw: true,
            frame: 1,
            color: '\x1b[97m'
        },
        fence:{
            draw: true,
            frame: 1,
            color: '\x1b[97m'
        },
        tree: {
            draw: true,
            frame: 1,
            offset: {x:34, y:2}
        },
        house:{
            draw: true,
            frame: 1,
            offset: {x:15,y:2},
            counter: 0
        },
        
        star1: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:11, y:0},
            counter: 0 
        },
        star2: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:31, y:2},
            counter: 0
        },
        star3: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:15, y:3},
            counter: 0
        },
        star4: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:7, y:4},
            counter: 0
        },
        star5: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:29, y:4},
            counter: 0
        },
        star6: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:38, y:4},
            counter: 0
        },
        horizon: {
            draw: true,
            frame: 1,
            offset: {x:0, y:6}
        },
        celestialBody: {
            draw: true,
            frame: 1,
            offset: {x:1, y:5},
            //Used to reset the body after a full arch. Should be the same as offset.
            initialOffset: {x:1, y:5},
            counter: 0,
            steps: 0,
            direction: 'rise'
        },
        grass: {
            draw: true,
            frame: 1,
            offset: {x:2, y:8}
        },
        time: {
            current: 'day'
        },
        layerOrder: {
            // current: this.setDefaultOrder(),
            // setDfaultOrder(){

            // }
        }
    }
};

//Contains game logic.
//***maybe create a game info property containing stats and field, this will be what is written to the player games array, so that play field and _properties are not there */
class Game {
    constructor(difficulty, field){
        this._difficulty = difficulty;
        this._field = field;
        
        //Sets the state from settings object based on difficulty level.
        this._state =  _.merge(settings.initialStates, settings[difficulty].states)

        //Adds playField to assets.
        this.assets.field.frame1 = this.field.playField
        
        //Adds fence to assets.
        this.assets.fence = new assets.Fence(this.assets.field.frame1[0].length, this.assets.field.frame1.length)
    };
    get field(){
        return this._field;
    };
    get difficulty(){
        return this._difficulty;
    }
    get state(){
        return this._state;
    }

    gameStats = {
        attempts: 0,
        days: 0,
        moves: 0,
        win: false,
    };
    //Contains all of the visual assets for the game.
    //Assets should be an array of arrays. Use stringToArrray to convert multi line string art into an asset.
    //Transparent characters should be 'blank' while ' ' is used for solid space. This allows for the layering of sprites.
    assets = {

        //The frame1 property will be filled with the playField in the game constructor.
        field: {
            update(name, state){
                assets.updateColorByTime(name, state)
            }
        },
        celestialBody: new assets.CelestialBody(),
        tree: new assets.Tree(),
        house: new assets.House(30),
        star1: new assets.Star(40, 2),
        star2: new assets.Star(80, 2),
        star3: new assets.Star(120, 2),
        star4: new assets.Star(160, 2),
        star5: new assets.Star(200, 2),
        star6: new assets.Star(240, 2),
        horizon: new assets.Horizon(40),
        grass: new assets.grass()
    };

    // Loops through all of the assets and updates the state object if the asset has an update method.
    update(){
        for(let asset in this.assets){
            //Checks that the object has an update method and runs it if so.
            if(this.assets[asset].update){
                this.assets[asset].update(asset, this.state);
            }
        }
    }
    
    //Used to composite the frame and draw it.
    //Loops through all assets and calls draw.possitionSprite() and draw.color() eliminating the need for individual asset methods.
    //**Add color with positionSprite, make sure to do a check if it is defined first though */
    drawCurrentFrame(){
        let frameAssets = [];
        //Draws all assets.
        for(let key of Object.keys(this.state)){
            //Checks if current asset should be drawn.
            if(this.state[key].draw){
                //Adds the sprite to the array to composite.
                let possitionedColoredArray = draw.possitionSprite(this.assets[key]["frame"+this.state[key].frame], this.state[key].offset);
                if(this.state[key].color){
                    possitionedColoredArray = draw.colorSprite(possitionedColoredArray, this.state[key].color);
                }
                frameAssets.push(possitionedColoredArray);
            }
        }
        let frameArray = draw.createFrame(frameAssets);
        let frameString = draw.arrayToString(frameArray);
        console.log(frameString);
    };

    //Contains game logic.
    playGame(){
        console.clear();
        
        let gameOver = false;
        let x = 0;
        let y = 0;
        let outcome;
        eventEmitter.emit("attempt");
        eventEmitter.emit("day");

        //Helper function that checks the move for Win/Loss and update the playField appropriately.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        //***should updatemove be part of Field just like isoutofbounds? */
        ///**should while loop be its own function? */
        let updateMove = function(x,y){
            // if (this.field.isOutOfBounds(x,y)){
            //     return false
            // }
            if(!this.field.isHole(x,y) && !this.field.isHat(x,y)){
                this.field.playField[y][x] = avatar;
                // return true
            }else if(this.field.isHole(x,y)){
                this.field.playField[y][x] = hole;
                gameOver = true;
                lose();
                // return true
            }else if(this.field.isHat(x,y)){
                this.field.playField[y][x] = hat;
                gameOver = true;
                win();
                // return true
            }
        }.bind(this);

        //Helper function displays the final field, resets the state object, addresses stats, and emits a loss event.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let lose = function(){
            console.clear();
            this.drawCurrentFrame()
            this._state = _.merge(settings[this.difficulty].states, settings.initialStates)
            this.gameStats.win = false;
            eventEmitter.emit("loss");
            outcome = "loss";
        }.bind(this);

        //Helper function displays the final field, addresses stats, and emits a win event.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let win = function(){
            console.clear();
            this.drawCurrentFrame()
            this.gameStats.win = true;
            eventEmitter.emit("win");
            outcome = "win";
        }.bind(this);
        
        //***What are these coments? */
        //Play loop logic that is called to allow the player to move around the board. Changes playField to show path. Includes win/loss and out of bounds logic.
        //Sets up board and prompts user for direction input.
        
        //Used to process user move input.
        //Checks for validity of move and then checks for win/loss conditions.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let move = function(key){
            //Moves the player avatar, sets the x,y possition, and checks for win or loss conditions.
            ///***can path be moved to check move? does it matter? checkmove deals with the new space, while path is the old space and could be handled by the while loop */
            //*******can make checkMove(x,y,newx,newy) This would allw me to move the path shit to checkMove too, which could even be renamed into move */
            //**can remove the newy/nex like in validate? maybe no since in validate we already know we are moving? I could here, but would have to check the move first. Then can just increment with ++ and --
            
            
            //*********should both mainInterface.player.games.splice(-1, 1, mainInterface.game) instances be their own method?*/
            let direction = key.toUpperCase();
            let newY;
            let newX;
            
            switch(direction){
                case "W":
                    newY = y-1;
                    // if(checkMove(x, newY)){
                    //     this.field.playField[y][x] = path;
                    //     y = newY
                    // }
                    if(!this.field.isOutOfBounds(x, newY)){
                        eventEmitter.emit("move");
                        this.field.playField[y][x] = path;
                        y = newY;
                        updateMove(x,y);
                    };
                    break;  
                case "A":
                    newX = x-1;
                    // if(checkMove(newX, y)){
                    //     this.field.playField[y][x] = path;
                    //     x = newX
                    // }
                    if(!this.field.isOutOfBounds(newX, y)){
                        eventEmitter.emit("move");
                        this.field.playField[y][x] = path;
                        x = newX;
                        updateMove(x,y);
                    };
                    break;
                case "S":
                    newY = y+1;
                    // if(checkMove(x, newY)){
                    //     this.field.playField[y][x] = path;
                    //     y = newY
                    // }
                    if(!this.field.isOutOfBounds(x, newY)){
                        eventEmitter.emit("move");
                        this.field.playField[y][x] = path;
                        y = newY;
                        updateMove(x,y);
                    };
                    break;
                case "D":
                    newX = x+1;
                    // if(checkMove(newX, y)){
                    //     this.field.playField[y][x] = path;
                    //     x = newX
                    // }
                    if(!this.field.isOutOfBounds(newX, y)){
                        eventEmitter.emit("move"); 
                        this.field.playField[y][x] = path;
                        x = newX;
                        updateMove(x,y);
                    };
                    break;
                };
        }.bind(this);
        
        //Resumes stdin since readlineSync pauses it when run.
        process.stdin.resume();
        //Sets raw mode to read keystrokes without pressing enter.
        process.stdin.setRawMode(true);
        //Sets encoding.
        process.stdin.setEncoding( 'utf8' );
        //Turns on the move listener and calls move to handle player movements
        process.stdin.on( 'data', move);
        
        //Draws the frames and checks game status.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        //**This portion or part of it will likely move to animate, update, etc */ or use animate here, since it is still part of the game logic really
        //**can the ending logic somehow be moved to update rather than draw?maybe the whole function updates() the frame, draws() and then checks, it could have a different name too, maybe mainLoop. look at 2nd game link for ideas*/
        //**Could be possible to write a while loop, starts logging the time, then at the end subtracts the amount of time that has passed for processing from the total time you want for each frame (1000/60) and waits for that time to elapse before continuing the loop again. */
        //**each grass could be an object with a hole property, drawn at it's coordinates, when the player moves there, the property is checked for hole, the gras is printed, but the player is printed over the grass kinda */
        let mainLoop = function(){
            console.clear();

            //Updates states.
            this.update()
            //Draws the current frame.
            this.drawCurrentFrame()

            if(gameOver){
                //Stops rendering the frames.
                clearInterval(mainLoopInterval);
                //Turns off the move listener
                process.stdin.removeListener('data', move);
                //Returns outcome of the game
                return outcome;
            }
        }.bind(this);

        //Sets the framerate and draws the frame
        let mainLoopInterval = setInterval(mainLoop, 1000/30);
    }; 
};

//Used to create the hiddenField and playField and display said fields.
class Field {
    constructor(hiddenFieldArray){
        this._hiddenField = hiddenFieldArray;
        this._playField = Field.createPlayField(hiddenFieldArray);
        //Used for formatting some prompts and animations.
        this._dimensions = {x: hiddenFieldArray[0].length, y: hiddenFieldArray.length};
    };
    get hiddenField(){
        return this._hiddenField;
    };
    get playField(){
        return this._playField;
    };
    get dimensions(){
        return this._dimensions;
    };
    //Primarily used to update the playField property after each move and reset it to its original state after a game is over.
    set playField(newPlayFieldArray){
        this._playField = newPlayFieldArray;
        // this._playField = Field.createPlayField(hiddenFieldArray);
    };

    //Creates a random field of size x by y containing the provided number of holes with a random distribution accross the board.
    static generateRandomField(x,y,holes){
        //Creates a blank field filled with grass according to the given dimensions
        let newHiddenFieldArray = [];
        for(let i=0; i<y; i++){
            let newRow = [];
            for(let i=0; i<x; i++){
                newRow.push(grass);
            }
            newHiddenFieldArray.push(newRow);
        }
        //Used to add holes, if there is already a hole in the random spot then the function runs again. 
        //This allows adding holes randomly throughout the field rather than having them clustered at the beginning if a simple loop was used to add randomly grass or hole characters until the desired number of holes was reached.
        //Used to add the hat, if there is a hole in the randomly selected location then the function will run again with the location removed from possible locations.
        //A recursive function is used and unsuitable location are removed when encountered to avoid a callstack overflow error on edge case.
        let setHole = function(possibleCoordinatesArray){
            //Selects a random x and y coordinate from the array of available coordinates
            let testCoordinates = possibleCoordinatesArray[Math.floor(Math.random() * (possibleCoordinatesArray.length))]
            //Sets the coordinates for the location on the field.
            let xCoordinate = testCoordinates.x;
            let yCoordinate = testCoordinates.y;
            //Sets the index where the test coordinates are in possibleCoordinatesArray.
            //This will be used later in the event that the coordinates are not grass to remove them from the array passed to the next recursive call.
            let coordinatesIndex = possibleCoordinatesArray.findIndex(coordinates =>  coordinates.x === testCoordinates.x && coordinates.y === testCoordinates.y);
            //Runs setHat again() if the random possition is not available.
            if(newHiddenFieldArray[yCoordinate][xCoordinate] !== grass){
                //Removes x and y coordinates if they are not grass in order to prevent a callstack overflow error in edge cases.
                possibleCoordinatesArray.splice(coordinatesIndex, 1);
                setHole(possibleCoordinatesArray);
            //Sets the hole possition.
            }else{
                newHiddenFieldArray[yCoordinate][xCoordinate] = hole;
            }
        }
    
        //Used to add the hat, if there is a hole in the randomly selected location then the function will run again with the location removed from possible locations.
        //A recursive function is used and unsuitable location are removed when encountered to avoid a callstack overflow error on edge case.
        let setHat = function(possibleCoordinatesArray){
            //Selects a random x and y coordinate from the array of available coordinates
            let testCoordinates = possibleCoordinatesArray[Math.floor(Math.random() * (possibleCoordinatesArray.length))]
            //Sets the coordinates for the location on the field.
            let xCoordinate = testCoordinates.x;
            let yCoordinate = testCoordinates.y;
            //Sets the index where the test coordinates are in possibleCoordinatesArray.
            //This will be used later in the event that the coordinates are not grass to remove them from the array passed to the next recursive call.
            let coordinatesIndex = possibleCoordinatesArray.findIndex(coordinates =>  coordinates.x === testCoordinates.x && coordinates.y === testCoordinates.y);
            //Runs setHat again() if the random possition is not available.
            if(newHiddenFieldArray[yCoordinate][xCoordinate] !== grass){
                //Removes x and y coordinates if they are not grass in order to prevent a callstack overflow error in edge cases.
                possibleCoordinatesArray.splice(coordinatesIndex, 1);
                setHat(possibleCoordinatesArray);
            //Sets the hat possition.
            }else{
                newHiddenFieldArray[yCoordinate][xCoordinate] = hat;
            }
        }
    
        //Runs setHole() until the desired number of holes is reached and then runs setHat()
        let setHatAndHoles = function(holes){
            for(let i=0; i<holes; i++){
                setHole(Field.createPossibleCoordinatesArray(x,y));
            }
            setHat(Field.createPossibleCoordinatesArray(x,y));
        }
        setHatAndHoles(holes);
        return new Field(newHiddenFieldArray);
    }
    
    //Validates a field object and returns true if it is winnable and false if it is not.
    //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
    static validateField(testField){
        let x = 0;
        let y = 0;
        let valid = undefined;
        //Creates an array to test containing 0s in place of path characters
        let testFieldArray = testField.hiddenField.map(row => row.map(column => (column === grass) ? 0 : column));

        //First checks that the starting possition is not a hole.
        //***can this be moved to the createRandomField() method? As in dont put a hole in 0, 0 */
        if(testFieldArray[0][0] === hole || testFieldArray[0][0] === hat){
            valid = false;
        }
        //Helper function that decides which direction to move based on the crumbs present at adjacent spaces.
        //Sets valid to true or false if the hat is found or all adjacent paths have 2 crumbs/holes.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let decideDirection = function(){
            
            //Finds values for crumbs dropped on adjacent moves.
            //Uses optional chaining operator to avoid out of bounds moves which would cause a runtime error.
            let possibleMoves = {
                W: testFieldArray?.[y-1]?.[x],
                A: testFieldArray?.[y]?.[x-1],
                S: testFieldArray?.[y+1]?.[x],
                D: testFieldArray?.[y]?.[x+1]
            };
            //Loops through each direction and records the direction with the least crumbs. If multiple directions have the same number, it will select the first one. 
            //If all moves have more than 3 crumbs, it will return false as the field is invalid.
            //The number of crumbs to count should be one less than the total number of possible paths coming to an intersection. In the case of this simple field it is 4 paths (In a real life maze you would not need to place any crumbs at intersections).
            //If a move encounters the hat, it will return true as the field is valid.
            //There is no need to check for holes or out of bounds as they will resolve to false when compared within the conditional statements
            //The maximum number of acceptible crumbs is 3 which allows to account for dead ends.
            //**could add a checkSpot(x,y) method to check if its out of bounds, hole, or hat
            let directionOfLeastCrumbs = undefined;
            for(let direction in possibleMoves){
                if(directionOfLeastCrumbs === undefined && possibleMoves[direction] < 3){
                    directionOfLeastCrumbs = direction;
                }else if(directionOfLeastCrumbs !== undefined && possibleMoves[direction] < possibleMoves[directionOfLeastCrumbs] && possibleMoves[direction] < 3){
                    directionOfLeastCrumbs = direction;
                //If the hat is encountered, sets valid to true and breaks the loop, the field is valid.
                }else if(possibleMoves[direction] === hat){
                    valid = true;
                    directionOfLeastCrumbs = direction;
                }
            }
            //In the case that there are no available moves and no hat, then the field is not valid.    
            if(directionOfLeastCrumbs === undefined){
                valid = false;
            }
            return directionOfLeastCrumbs;
        }.bind(this);

        //Helper function that will move the xy possition and set crumbs on the previous space.
        //This can run into call stack problems?
        let move = function(direction){
            testFieldArray[y][x]++;
            if(direction === "W"){
                y--;
            }else if(direction === "A"){
                x--;
            }else if(direction === "S"){
                y++;
            }else if(direction === "D"){
                x++;
            }
        };
        //Continues to move around the board until either a win condition is met, or the field is found invalid
        while(valid === undefined){
            move(decideDirection());
        }
        return valid;
    };

    //Generates a valid Field object and returns it.
    //While loop is used to avoid a recursive function that could reach a callstack overflow error.
    static generateValidField(x, y, holes){
        let validField;
        let valid = false;
        while(!valid){
            validField = Field.generateRandomField(x,y,holes);
            valid = Field.validateField(validField);
        }
        return validField;
    };

    //Creates an array of objects containing all possible x,y coordinates.
    static createPossibleCoordinatesArray(x,y){
        let possibleXCoordinates = Array.from(Array(x).keys());
        let possibleYCoordinates = Array.from(Array(y).keys());
        let possibleCoordinates = [];
        
        for(let xCoordinate of possibleXCoordinates){
            for(let yCoordinate of possibleYCoordinates){
                possibleCoordinates.push({x:xCoordinate, y:yCoordinate});
            }
        }
        return possibleCoordinates;
    };

    //Creates the play field that will be logged to the console with objective and holes hidden.
    static createPlayField(hiddenFieldArray){
        let playField = [];
        let rows = hiddenFieldArray.length;
        let columns = hiddenFieldArray[0].length;
        for(let i = 0; i < rows; i++){
            let row = [];
            for(let i = 0; i < columns; i++){
                row.push(grass);
            }
            playField.push(row);
        }
        playField[0][0] = avatar;
        return playField;
    };

    //Prints the field that will be displayed with objective and holes hidden (useful for debugging).
    drawPlayField(){
        console.log(draw.arrayToString(this.playField))
    };

    //Prints the actual field with holes and objective revealed (useful for debugging).
    drawHiddenField(){
        console.log(draw.arrayToString(this.hiddenField))
    };

    //Resets the playField back to it's original state after being altered during gameplay.        
    resetPlayField(){
        this.playField = Field.createPlayField(this.hiddenField);
    };

    //Helper method that checks if a move will move out of bounds and returns true if so.
    isOutOfBounds(x,y){
        if(y < 0 || y > (this.hiddenField.length-1)){
            return true;
        }else if(x < 0 || x > (this.hiddenField[0].length-1)){
            return true;
        }else{
            return false;
        }
    };

    //Returns true if coordinates are a hole, else returns false
    isHole(x,y){
        if(this.hiddenField[y][x] === hole){
            return true;
        }
        return false;
    }

    //Returns true if coordinates are a hat, else returns false
    isHat(x,y){
        if(this.hiddenField[y][x] === hat){
            return true;
        }
        return false;
    };
};


//Contains all the prompts used within the game logic.
//****perhaps change dialog names to match the prompt names */
let prompts = {    

    //Used for obtaining a username. Allows only alphanumeric characters up to 15 long.
    //****need to test */
    formattedNamePrompt(){
        let answer = readlineSync.prompt()
        if(/^[a-zA-Z0-9]{1,15}$/.test(answer)){
            return answer;
        }else{
            return false;
        }     
    },

    formattedPrompt(options){
        let answer = readlineSync.keyInSelect(options, "", {guide: false, cancel: false, hideEchoBack: true, mask: ""})
            return options[answer].toLowerCase();
    },

    // Works for instant input, not great for movement as it flashes
    // formattedDirectionPrompt(){
    //     let answer = readlineSync.keyIn('', {hideEchoBack: true, mask: ''})
    //     if(/^[a-zA-Z0-9]{1}$/.test(answer)){
    //         return answer.toUpperCase();
    //     }else{
    //         return false;
    //     }
    // },

    //The argument linesToKeep controls how many lines will NOT be cleared.  This is necessary as this prompt may at times be used with multi-line dialogs.
    //*This is better as it isnt regressive, neither works for long wrong inputs though. This could also still use the clearoptions method too
    //*Make sure to use while loops to remove recursiveness
    //***invalids not working now */
    next(){
        return this.formattedPrompt(["Next", "Exit"]);   
    },

    mainMenu(){
        return this.formattedPrompt(["Play a game", "Check your Stats", "Exit"])
    },

    mood(){
        return this.formattedPrompt(["Bad", "Okay", "Good", "Exit"])
    },

    //Asks the user if they would like to play again on the same field. Then asks if they are ready. Returns Y or N.
    tryAgain(){
        return this.formattedPrompt(["Try again", "Exit"])
    },

    //*****for symetry add logic for exit here!
    difficulty(){
        return this.formattedPrompt(["Easy", "Medium", "Hard"]) 
    },

        //Prompts the user for direction input and returns it. If input is invalid it will ask again.
    //*Can this also be a switch?
    direction(){
        let direction = this.formattedDirectionPrompt();
        if(direction==="W"){
            return "W";
        }else if(direction==="A"){
            return "A";
        }else if(direction==="S"){
            return "S";
        }else if(direction==="D"){
            return "D";
        //Returns undefined if a key other than WASD is pressed
        }else{
            return undefined;
        }
    },

};

 //Dialog object used by prompt and game objects
 //If updating dialogs to contain more or less lines, make sure to change the next that follows in interface is updated to save the correct number of lines
 //**Is it possible to have the dialogs return a number that is used in next so that it only has to be changed in one place? then use next(dialogs.someDialog) */
 //********if dialogs start with console.clear, can I leave it out of interface almost completely? */
 let dialogs = {
    //Used to randomly select one of the options and log it to the console.
    randomSelector(options){
        console.log(options[Math.floor(Math.random() * (options.length))]);
    },

    hello(){
        let options = ["Hello? Hello?! Who's there?!"];
        this.randomSelector(options);
    },
    name(){
        console.log("So, what did you say your name was?");
    },

    returningPlayer(){
        let name = mainInterface.player.name;
        let options = [
            `Oh ${name}, you gave me quite the fright!`, 
            `Yikes ${name}, you startled me!`, 
            `Ah ${name}, long time no see!`
        ];
        this.randomSelector(options);
    },

    newPlayer(){
        let name = mainInterface.player.name;
        console.log(`Why ${name}, I don't believe I've had the pleasure. It's very nice to meet you!`);
    },

    howAreYou(){
        console.log("How are you?");
    },
    
    unspportedString(){
        console.log("I'm sorry please only use up to 15 numbers and letters...It's just easier for me to remember that way.");
    },

    mainMenu(){
        console.log("What would you like to do now?");
    },

    intro(){
        console.log(
`Thankfully the tornado missed your home town, 
but the winds were still strong, and you lost your hat!
I'm sure it's somewhere in that field over there though! 
You can use W, A, S, D to move around and look for it.`
        );
    },

    win(){
        let options = ["Woah, you did it! You found your hat! To be honest...I didn't see that coming.", "Congratulations, that was pretty decent!"];
        this.randomSelector(options);
    },

    loseFirst(){
        console.log("Oops, you fell in a hole!\nDid I forget to mention that there were holes?\nAlright, that one's on me.");
    },

    lose(){
        let options = [
            "Oh, you fell in a hole...again.", 
            "Oops, there's another hole.", 
            "The main strategy is to NOT fall in the holes.", 
            "Soooo...that was a hole.", 
            "You're good at...faling in holes."
        ];
        this.randomSelector(options);
    },

    tryAgain(){
        let options = ["What would you like to do now?"];
        this.randomSelector(options);
    },

    goodbye(){
        let options = [
            "I'm really sorry to hear that. I'm going to miss you. Goodbye.",
            "It's so lonely without you. I hope you come back soon. Goodbye."
        ];
        this.randomSelector(options);
    },

    excitedConfirmation(){
        let options = [
            "That's great to hear, I'm excited for you!",
            "You just made me so happy!",
            "This is going to be so fun!",
            "Now that's what I like to hear!",
            "I knew you had it in you!",
            "This is the best day ever!",
            "That's really fantastic!" 
    ];
        this.randomSelector(options);
    },

    difficulty(){
        console.log("What difficulty would you like to play?");
    },

    easy(){
        let options = ["Alright, this should be a cinch!"];
        this.randomSelector(options);
    },

    medium(){
        let options = ["A noble selection."];
        this.randomSelector(options);
    },

    hard(){
        let options = ["Yikes, I really hope you make it out alive!"];
        this.randomSelector(options);
    }
};
//***NEXT print play field can be a helper method in the create frame method. Print play field can take an x and y argument to position it from top left to bottom right, it can be done using " " */
//**NEXT make a method to draw the frame, this will incorporate a modified version of the drawPlayField which before printing adds spaces for margin unless there is a character other than space, then it adds that character to the final array */
//***NEXT but should keep print playField method as it could be good for testing functionality and debugging */
//***change name to application
//***Should reset terminal to normal state, stdin resume, cursor on, what else? is there a way to just reset to total noralm? clear the entire cache? */
//Should be a game loop consisting of update and draw (draw playing the frames, update preparing the frame if there was user input and changing animations etc). draw could be reused for the tornado intro */
//****Maybe I should call functions prompt handlers? */
//**Rename to application? */
let mainInterface = {
    player: undefined,
    //Contains a list of all local players.
    players: undefined,
    //Used to quickly access the player to update stats.
    playerIndex: undefined,
    field: undefined,
    game: undefined,

    //Begins dialog with the user.
    begin(){
        //Checks if a local player log exists and creates one if not.
        if(!fs.existsSync("./players.json")){
            fs.writeFileSync("./players.json", JSON.stringify([]));
        };

        //Loads the player list
        this.players = require("./players.json");

        //Increments totalMoves, updates the current game, and writes to playersJSON
        //Creates a handler for moves and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let moveHandler = function(){
            //Increment stats and updates the playerJSON.
            this.game.gameStats.moves ++;
            this.player.games.splice(-1, 1, {stats: this.game.gameStats, field: this.game.field.hiddenField});
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("move", moveHandler);

        //Increments the game attempts stat and writes to playersJSON.
        //Prevents player from force quitting to avoid an attempt stat.
        //Creates a handler for attempts and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let attemptHandler = function(){
            this.game.gameStats.attempts ++;
            this.player.games.splice(-1, 1, {stats: this.game.gameStats, field: this.game.field.hiddenField});
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("attempt", attemptHandler);

        //Increments the game days stat and writes to playersJSON.
        //Prevents player from force quitting to avoid a day stat.
        //Creates a handler for days and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let dayHandler = function(){
            this.game.gameStats.days ++;
            this.player.games.splice(-1, 1, {stats: this.game.gameStats, field: this.game.field.hiddenField});
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("day", dayHandler);


        //Creates a handler for wins and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let winHandler = function(){            
            //Updates player object's total stats and writes to JSON. Marks the game as solved, increments the wins, and updates the attempts/moves from the game object.
            this.player.stats[this.game.difficulty].unsolved --;
            this.player.stats[this.game.difficulty].wins ++;
            this.player.stats[this.game.difficulty].totalAttemptsToWin += this.game.gameStats.attempts;
            this.player.stats[this.game.difficulty].totalDaysToWin += this.game.gameStats.days;
            this.player.stats[this.game.difficulty].totalMovesToWin += this.game.gameStats.moves;
            this.updatePlayersJSON();
            
            //Begins dialog and options.
            dialogs.win();
            this.next();

            //Resets the current field and game.
            //****After changing the prompts to not need field dimensions, move these to before the dialogs above it, or into win handler
            this.field = undefined;
            this.game = undefined;

            this.mainMenu();
        }.bind(this);
        eventEmitter.on("win", winHandler);

        //Creates a handler for losses and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let lossHandler = function(){
            //Initiates dialog, options, and logic for the first ever loss by the player.
            if(this.player.firstLoss === false){
                dialogs.loseFirst();
                this.player.firstLoss = true;
                this.updatePlayersJSON();
                this.next();
                this.lossMenu();

            //Initiates dialog, options, and logic for the all subsequent losses by the player.
            }else{
                dialogs.lose();
                this.next();
                this.lossMenu();
            }
        }.bind(this);
        eventEmitter.on("loss", lossHandler);

        //Begins Dialog and options.
        console.clear();
        this.setPlayer();
        hideCursor();
        this.next();
        this.mainMenu();
    },

    //Presents the main menu and handles the player's response.
    mainMenu(){
        console.clear();
        dialogs.mainMenu();
        let answer = prompts.mainMenu();
        console.clear();
        if(answer === "play a game"){  
            dialogs.excitedConfirmation();
            this.next();
            console.clear();
            dialogs.intro();
            this.next();
            this.setFieldAndGame();
            this.startGame();
        }else if(answer === "view your stats"){
//**********add logic here to show stats */

        }else if(answer === "exit"){
            this.exit();
        }
    },

    //Presents the loss menu and handles the player's response.
    //**Add option for a new field here and make a new a new instance of Game
    //**Add option for stats */
    lossMenu(){
        console.clear();
        dialogs.tryAgain();
        let answer = prompts.tryAgain();
        if(answer === "try again"){
            console.clear();
            dialogs.excitedConfirmation();
            this.next();
            this.restartGame();
        }else if(answer === "exit"){
            this.exit(); 
        }
    },
    
    setPlayer(){
        dialogs.hello();
        //Prompts player to enter their name.
        let name = prompts.formattedNamePrompt();;
        //Runs until a valid name is entered.
        while(!name){
            console.clear();
            dialogs.unspportedString();
            dialogs.name();
            name = prompts.formattedNamePrompt();
        }
        console.clear();
        if(name){
            if(this.loadPlayer(name)){
                dialogs.returningPlayer();
            }else{
                dialogs.newPlayer();
            }
            //Sets the playerIndex.
            this.playerIndex = this.players.findIndex(player =>  player.name === this.player.name);
        }
    },
    
    // Loads player object and creates one if the player is new.
    loadPlayer(name){
        //Checks if the player already exists, and loads the player info if so.
        for(let player of this.players){
            if(name === player.name){
                this.player = player;
                return true;
            }
        }
        //If player does not exist, creates a new player, adds it to the list of players, and updates the JSON file.
        this.player = new Player(name);
        this.players.push(this.player);
        this.updatePlayersJSON();
        return false;
    },

    //Update the players JSON with the most recent player stats.
    updatePlayersJSON(){
        this.players[this.playerIndex] = this.player;
        fs.writeFileSync("./players.json", JSON.stringify(this.players));
    },

    //Helper method that sets the current field and game objects.
    setFieldAndGame(){
        //Generates a valid field and game based on difficulty. Difficulty settings can be tweaked here.
        //*****should generateValidField take in fieldDimensions.x and .y instead, makes changing difficulty in the future easier. Or is there a way to define difficulty somewhere outside of this as an interface property? */
        //*like this.difficulty: {easy{x:3, y:3, holes: 2}}  Field.generateValidField(this[this.game.difficulty].x, this[this.game.difficulty].y, this[this.game.difficulty].y)
        //*If changing difficulty, also need to change the next prompt in startGame, so it removes the proper amount of lines
        console.clear();
        dialogs.difficulty();
        let difficulty = prompts.difficulty();
        this.field = Field.generateValidField(settings[difficulty].fieldSettings.dimensions.x, settings[difficulty].fieldSettings.dimensions.y,settings[difficulty].fieldSettings.holes)
        this.game = new Game (difficulty, this.field)
        // if(difficulty){
        //     switch(difficulty){
        //         case "Easy":
        //             this.field = Field.generateValidField(3,3,2);
        //             this.game = new Game("Easy", this.field);
        //             break;
        //         case "Medium":
        //             this.field = Field.generateValidField(5,5,6);
        //             this.game = new Game("Medium", this.field);
        //             break;
        //         case "Hard": 
        //             this.field = Field.generateValidField(7,7,11);
        //             this.game = new Game("Hard", this.field);
        //             break;
        //     };
        // }
    },

    //Starts the game.
    startGame(){ 
        //Increments the unsolved player stat while the game is being played, records the unsolved game, and writes to playersJSON.
        //Prevents player from force quitting to avoid an unsolved stat. Will be removed on win.
        this.player.stats[this.game.difficulty].unsolved ++;
        this.player.games.push({stats: this.game.gameStats, field: this.game.field.hiddenField});
        this.updatePlayersJSON();
        
        //Calls the game logic.
        this.game.playGame();
    },

    //Resets and restarts the game.
    restartGame(){
        //Resets the play field to blank.
        this.game.field.resetPlayField();
        this.game.assets.field.frame1 = this.game.field.playField

        //Calls the game logic.
        this.game.playGame();
    },

    //Standard next options to advance to the next dialog or exit.
    next(){
        let answer = prompts.next();
        if(answer === "next"){
            return;
        }else if(answer === "exit"){
            this.exit();
        }
    },
    
    //Used to say goodbye and close the application.
    exit(){
        console.clear();
        dialogs.goodbye();
        
        //Resets terminal settings and exits.
        process.stdin.resume();
        showCursor();
        process.exit();
    }
}




//Draws an array in the console.  Offsets the top left corner of the array from the top left corner of the terminal.
//Offset entered as an object containing x and y keys and their respective offsets.
//**causes flicker */
// let draw = function(array, offset={x:0, y:0}){
//     let x = offset.x
//     let y = offset.y
//     for(let row of array){
//         readline.cursorTo(process.stdout, x, y)
//         y++
//         for(let column of row){
//             process.stdout.write(column)
//         }
//     }  
// };

let draw = {
    //**Margins and empty space in the arrays should be 'blank' as this will essentially create sprites with transparent backgrounds that can be layered */
    //**change asset arrays to have 'blank' instead of ' ' for empty space (i.e. not the walls) */
    //Takes an array of array sprites to composite into a single frame.
    //The first array will be the top layer, while the final array will be the bottom layer.
    //Dimensions arg should be an object such as {x:, y:}. Anything outside of those dimensions will not be drawn.
    //Default dimensions are the longest x and the longest y dimensions present in the array of sprites.
    createFrame: function(arrays, dimensions){
        let frame = [];
        let xDimension = 0;
        let yDimension = 0;
        //Sets the frame's dimensions to the dimensions arg if one was given.
        if(dimensions !== undefined){
            xDimension = dimensions.x;
            yDimension = dimensions.y;
        }
        //Sets the frame's dimensions in case no dimensions arg was given.
        if(dimensions === undefined){
            //Finds the array with the most columns and sets the dimension.
            for(let array of arrays){
                for(let row of array){
                    if(row.length > xDimension){
                        xDimension = row.length;
                    }
                }
            }
            //Finds the array with the most rows and sets the dimension.
            for(let array of arrays){
                if(array.length > yDimension){
                    yDimension = array.length;
                }
            }
        }

        //Uses the dimensions to build a blank frame filled with spaces.
        for(let y = yDimension; y > 0; y--){
            let row = [];
            for(let x = xDimension; x >0; x--){
                row.push('blank');
            }
            frame.push(row);
        }
        //Populates the frame with assets only on 'blank' spots, allowing for layering.
        for(let array of arrays){
            //Used to track which x,y location the loop is at so characters can be added if the location in the final frame is 'blank'.
            let yIndex = 0;
            let xIndex = 0;
            //Loops through the sprite.
            for(let [i, row] of array.entries()){
                //Checks if the character is to be drawn within the set y dimension of the frame.
                if(i < yDimension){
                    for(let [i, character] of row.entries()){
                        //Checks if the character is to be drawn within the set x dimension of the frame.
                        if(i < xDimension){
                            //If the x,y location is blank, adds the character.
                            if(frame[yIndex][xIndex] === 'blank'){
                                frame[yIndex][xIndex] = character;
                            }
                            //Increments xIndex to start the next column.
                            xIndex++;
                        }
                    }
                }
                //Resets xIndex for the next row and increments yIndex to replace characters in the next row.
                xIndex = 0;
                //Increments the yIndex to start the next row.
                yIndex++;
            }
        }
        //Replaces 'blank' with ' ' for drawing to terminal.
        for(let array of frame){
            for(let character of array){
                if(character === 'blank'){
                    array[array.indexOf(character)] = ' ';  
                }
            }
        }
        return frame;
    },

    //Used to create a string from the frame array.
    arrayToString: function(array){
        let string = ``;   
        for(let row of array){
            for(let character of row){
                string+=character;
            }
            string += '\n';
        }
        return string;
    },
    //Can be used to convert string art to an array for drawing. 
    //Create a multi line string with String.raw` and begin on the next line. This is important especially if the asset includes backslashes which would normall escape.
    stringToArray: function(string){
        let array = [];
        for(let row of string.split('\n')){
            let rowArray = [];
            for(let character of row){
                rowArray.push(character);
            }
            array.push(rowArray);
        }
        array.shift();
        return JSON.stringify(array);
    },
    //Adds 'blank' margins to possition a sprite correctly in the frame.
    //Offset argument is an object such as {x:0, y:0}.
    //Moves the top left corner of the sprite from the top left of the frame according to the offset.
    possitionSprite(array, offset){
        //Creates a copy of the array to add margins to while leaving the original asset intact.
        let possitionedSprite = [];
        for(let row of array){
            let rowCopy = [];
            for(let character of row){
                rowCopy.push(character);   
            }
            possitionedSprite.push(rowCopy);
        }
        //Adds a blank margin to the top to move the sprite down according to the offset.
        for(let y = offset.y; y>0; y--){
            possitionedSprite.unshift(['blank']);
        }
        //Adds a blank margin to the left side to move the sprite right according to the offset.
        for(let row of possitionedSprite){
            for(let x = offset.x; x>0; x--){
                row.unshift('blank');
            }
        }
        return possitionedSprite;
    },

    //Colors a sprite. Color should be supplied as a string escape sequence such as "\x1b[31m"
    //A helpful list of colors can be found here. https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
    //Simply replace 31 with the number in the FG column. 
    //Adding a 1 will make the color a lighter shade, 2 will make the color a dimmer shade. (\x1b[1;31m)
    colorSprite(array,color){
        //Creates a copy of the array to color while leaving the original asset intact.
        let coloredSprite = [];
        for(let row of array){
            let coloredRow = [];
            for(let character of row){
                if(character !== 'blank'){
                    coloredRow.push(color + character + '\x1b[0m');
                }else{
                    coloredRow.push(character);
                }
                
            }
            coloredSprite.push(coloredRow);
        }
        // coloredSprite.push('\x1b[0m')
        return coloredSprite;
    },

    //Animates an array of multiline strings.
    //Use arrayToString() to convert an array asset to a multi line string.
    //Callback is the function that will run when the animation is complete.
    animate(array, fps, callback){
        let numberOfFrames = array.length;
        let index = 0;
        let animationLoop = function(){
            console.clear();
            console.log(array[index]);
            index++;
            numberOfFrames--;
            if(numberOfFrames === 0){
                clearInterval(animationLoopInterval);
                callback();
            }
        }
        animationLoopInterval = setInterval(animationLoop, 1000/fps);
    }
}




mainInterface.begin();






// let test = new Player("brenden")
// let testArray = []
// testArray.push(test)
// console.log(testArray)

// let testField = Field.generateValidField(5,5,5)

// console.log(testField.hiddenField)

//Starts game with basic field

// let field1 = new Field([
//     [grass, grass, hole, grass, grass, grass],
//     [hole, grass, grass, grass, hole, grass],
//     [hole, hole, hole, hole, grass, grass],
//     [hat, grass, grass, grass, grass, hole]
//   ]);

//   field1.drawHiddenField()

// let game1 = new Game(field1)
// game1.draw(field1.playField, 2, 2)

