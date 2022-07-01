//Next add while loops for the inputs
//maybe use events to update the play field, then an animation can print the play field each frame, and the play field will be updated asychrnously throughout
//*****weird behavior on loss menu */
//could be fun to have a biger field, and a snake thats chasing you or a bird 
//****Let's use readline with enter and limits for options and names and then use the stdin listening for movement eventually. (readline.keyin causes a weird flashing that the other doesnt) */


//Imports necessary modules.
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');
const fs = require('fs');
const events  = require('events');
const eventEmitter = new events.EventEmitter();

//**Experimental */
//for instant input
// require("readline").emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
const readlineSync = require('readline-sync')

//for eliminating prompt sync
// const readlineInterface = readline.createInterface({input: process.stdin, output: process.stdout});

//Sets game characters.
const hat = '^';
const hole = 'O';
const grass = '░';
const path = '*';
const avatar = '\u03EE';
// const avatar = "𓀠";
// \uD80C\uDC20

//Used to create a new player and to track stats.
class Player{
    constructor(name){
        this.name = name;
    };
    stats = {
        statsEasy: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0 
        },

        statsMedium: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0 
        },

        statsHard: {
            wins: 0,
            unsolved: 0,
            totalAttemptsToWin: 0,
            totalMovesToWin: 0 
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

//Contains game logic.
//***maybe create a game info property containing stats and field, this will be what is written to the player games array, so that play field and _properties are not there */
class Game {
    constructor(difficulty, field){
        this._difficulty = difficulty;
        this._field = field;
    };
    get field(){
        return this._field;
    };
    get difficulty(){
        return this._difficulty;
    }

    gameStats = {
        attempts: 0,
        moves: 0,
        win: false,
    };

    //Contains game logic.
    playGame(){
        let gameOver = false;
        let x = 0;
        let y = 0;
        let outcome;
        eventEmitter.emit("attempt");

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

        //Helper function initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let lose = function(){
            console.clear();
            this.field.printPlayField();
            this.gameStats.win = false;
            eventEmitter.emit("loss");
            outcome = "loss";
        }.bind(this);

        //Helper function initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let win = function(){
            console.clear();
            this.field.printPlayField();
            this.gameStats.win = true;
            eventEmitter.emit("win");
            outcome = "win";
        }.bind(this);

        //Play loop logic that is called to allow the player to move around the board. Changes playField to show path. Includes win/loss and out of bounds logic.
        while(!gameOver){
            //Sets up board and prompts user for direction input.
            console.clear();
            this.field.printPlayField();
            let direction = prompts.direction();
            //Resets the board if prompt.direction() returns undefined (i.e. a key other than wasd was pressed).
            if(direction === undefined){
                console.clear();
                this.field.printPlayField();
                direction = prompts.direction();
            }
            //Moves the player avatar, sets the x,y possition, and checks for win or loss conditions
            ///***can path be moved to check move? does it matter? checkmove deals with the new space, while path is the old space and could be handled by the while loop */
            //*******can make checkMove(x,y,newx,newy) This would allw me to move the path shit to checkMove too, which could even be renamed into move */
            //**can remove the newy/nex like in validate? maybe no since in validate we already know we are moving? I could here, but would have to check the move first. Then can just increment with ++ and --
            
            //Increments totalMoves, updates the current game, and writes to playersJSON
            //*********should both mainInterface.player.games.splice(-1, 1, mainInterface.game) instances be their own method?*/

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
        };
        return outcome;
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
    }
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

    //Prints the field that will be displayed with objective and holes hidden.
    printPlayField(){
        for(let row of this.playField){
            let string = '';
            for(let column of row){
                string += column;
            }
            console.log(string);
        }
    };

    //Prints the actual field with holes and objective revealed (useful for debugging).
    printHiddenField(){
        for(let row of this.hiddenField){
            let string = '';
            for(let column of row){
                string += column;
            }
            console.log(string);
        }
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
            return options[answer];
    },

    // Works for instant input, not great for movement as it flashes
    formattedDirectionPrompt(){
        let answer = readlineSync.keyIn('', {hideEchoBack: true, mask: ''})
        if(/^[a-zA-Z0-9]{1}$/.test(answer)){
            return answer.toUpperCase();
        }else{
            return false;
        }
    },

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

        //Creates a handler for moves and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let moveHandler = function(){
            //Increment stats and updates the playerJSON.
            this.game.gameStats.moves ++;
            this.player.games.splice(-1, 1, this.game);
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("move", moveHandler);

        //Increments the game attempts stat and writes to playersJSON.
        //Prevents player from force quitting to avoid an attempt stat.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let attemptHandler = function(){
            this.game.gameStats.attempts ++;
            this.player.games.splice(-1, 1, this.game);
            this.updatePlayersJSON();
        }.bind(this);
        eventEmitter.on("attempt", attemptHandler);

        //Creates a handler for wins and adds it to the eventEmitter.
        //.bind(this) is used to reference the mainInterface object's "this" rather than the function's "this".
        let winHandler = function(){            
            //Updates player object's total stats and writes to JSON. Marks the game as solved, increments the wins, and updates the attempts/moves from the game object.
            this.player.stats["stats"+this.game.difficulty].unsolved --;
            this.player.stats["stats"+this.game.difficulty].wins ++;
            this.player.stats["stats"+this.game.difficulty].totalAttemptsToWin += this.game.gameStats.attempts;
            this.player.stats["stats"+this.game.difficulty].totalMovesToWin += this.game.gameStats.moves;
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
        this.next();
        this.mainMenu();
    },

    //Presents the main menu and handles the player's response.
    mainMenu(){
        console.clear();
        dialogs.mainMenu();
        let answer = prompts.mainMenu();
        console.clear();
        if(answer === "Play a game"){  
            dialogs.excitedConfirmation();
            this.next();
            console.clear();
            dialogs.intro();
            this.next();
            this.setFieldAndGame();
            this.startGame();
        }else if(answer === "View your stats"){
//**********add logic here to show stats */

        }else if(answer === "Exit"){
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
        if(answer === "Try again"){
            console.clear();
            dialogs.excitedConfirmation();
            this.next();
            this.restartGame();
        }else if(answer === "Exit"){
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
        if(difficulty){
            switch(difficulty){
                case "Easy":
                    this.field = Field.generateValidField(3,3,2);
                    this.game = new Game("Easy", this.field);
                    break;
                case "Medium":
                    this.field = Field.generateValidField(5,5,6);
                    this.game = new Game("Medium", this.field);
                    break;
                case "Hard": 
                    this.field = Field.generateValidField(7,7,11);
                    this.game = new Game("Hard", this.field);
                    break;
            };
        }
    },

    //Starts the game.
    startGame(){ 
        //Increments the unsolved player stat while the game is being played, records the unsolved game, and writes to playersJSON.
        //Prevents player from force quitting to avoid an unsolved stat. Will be removed on win.
        this.player.stats["stats"+this.game.difficulty].unsolved ++;
        this.player.games.push(this.game);
        this.updatePlayersJSON();
        
        //Calls the game logic.
        this.game.playGame();
    },

    //Restarts the game.
    restartGame(){
        //Resets the play field to blank.
        this.game.field.resetPlayField();

        //Calls the game logic.
        this.game.playGame();
    },

    //Standard next options to advance to the next dialog or exit.
    next(){
        let answer = prompts.next();
        if(answer === "Next"){
            return;
        }else if(answer === "Exit"){
            this.exit();
        }
    },
    
    //Used to say goodbye and close the application.
    exit(){
        console.clear();
        dialogs.goodbye();
        process.exit();
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

// field = new Field([
//     [grass, grass, hole, grass, grass, grass],
//     [hole, grass, grass, grass, hole, grass],
//     [hole, hole, hole, hole, grass, grass],
//     [hat, grass, grass, grass, grass, hole]
//   ]);

// let game1 = new Game(field)
// game1.startGame()


// ONLY WORKS IF HOLES CONNECTED TO WALL
// static validateField(field){
//     let direction = "S";
//     let x = 0;
//     let y = 0;
//     let win = undefined;
//     while(win === undefined && !lose){
//         let test = function(direction){
//             if(direction==="S"){
//                 if(!Game.isOutOfBounds(field,x,y+1)){
//                     let move = Game.checkMove(field,x,y+1)
//                     if(move==="win"){
//                         win = true;
//                     }else if(move===hole){
//                         direction = "E";
//                         test(direction)
//                     }else if(move===grass){
//                         y = y + 1;
//                         test(direction)
//                     }
//                 }
//             }else if(direction==="E"){
//                 if(!Game.isOutOfBounds(field,x+1,y)){
//                     let move = Game.checkMove(field,x+1,y)
//                     if(move==="win"){
//                         win = true;
//                     }else if(move===hole){
//                         direction = "N";
//                         test(direction)
//                     }else if(move===grass){
//                         x = x + 1;
//                         test(direction)
//                     }
//                 }
//             }else if(direction==="N"){
//                 if(!Game.isOutOfBounds(field,x,y-1)){
//                     let move = Game.checkMove(field,x,y-1)
//                     if(move==="win"){
//                         win = true;
//                     }else if(move===hole){
//                         direction = "W";
//                         test(direction)
//                     }else if(move===grass){
//                         y = y - 1;
//                         test(direction)
//                     }
//                 }
//             }else if(direction==="W"){
//                 if(!Game.isOutOfBounds(field,x-1,y)){
//                     let move = Game.checkMove(field,x-1,y)
//                     if(move==="win"){
//                         win = true;
//                     }else if(move===hole){
//                         direction = "S";
//                         test(direction)
//                     }else if(move===grass){
//                         y = x - 1;
//                         test(direction)
//                     }
//                 }
//             }
//         }
//         test(direction)
//         }
//     if(win){
//         return true
//     }else if(!win){
//         return false
//     }
// }