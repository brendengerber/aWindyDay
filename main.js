//A simple maze game and interface. 
//Inspired by one of my favorite games growing up: Maze Craze.

//Requires necessary custom modules.
const draw = require('./draw.js')
const assets = require('./assets.js');
const eventEmitter  = require('./eventEmitter.js');
const tornadoAnimation = require('./tornadoAnimation.js')

//Requires necessary modules.
const fs = require('fs');
const readlineSync = require('readline-sync');
const hideCursor = require('hide-terminal-cursor');
const showCursor = require('show-terminal-cursor');
const _ = require('lodash');
const {table} = require('table');

//Sets game characters.
const hat = '^';
const hole = 'O';
const grass = '░';
const path = ' ';
const avatar = '8';

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
    
    //Processes the stats of a player.
    //Stats can be added without affecting createProcessdStatsTable method.
    static processStats(player){
        let processedStats = {};
        for(let difficulty in player.stats){
            processedStats[difficulty] = {
                "Wins": player.stats[difficulty].wins,
                "Unsolved": player.stats[difficulty].unsolved,
                "Average Attempts to Win": (player.stats[difficulty].totalAttemptsToWin / player.stats[difficulty].wins).toFixed(2),
                "Average Moves to Win": (player.stats[difficulty].totalMovesToWin / player.stats[difficulty].wins).toFixed(2),
                "Average Days to Win": (player.stats[difficulty].totalDaysToWin / player.stats[difficulty].wins).toFixed(2)
            }
        }
        return processedStats;
    };

    //Creates a table of all the stats for each difficulty.
    static createProcessedStatsTable(player){
        //Contains the processed stats to parse into a table.
        let stats = Player.processStats(player);   
        //Creates an array from the processedStats object. 
        //The stat arg should be the object prepared by Player.processStats(player).
        let createStatsTableArray = function(stats){
            //Used to create an array which will be filled with each processed stat for each difficulty.
            let statsTable = [[]];
            for(let key in stats.easy){
                statsTable.push([]);
            }
            //Tracks the colums and rows where stats will be entered.
            let column = 0;
            let row = 1;
            //Parses the stats object and enters them into the array where appropriate to display the difficulties horizontally.
            for(let difficulty in stats){
                statsTable[0].push(difficulty.toUpperCase());
                statsTable[0].push(' ');
                for(let [stat, value] of Object.entries(stats[difficulty])){
                    statsTable[row][column] = stat;
                    //Checks if there is a stat recorded or not.
                    if(value === 'NaN'){
                        statsTable[row][column+1] = "None"
                    }else{
                        statsTable[row][column+1] = value;
                    }
                    row++;
                }
                column ++;
                column ++;
                row = 1;
            }
            return statsTable;
        };        
        //Config object for logging the table of stats.
        const config = {
            spanningCells: [
              { col: 0, row: 0, colSpan: 2, alignment: 'center'},
              { col: 2, row: 0, colSpan: 2, alignment: 'center'},
              { col: 4, row: 0, colSpan: 2, alignment: 'center'}
            ],
            header: {alignment: 'center', content: `${player.name}'s Stats`}
          };
        return table(createStatsTableArray(stats), config);
    }
};

