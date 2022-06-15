//Imports necessary modules.
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

//Sets game characters.
const hat = '^';
const hole = 'O';
const grass = "░";
const path = '*';
const avatar = "𓀠";

//Used to create a new player and to track stats.
class Player{
    constructor(name){
        this._name = name;
    };
    get name(){
        return this._name;
    };
    stats = {
        wins: 0,
        losses: 0,
        totalMoves: 0,
        averageMoves: 0,
        averageAttemptsToWin: 0,
        fieldsLost: 0,
        fieldsWon: 0,
        winPercentage: this.fieldsWon/(this.fieldsWon + this.fieldsLost)
    };
    games = [];
    firstLoss = false;
};

//Used to play the game.
class Game {
    constructor(field){
        this._field = field;
    };
    get field(){
        return this._field;
    };

    //Used to start the game or exit.
    startGame(){
        let answer = prompts.startGamePrompt();
        if(answer === "Y"){
            this.playGame();
        }else if(answer === "N"){
            process.exit();
        }
    };

    //Contains game logic.
    //**********Should all these functions be methods? I don't think it is necessary
    playGame(){
        let gameOver = false;
        let x = 0;
        let y = 0;
        
        //Helper function that checks the move for Win/Loss and update the playField appropriately.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
       //***maybe change checkMove to updateMove */
        //******add x and y arguments like is out of bounds? Would just have to update the calls with (x,y), might also want it to return win, lose, move rather than win() and lose() functions so it can be reused in field checker */
        //***should updatemove be part of Field just like isoutofbounds? */
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
            if(this.field.firstLoss === false){
                this.field.firstLoss = true;
                dialog.loseFirst();
            }else{
                dialog.lose();
            }
            resetGame();
        }.bind(this);

        //Helper function initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let win = function(){
            console.clear();
            this.field.printPlayField();
            dialog.win();
            resetGame();
        }.bind(this);

        //Helper function resets the game and begins again.
        //**Add option for a new field here and make a new a new instance of Game
        let resetGame = function(){
            let answer = prompts.playAgainPrompt();
            if(answer === "Y"){
                console.clear();
                gameOver = false;
                x = 0;
                y = 0;
                //***********not working, think i just need to add play field and hidden field properties for game. field will be the input field that doesnt change unless it is set to have a new field */
                this.field.playField = Field.createPlayField(this.field.hiddenField);
                this.playGame();
            }else if(answer === "N"){
                process.exit();
            }
        }.bind(this);

        //Play loop logic that is called to allow the player to move around the board. Changes playField to show path. Includes win/loss and out of bounds logic.
        while(!gameOver){
            //Sets up board and prompts user for direction input.
            console.clear();
            this.field.printPlayField();
            let direction = prompts.directionPrompt();
            //Resets the board if directionPrompt returns undefined (i.e. a key other than wasd was pressed).
            if(direction === undefined){
                console.clear();
                this.field.printPlayField();
                direction = prompts.directionPrompt();
            }
            //Moves the player avatar, sets the x,y possition, and checks for win or loss conditions
            ///***can path be moved to check move? does it matter? checkmove deals with the new space, while path is the old space and could be handled by the while loop */
            //*******can make checkMove(x,y,newx,newy) This would allw me to move the path shit to checkMove too, which could even be renamed into move */
            //**can remove the newy/nex like in validate? maybe no since in validate we already know we are moving? I could here, but would have to check the move first. Then can just increment with ++ and --

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
                        this.field.playField[y][x] = path;
                        x = newX;
                        updateMove(x,y);
                    };
                    break;
                case "S":
                    newY = y+1
                    // if(checkMove(x, newY)){
                    //     this.field.playField[y][x] = path;
                    //     y = newY
                    // }
                    if(!this.field.isOutOfBounds(x, newY)){
                        this.field.playField[y][x] = path;
                        y = newY;
                        updateMove(x,y); 
                    };
                    break;
                case "D":
                    newX = x+1
                    // if(checkMove(newX, y)){
                    //     this.field.playField[y][x] = path;
                    //     x = newX
                    // }
                    if(!this.field.isOutOfBounds(newX, y)){
                        this.field.playField[y][x] = path;
                        x = newX;
                        updateMove(x,y);
                    };
                    break;
            };
        };
    }; 
};