//Sets difficulty settings and default settings.
//Balancing and tweaks can be done here.
let settings = {
    //Sets the dimensions of the frame.
    frameDimensions: {x:55, y:23},
    //Used to set the number of holes and field dimensions for each difficulty level as well as states dependent on difficulty.
    easy: {
        fieldSettings:{
            holes: 3, 
            dimensions:{x:6, y:3}
        }, 
        states:{
            fieldAsset:{
                offset: {x:16, y:14},
            },
            fence: {
                offset: {x:14, y: 13}
            }  
        }
    },
    medium: {
        fieldSettings:{
            holes: 7, 
            dimensions:{x:8, y:5}
        }, 
        states:{
            fieldAsset: {
                offset: {x:15, y:14}
            },
            fence: {
                offset: {x:13, y:13}
            }  
        }
    },
    hard: {
        fieldSettings:{
            holes: 15, 
            dimensions:{x:12, y:8}
        }, 
        states:{
            fieldAsset:{
                offset: {x:13, y:14}
            },
            fence: {
                offset: {x:11, y:13}
            }  
        }
    },
    //Sets the default states not dependent on difficulty.
    initialStates: {
        fieldAsset: {
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
            offset: {x:24, y:3}
        },
        //The initialOffset property is used to reset the cloud after a full pass. Should be the same as offset.
        cloud:{
            draw: true,
            frame: 1,
            offset: {x:55, y:3},
            initialOffset: {x:55, y:3},
            color: '\x1b[97m',
            counter: 0
        },
        house:{
            draw: true,
            frame: 1,
            offset: {x:13, y:7},
            counter: 0
        },
        star1: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:11, y:5},
            counter: 0 
        },
        star2: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:28, y:1},
            counter: 0
        },
        star3: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:20, y:7},
            counter: 0
        },
        star4: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:7, y:9},
            counter: 0
        },
        star5: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:11, y:1},
            counter: 0
        },
        star6: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:4, y:3},
            counter: 0
        },
        star7: {
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:21, y:4},
            counter: 0
        },
        star8:{
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:41, y:2},
            counter: 0
        },        
        star9:{
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:49, y:1},
            counter: 0
        },
        star10:{
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:46, y:6},
            counter: 0
        },
        star11:{
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:52, y:7},
            counter: 0
        },
        star12:{
            draw: false,
            color: '\x1b[97m',
            frame: 1,
            offset: {x:45, y:10},
            counter: 0
        },
        horizon: {
            draw: true,
            frame: 1,
            offset: {x:0, y:11}
        },
        //The initialOffset property is used to reset the body after a full arch. Should be the same as offset.
        celestialBody: {
            draw: true,
            frame: 1,
            offset: {x:1, y:10},
            initialOffset: {x:1, y:10},
            counter: 0,
            steps: 0,
            direction: 'rise'
        },
        grass: {
            draw: true,
            frame: 1,
            offset: {x:2, y:13}
        },
        time: {
            current: 'day'
        },
    }
};

//Contains game logic.
class Game{
    constructor(difficulty, field){
        this._difficulty = difficulty;
        this._field = field;
        //Sets the state from settings object based on difficulty level.
        //Empty object is filled with settings thus leaving the original settings object in tact.
        this._state =  _.merge({}, settings.initialStates, settings[difficulty].states)
        //Adds fieldAsset.
        this.assets.fieldAsset = new assets.FieldAsset(this.field)
        //Adds a fence that fits the field to assets.
        this.assets.fence = new assets.Fence(this.assets.fieldAsset.frame1[0].length, this.assets.fieldAsset.frame1.length)
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
    assets = {
        celestialBody: new assets.CelestialBody(),
        tree: new assets.Tree(),
        house: new assets.House(30),
        star1: new assets.Star(360, 2),
        star2: new assets.Star(400, 2),
        star3: new assets.Star(120, 2),
        star4: new assets.Star(160, 2),
        star5: new assets.Star(200, 2),
        star6: new assets.Star(440, 2),
        star7: new assets.Star(280, 2),
        star8: new assets.Star(320, 2),
        star9: new assets.Star(40, 2),
        star10: new assets.Star(80, 2),
        star11: new assets.Star(480, 2),
        star12: new assets.Star(240, 2),
        horizon: new assets.Horizon(settings.frameDimensions.x),
        grass: new assets.Grass(),
        cloud: new assets.Cloud(settings.frameDimensions.x)
    };

    //Contains game logic.
    playGame(){
        console.clear();
        let gameOver = false;
        let location = {x:0, y:0}
        let newLocation = {x:0, y:0};
        let outcome;
        eventEmitter.emit("attempt");
        eventEmitter.emit("day");

        //Checks if the move is out of bounds or contains a hat or hole.
        //Returns the checked status of the space.
        let checkMove = function(){
            if(!this.field.isOutOfBounds(newLocation.x, newLocation.y)){
                if(!this.field.isHole(newLocation.x, newLocation.y) && !this.field.isHat(newLocation.x, newLocation.y)){
                    return "empty";
                }else if(this.field.isHole(newLocation.x, newLocation.y)){
                    return "hole";
                }else if(this.field.isHat(newLocation.x, newLocation.y)){
                    return "hat";                        
                }                   
            }
            return "outOfBounds";
        }.bind(this)

        //Updates the location/newLocation and processes wins and losses based on the checked move.
        //The move arg should be a value returned by checkMove.
        let updateMove = function(move){
            switch(move){
                case "empty":
                    eventEmitter.emit("move");
                    this.field.playField[location.y][location.x] = path;
                    this.field.playField[newLocation.y][newLocation.x] = avatar;
                    location.x = newLocation.x; 
                    location.y = newLocation.y;                      
                    break;
                case "hole":
                    eventEmitter.emit("move");
                    this.field.playField[location.y][location.x] = path;
                    this.field.playField[newLocation.y][newLocation.x] = hole;
                    gameOver = true;
                    lose();
                    break
                case "hat":
                    eventEmitter.emit("move");
                    this.field.playField[location.y][location.x] = path;
                    this.field.playField[newLocation.y][newLocation.x] = hat;
                    gameOver = true;
                    win();
                    break;
                case "outOfBounds":
                    newLocation.x = location.x;
                    newLocation.y = location.y;
                    break;
            }
        }.bind(this)

        //Processes user move input based on what key is pressed. 
        let moveHandler = function(key){
            let direction = key.toUpperCase();
            switch(direction){
                case "W":  
                    newLocation.x = location.x;
                    newLocation.y = location.y - 1;
                    updateMove(checkMove());
                    break;  
                case "A":  
                    newLocation.x = location.x - 1;
                    newLocation.y = location.y;
                    updateMove(checkMove());
                    break;
                case "S":
                    newLocation.x =  location.x;
                    newLocation.y = location.y + 1; 
                    updateMove(checkMove());
                    break;
                case "D":   
                    newLocation.x = location.x + 1;
                    newLocation.y = location.y;    
                    updateMove(checkMove());
                    break;
                };
        }.bind(this);

        //Resumes stdin since readlineSync pauses it when run.
        process.stdin.resume();
        //Sets raw mode to read keystrokes without pressing enter.
        process.stdin.setRawMode(true);
        //Sets encoding.
        process.stdin.setEncoding( 'utf8' );
        //Turns on the move listener and calls moveHandler to handle player movements.
        process.stdin.on( 'data', moveHandler);

        //Used upon loss to display the final field, reset the state object for next try, addresses stats, and emits a loss event.
        let lose = function(){
            console.clear();
            drawCurrentFrame()
            //Resets the state property.
            this._state = _.merge({}, settings.frameDimensions, settings.initialStates, settings[this.difficulty].states);
            this.gameStats.win = false;
            eventEmitter.emit("loss");
            outcome = "loss";
        }.bind(this);

        //Used upon win to display the final field, address stats, and emit a win event.
        let win = function(){
            console.clear();
            drawCurrentFrame();
            this.gameStats.win = true;
            eventEmitter.emit("win");
            outcome = "win";
        }.bind(this);

        //Update function used by the main game loop.
        //Loops through all of the assets and updates the state object if the asset has an update method.
        let updateAssetStates = function(){
            for(let asset in this.assets){
                //Checks that the object has an update method and runs it if so.
                if(this.assets[asset].update){
                    this.assets[asset].update(asset, this.state);
                }
            }
        }.bind(this);
        
        //Draw function used by the main game loop.
        //Creates the current frame by compositing all of the assets into a single frame, and then draws the frame. 
        //Loops through all assets and calls draw.possitionSprite() and draw.color() eliminating the need for individual asset draw methods.
        let drawCurrentFrame = function(){
            let frameAssets = [];
            //Loops through all assets present in state.
            //The first asset listed in state will be the top layer and the following assets will be drawn under the top layer in decending order.
            for(let key of Object.keys(this.state)){
                //Checks if current asset should be drawn, processes position and color if so, and adds it to the array to composite.
                if(this.state[key].draw){
                    //Possitions the sprite.
                    let possitionedColoredArray = draw.possitionSprite(this.assets[key]["frame"+this.state[key].frame], this.state[key].offset, settings.frameDimensions);
                    //Colors the array if necessary.
                    if(this.state[key].color){
                        possitionedColoredArray = draw.colorSprite(possitionedColoredArray, this.state[key].color);
                    }
                    frameAssets.push(possitionedColoredArray);
                }
            }
            //Creates the composited frame.
            let frameArray = draw.createFrame(frameAssets, settings.frameDimensions);
            //Transforms the frame array to a string and logs it.
            let frameString = draw.arrayToString(frameArray);
            console.log(frameString);
        }.bind(this);

        //Begins the main game loop.
        //Checks game status and then updates/draws frames or ends mainLoop.
        let mainLoop = function(){
            console.clear();
            if(!gameOver){
                //Updates states.
                updateAssetStates();
                //Draws the current frame.
                drawCurrentFrame();
            }
            if(gameOver){
                //Stops rendering the frames.
                clearInterval(mainLoopInterval);
                //Turns off the move listener.
                process.stdin.removeListener('data', moveHandler);
                //Returns outcome of the game.
                return outcome;
            }
        }.bind(this);

        //Sets the framerate and draws the frame.
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
    };

    //Creates a random field of size x by y containing the provided number of holes with a random distribution accross the board.
    static generateRandomField(x,y,holes){
        //Creates a blank field filled with grass according to the given dimensions.
        let newHiddenFieldArray = [];
        for(let i=0; i<y; i++){
            let newRow = [];
            for(let i=0; i<x; i++){
                newRow.push(grass);
            }
            newHiddenFieldArray.push(newRow);
        }

        //Adds holes, if there is already a hole in the random spot then the function runs again. 
        //This allows adding holes randomly throughout the field rather than having them clustered at the beginning if a simple loop was used to add randomly grass or hole characters until the desired number of holes was reached.
        let setHole = function(possibleCoordinatesArray){
            //Selects a random x and y coordinate from the array of available coordinates.
            let testCoordinates = possibleCoordinatesArray[Math.floor(Math.random() * (possibleCoordinatesArray.length))]
            //Sets the coordinates for the location on the field.
            let xCoordinate = testCoordinates.x;
            let yCoordinate = testCoordinates.y;
            //Sets the index where the test coordinates are in possibleCoordinatesArray.
            //This will be used later in the event that the coordinates are not grass to remove them from the array passed to the next recursive call.
            let coordinatesIndex = possibleCoordinatesArray.findIndex(coordinates =>  coordinates.x === testCoordinates.x && coordinates.y === testCoordinates.y);
            //Runs setHat again if the random possition is not available.
            if(newHiddenFieldArray[yCoordinate][xCoordinate] !== grass){
                //Removes x and y coordinates if they are not grass in order to prevent a callstack overflow error in edge cases.
                possibleCoordinatesArray.splice(coordinatesIndex, 1);
                setHole(possibleCoordinatesArray);
            //Sets the hole possition.
            }else{
                newHiddenFieldArray[yCoordinate][xCoordinate] = hole;
            }
        }
    
        //Adds the hat, if there is a hole in the randomly selected location then the function will run again with the location removed from possible locations.
        //A recursive function is used and unsuitable location are removed when encountered to avoid a callstack overflow error.
        let setHat = function(possibleCoordinatesArray){
            //Selects a random x and y coordinate from the array of available coordinates.
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
    
        //Runs setHole() until the desired number of holes is reached and then runs setHat().
        let setHatAndHoles = function(holes){
            for(let i=0; i<holes; i++){
                setHole(Field.createPossibleCoordinatesArray(x,y));
            }
            setHat(Field.createPossibleCoordinatesArray(x,y));
        }
        setHatAndHoles(holes);
        return new Field(newHiddenFieldArray);
    };
    
    //Validates a field object and returns true if it is winnable and false if it is not.
    static validateField(testField){
        let x = 0;
        let y = 0;
        let valid = undefined;
        //Creates an array to test containing 0s in place of path characters. These will be used to count crumbs while traversing the maze.
        let testFieldArray = testField.hiddenField.map(row => row.map(column => (column === grass) ? 0 : column));
        //First checks that the starting possition is not a hole or a hat.
        if(testFieldArray[0][0] === hole || testFieldArray[0][0] === hat){
            valid = false;
        }
        //Decides which direction to move based on the crumbs present at adjacent spaces.
        //Sets valid to true or false if the hat is found or all adjacent paths have 2 crumbs/holes.
        let decideDirection = function(){
            //Finds values for crumbs dropped on adjacent moves.
            //Uses optional chaining operators to prevent out of bounds moves from throwing runtime errors. They will now return undefined. 
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
            //There is no need to check for holes or out of bounds as they will resolve to false when compared to the crumb numbers within the conditional statements.
            //The maximum number of acceptible crumbs is 3 which allows to account for dead ends.
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

        //Adds crumbs to the intersection and moves to the next possition.
        let move = function(direction){
            testFieldArray[y][x]++;
            switch(direction){
                case "W":
                    y--;
                    break
                case "A":
                    x--;
                    break
                case "S":
                    y++;
                    break
                case "D":
                    x++;
                    break 
            }
        };
        //Continues to move around the board until either a win condition is met, or the field is found invalid.
        while(valid === undefined){
            move(decideDirection());
        }
        return valid;
    };

    //Generates a valid Field object and returns it.
    //Dimensions arg should be an object such as {x:1, y:1}. 
    //While loop is used to avoid a recursive function that could reach a callstack overflow error.
    static generateValidField(dimensions, holes){
        let validField;
        let valid = false;
        while(!valid){
            validField = Field.generateRandomField(dimensions.x, dimensions.y, holes);
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
        console.log(draw.arrayToString(this.playField));
    };

    //Prints the actual field with holes and objective revealed (useful for debugging).
    drawHiddenField(){
        console.log(draw.arrayToString(this.hiddenField));
    };

    //Resets the playField back to it's original state after being altered during gameplay.        
    resetPlayField(){
        this.playField = Field.createPlayField(this.hiddenField);
    };

    //Checks if a move will move out of bounds and returns true if so.
    isOutOfBounds(x,y){
        if(y < 0 || y > (this.hiddenField.length-1)){
            return true;
        }else if(x < 0 || x > (this.hiddenField[0].length-1)){
            return true;
        }else{
            return false;
        }
    };

    //Returns true if coordinates are a hole, else returns false.
    isHole(x,y){
        if(this.hiddenField[y][x] === hole){
            return true;
        }
        return false;
    }

    //Returns true if coordinates are a hat, else returns false.
    isHat(x,y){
        if(this.hiddenField[y][x] === hat){
            return true;
        }
        return false;
    };
};

//Contains all the prompts used within the game logic.
let prompts = {    
    //Used for obtaining a username. Allows only alphanumeric characters up to 15 long.
    formattedNamePrompt(){
        let answer = readlineSync.prompt()
        if(/^[a-zA-Z0-9]{1,15}$/.test(answer)){
            return answer;
        }else{
            return false;
        }     
    },

    //Used in prompts to obtain user input.
    //Options should be an array of strings. 
    //Selection will be returned in all lower case letters.
    formattedPrompt(options){
        let answer = readlineSync.keyInSelect(options, "", {guide: false, cancel: false, hideEchoBack: true, mask: ""});
            return options[answer].toLowerCase();
    },

    next(){
        return this.formattedPrompt(["Next", "Exit"]);   
    },

    mainMenuFirstGameOfSession(){
        return this.formattedPrompt(["Play a Game", "Check Your Stats", "Exit"]);
    },
    
    mainMenu(){
        return this.formattedPrompt(["Play Again", "Check Your Stats", "Exit"]);
    },

    mood(){
        return this.formattedPrompt(["Bad", "Okay", "Good", "Exit"]);
    },

    tryAgain(){
        return this.formattedPrompt(["Try again", "Check Your Stats", "Exit"]);
    },

    difficulty(){
        return this.formattedPrompt(["Easy", "Medium", "Hard", "Exit"]);
    },
};

 //Dialog object used by prompts.
 let dialogs = {
    //Randomly selects one of the options and log it to the console.
    randomSelector(options){
        console.log(options[Math.floor(Math.random() * (options.length))]);
    },

    hello(){
        console.clear();
        let options = ["Hello? Hello?! Who's there?!"];
        this.randomSelector(options);
    },
    name(){
        console.clear()
        console.log("So, what did you say your name was?");
    },

    returningPlayer(player){
        console.clear();
        let name = player.name;
        let options = [
            `Oh ${name}, you gave me quite the fright!`, 
            `Yikes ${name}, you startled me!`, 
            `Ah ${name}, long time no see!`
        ];
        this.randomSelector(options);
    },

    newPlayer(player){
        console.clear();
        let name = player.name;
        console.log(`Why ${name}, I don't believe I've had the pleasure. It's very nice to meet you!`);
    },

    unspportedString(){
        console.clear();
        console.log("I'm sorry please only use up to 15 numbers and letters...It's just easier for me to remember that way.");
    },

    mainMenu(){
        console.clear();
        console.log("What would you like to do now?");
    },

    intro(){
        console.clear();
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

    firstLoss(){
        console.log("Oops, you fell in a hole! Did I forget to mention that there were holes? Alright, that one's on me.");
    },

    lose(){
        let options = [
            "Oh, you fell in a hole...again.", 
            "Oops, there's another hole.", 
            "The main strategy is to NOT fall in the holes.", 
            "Soooo...that was a hole.",
            "Ouch, that looked like it hurt...maybe try to avoid the holes", 
            "You're good at...faling in holes."
        ];
        this.randomSelector(options);
    },

    tryAgain(){
        console.clear();
        let options = ["What would you like to do now?"];
        this.randomSelector(options);
    },

    goodbye(){
        console.clear()
        let options = [
            "I'm really sorry to hear that. I'm going to miss you. Goodbye.",
            "It's so lonely without you. I hope you come back soon. Goodbye."
        ];
        this.randomSelector(options);
    },

    excitedConfirmation(){
        console.clear();
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
        console.clear();
        console.log("What difficulty would you like to play?");
    },

    difficultyResponse(difficulty){
        console.clear();
        if(difficulty === 'easy'){
            let options = ["Alright, this should be a cinch!"];
            this.randomSelector(options);
        }else if(difficulty === 'medium'){
            let options = ["A noble selection."];
            this.randomSelector(options);
        }else if(difficulty === 'hard'){
            let options = ["Yikes, I really hope you make it out alive!"];
            this.randomSelector(options);
        }
    },

    stats(player){
        console.clear();
        console.log("");
        console.log(Player.createProcessedStatsTable(player));
        let options = [
            "Not too bad, but not quite as good as me.",
            "Not quite as good as me, but I'm sure you're doing your best",
            "That's pretty good. If you keep it up, you might be almost as good as me some day.",
            "Not bad, but you still have a long way to go if you want to be a pro like me."
        ]
        this.randomSelector(options);
    }
};

let mainInterface = {
    player: undefined,
    //Contains a list of all local players.
    players: undefined,
    //Used to quickly access the player to update stats.
    playerIndex: undefined,
    field: undefined,
    game: undefined,
    //Used to skip intro and cutscene after the first time.
    firstGameOfSession: true,

    //Begins dialog with the user.
    begin(){
        //Checks if a local player log exists and creates one if not.
        if(!fs.existsSync("./players.json")){
            fs.writeFileSync("./players.json", JSON.stringify([]));
        };
        //Loads the player list
        this.players = require("./players.json");

        //Used to avoid recursion from mainMenu calling itself.
        let mainMenuHandler = function(){
            mainInterface.mainMenu()
        }.bind(this)
        eventEmitter.on("mainMenu", mainMenuHandler)

        //Used to avoid recursion from lossMenu calling itself.
        let lossMenuHandler = function(){
            mainInterface.lossMenu()
        }.bind(this)
        eventEmitter.on("lossMenu", lossMenuHandler)

        //Increments totalMoves, updates the current game, and writes to playersJSON.
        //Creates a handler for moves and adds it to the eventEmitter.
        let moveHandler = function(){
            this.game.gameStats.moves ++;
            this.updatePlayerGamesWithCurrent();
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("move", moveHandler);

        //Increments the game attempts stat and writes to playersJSON.
        //Prevents player from force quitting to avoid an attempt stat.
        //Creates a handler for attempts and adds it to the eventEmitter.
        let attemptHandler = function(){
            this.game.gameStats.attempts ++;
            this.updatePlayerGamesWithCurrent();
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("attempt", attemptHandler);

        //Increments the game days stat and writes to playersJSON.
        //Prevents player from force quitting to avoid a day stat.
        //Creates a handler for days and adds it to the eventEmitter.
        let dayHandler = function(){
            this.game.gameStats.days ++;
            this.updatePlayerGamesWithCurrent();
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("day", dayHandler);

        //Creates a handler for wins and adds it to the eventEmitter.
        let winHandler = function(){            
            //Updates player object's total stats and writes to JSON. Marks the game as solved, increments the wins, and updates the attempts/moves from the game object.
            this.player.stats[this.game.difficulty].unsolved --;
            this.player.stats[this.game.difficulty].wins ++;
            this.player.stats[this.game.difficulty].totalAttemptsToWin += this.game.gameStats.attempts;
            this.player.stats[this.game.difficulty].totalDaysToWin += this.game.gameStats.days;
            this.player.stats[this.game.difficulty].totalMovesToWin += this.game.gameStats.moves;
            this.updatePlayersJSON();
            //Resets the current field and game.
            this.field = undefined;
            this.game = undefined;
            //Begins dialog and next options.
            dialogs.win();
            this.next();
            this.mainMenu()
        }.bind(this);
        eventEmitter.on("win", winHandler);

        //Creates a handler for losses and adds it to the eventEmitter.
        let lossHandler = function(){
            //Initiates dialog, options, and logic for the first ever loss by the player.
            if(this.player.firstLoss === false){
                dialogs.firstLoss();
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
        this.setPlayer();
        hideCursor();
        this.next();
        this.mainMenu();
    },

    //Presents the main menu and handles the player's response.
    mainMenu(){
        dialogs.mainMenu();
        //Checks which prompt to use based on if it is the first game of the session.
        if(this.firstGameOfSession){
            answer = prompts.mainMenuFirstGameOfSession();
            this.firstGameOfSession = false;
        }else if(!this.firstGameOfSession){
            answer = prompts.mainMenu();
        }
        if(answer === "play a game" || answer === "play again"){ 
            dialogs.excitedConfirmation();
            this.next();
            this.setFieldAndGame();
            dialogs.difficultyResponse(this.game.difficulty);
            this.next();
            //Starts game with animation if it is the first game of the session.
            if(answer === "play a game"){
                dialogs.intro();
                this.next();
                draw.animate(tornadoAnimation, 20, this.startGame.bind(this));
            //Starts game but skips the cutscene animation if it is not the first game of the session.
            }else if(answer === "play again"){
                this.startGame()
            }
        }else if(answer === "check your stats"){
            dialogs.stats(this.player);
            this.next();
            eventEmitter.emit("mainMenu");
        }else if(answer === "exit"){
            this.exit();
        }
    },

    //Presents the loss menu and handles the player's response.
    lossMenu(){
        dialogs.tryAgain();
        let answer = prompts.tryAgain();
        if(answer === "try again"){
            dialogs.excitedConfirmation();
            this.next();
            this.restartGame();
        }else if(answer === "check your stats"){
            dialogs.stats(this.player);
            this.next();
            eventEmitter.emit("lossMenu");
        }else if(answer === "exit"){
            this.exit(); 
        }
    },
    
    //Sets the player object based on user input.
    setPlayer(){
        dialogs.hello();
        //Prompts player to enter their name.
        let name = prompts.formattedNamePrompt();;
        //Runs until a valid name is entered.
        while(!name){
            dialogs.unspportedString();
            dialogs.name();
            name = prompts.formattedNamePrompt();
        }
        if(name){
            if(this.loadPlayer(name)){
                dialogs.returningPlayer(this.player);
            }else{
                dialogs.newPlayer(this.player);
            }
            //Sets the playerIndex.
            this.playerIndex = this.players.findIndex(player =>  player.name === this.player.name);
        }
    },
    
    //Loads player object and creates one if the player is new.
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

    //Updates the games property of the player object with new stats for the current game.
    updatePlayerGamesWithCurrent(){
        this.player.games.splice(-1, 1, {stats: this.game.gameStats, field: this.game.field.hiddenField});
    },

    //Updates the players JSON with the most recent player stats.
    updatePlayersJSON(){
        this.players[this.playerIndex] = this.player;
        fs.writeFileSync('./players.json', JSON.stringify(this.players));
    },

    //Sets the current field and game objects of mainInterface.
    setFieldAndGame(){
        //Generates a valid field and game based on difficulty. Difficulty settings can be tweaked here.
        dialogs.difficulty();
        let difficulty = prompts.difficulty();
        if(difficulty === 'exit'){
            this.exit()
        }else{
            this.field = Field.generateValidField(settings[difficulty].fieldSettings.dimensions, settings[difficulty].fieldSettings.holes)
            this.game = new Game (difficulty, this.field)
        }

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
        this.game.assets.fieldAsset.frame1 = this.game.field.playField
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
    
    //Says goodbye and closes the application.
    exit(){
        console.clear();
        dialogs.goodbye();
        
        //Resets terminal settings and exits.
        process.stdin.resume();
        showCursor();
        process.exit();
    }
};

//Initiates the application.
mainInterface.begin();