//Used to create the hiddenField and playField and display said fields.
class Field {
    constructor(hiddenFieldArray){
        this._hiddenField = hiddenFieldArray;
        this._playField = Field.createPlayField(hiddenFieldArray);
    };
    get hiddenField(){
        return this._hiddenField;
    };
    get playField(){
        return this._playField;
    };
    //Primarily used to update the playField property after each move and reset it to its original state after a game is over.
    set playField(hiddenFieldArray){
        this._playField = Field.createPlayField(hiddenFieldArray);
    };
    //**This needs to be set somewhere outside of the field if the field is going to change like in the player object
    firstLoss = false;

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
        //**change to recursion? if(valid === undefined){move(decideDirection())} ??*/
        while(valid === undefined){
            move(decideDirection());
        }
        return valid;
    }

    //Generates a valid Field object and returns it.
    static generateValidField(x, y, holes){
        let validField;
        let valid = false;
        while(!valid){
            validField = Field.generateRandomField(x,y,holes);
            valid = Field.validateField(validField);
        }
        return validField;
    }

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
    }

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

//Dialog object used by prompt and game objects
//****Add random dialog here
const dialog = {
    //Used to randomly select one of the options and log it to the console.
    randomSelector(options){
        console.log(options[Math.floor(Math.random() * (options.length))]);
    },

    wrongInputYN(){
        console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.");
    },

    playYN(){
        console.log("Would you like to play a game?");
    },
    intro(){
        console.log(
`That's great to hear, I'm excited for your!\n
Thankfully the tornado missed your home town, 
but the winds were still strong, and you lost your hat!
I'm sure it's somewhere in that field over there though! 
You can use W, A, S, D to move around and look for it.  Good luck!
\nAre you ready?`
        );
    },

    readyYN(){
        let options = [
            "You just made me so happy! Are you ready?", 
            "That's really fantastic! Are you ready?", 
            "Now that's what I like to hear! Are you ready?"
        ];
        this.randomSelector(options);
        },

    waitingYN(){
        let options = [
            "Okay, I guess I'll wait. Just don't forget about me...Are you ready now?"
        ];
        this.randomSelector(options);
    },

    win(){
        let options = ["Woah, you did it! You found your hat! To be honest...I didn't see that coming."];
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

    startOverYN(){
        let options = ["Would you like to start over?"];
        this.randomSelector(options);
    },

    goodbye(){
        let options = ["I'm really sorry to hear that. I'm going to miss you. Goodbye."]
        this.randomSelector(options);
    }
};

//Contains all the prompts used within the game logic.
//*****remove prompt from method names to match dialog? or add it to dialog? */
const prompts = {
    //Prompts the user for a Yes or No answer and return Y or N.
    //Clears the console after each answer preparing it for the next dialog.
    yesNoPrompt(){
        let answer = prompt(">");
        if(answer.toUpperCase()==="N"){
            console.clear();
            return "N";
        }else if(answer.toUpperCase()==="Y"){
            console.clear();
            return "Y";
        }else{
            console.clear();
            dialog.wrongInputYN();
            return this.yesNoPrompt();
        }
    },

    //Prompts the user for direction input and returns it. If input is invalid it will ask again.
    //*Can this also be a switch?
    directionPrompt(){
        let direction = prompt(">");
        if(direction.toUpperCase()==="W"){
            return "W";
        }else if(direction.toUpperCase()==="A"){
            return "A";
        }else if(direction.toUpperCase()==="S"){
            return "S";
        }else if(direction.toUpperCase()==="D"){
            return "D";
        //Returns undefined if a key other than WASD is pressed
        }else{
            return undefined;
        }
    },

    //To be used after a user says they are not ready yet. Loops through itself until the user says they are ready. Then it will return Y.
    waitingPrompt(){
        dialog.waitingYN();
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            return "Y";
        }else if(answer === "N"){
            this.waitingPrompt();
        }
    },

    //Asks the player if they would like to play again and if they are ready and returns Y or N.
    playAgainPrompt(){
        dialog.startOverYN();
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            dialog.readyYN();
            answer = this.yesNoPrompt();
            if(answer === "Y"){
                return "Y";
            }else if(answer === "N"){
                return this.waitingPrompt();
            }
        }else if(answer === "N"){
            dialog.goodbye();
            return "N";
        }
    },

    //Asks user if they would like to play and returns Y or N.
    startGamePrompt(){
        console.clear();
        dialog.playYN();
        let answer = this.yesNoPrompt();
        if(answer === "N"){
            dialog.goodbye();
            return "N";
        }else if(answer === "Y"){
            dialog.intro();
            answer = this.yesNoPrompt();
            if(answer === "N"){
                return this.waitingPrompt();
            }else if(answer === "Y"){
                return "Y";
            }
        }
    }
};


//Starts game with basic field

let field = new Field([
    [grass, grass, hole, grass, grass, grass],
    [hole, grass, grass, grass, hole, grass],
    [hole, hole, hole, hole, grass, grass],
    [hat, grass, grass, grass, grass, hole]
  ]);

let game1 = new Game(field)
game1.startGame()


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