//add static method to create a new field, and a static method to check a field's solvability. Then set a field variable inside the game object as that static method and change it if a new field is requ3ested
//problem is that I want to have game be it's own game with it's own stats object that can be added to the player stats and a new game is made. Maybe inside the player object their should be a new method newGame which makes a new board with new stats, which then makes a new field.
//add a method that somehow exports the current stats from game and saves them to the player array

//* create static method on Field to create a random field 
//*Is there a way to remove the waiting prompt and display the "here we go text under the new board for example?"
//make sure when adding new field that it somehow keeps the first loss status of the previous field. This is moved to player, once player is integrated change where it checks for the status to the correct player object
//*change all instances of holes and path etc to the characters, maybe make them properites of Field objects too. That way it's easier to change if i want to in the future
//*Add green and brown for path and grass
// after a stats file is made the comp should say "You came back! Would you like to see your stats or play another round?"
//add arrays for dialogs to pull from
//add logic for accepting input without hitting enter
//add out of bounds logic
//maybe dont need variable names for new objects like player, just add them to an array to be accessed by index, same for games in the game object within player
//add logic to check starting position based on where the new field shows the person
//move all dialog to dialog/prompt
//add instant input
//Maybe it's fun to leave the discovered holes there for the next try, then the fun thing is how many tries did it take you on average. So each time you fall the game will remember for you.
//Wow you're good at finding these holes
//Ouch that one looked like it hurt


// Variable names WIP
// let games = [0];
// games.push(games.length)
// let game+game[games.length-1] = new Game(field)


//Need to move input functions to their own module

//Imports necessary modules.
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

//Sets game characters.
const hat = '^';
const hole = 'O';
const grass = "░";
const path = '*';
const avatar = "𓀠"

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
        let answer = prompts.startGamePrompt()
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
        //******add x and y arguments like is out of bounds? Would just have to update the calls with (x,y), might also want it to return win, lose, move rather than win() and lose() functions so it can be reused in field checker */
        // move out of bounds to this function?
        let checkMove = function(x,y){
            if(!this.field.isHole(x,y) && !this.field.isHat(x,y)){
                this.field.playField[y][x] = avatar;
            }else if(this.field.isHole(x,y)){
                this.field.playField[y][x] = hole;
                gameOver = true;
                lose();
            }else if(this.field.isHat(x,y)){
                this.field.playField[y][x] = hat;
                gameOver = true;
                win();
            }
        }.bind(this);



        //Helper function initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let lose = function(){
            console.clear();
            this.field.printPlayField();
            if(this.field.firstLoss === false){
                this.field.firstLoss = true;
                dialog.loseFirst()
            }else{
                dialog.lose()
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
            //Moves the player avatar, sets the x,y possition, and checks for win or loss conditions.
            let newY;
            let newX;
            switch(direction){
                case "W":
                    newY = y-1;
                    if(this.field.isOutOfBounds(x, newY)===false){
                        this.field.playField[y][x] = path;
                        y = newY;
                        checkMove(x,y); 
                    };
                    break;  
                case "A":
                    newX = x-1;
                    if(this.field.isOutOfBounds(newX, y)===false){
                        this.field.playField[y][x] = path;
                        x = newX;
                        checkMove(x,y);
                    };
                    break;
                case "S":
                    newY = y+1;
                    if(this.field.isOutOfBounds(x, newY)===false){
                        this.field.playField[y][x] = path;
                        y = newY;
                        checkMove(x,y); 
                    };
                    break;
                case "D":
                    newX = x+1;
                    if(this.field.isOutOfBounds(newX, y)===false){
                        this.field.playField[y][x] = path;
                        x = newX;
                        checkMove(x,y);
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
    //***add percentage of holes? Can easily be done by adding a hole counter, though that will result in more holes at the beginning probably. Could randomize which array field is filled somehow? and fill those with holes, all the rest would be grass if not a hole (using a simple loop with if)
    static generateRandomField(x,y,holes){
        //Creates a blank field filled with grass according to the given dimensions
        let newHiddenFieldArray = []
        for(let i=0; i<y; i++){
            let newRow = []
            for(let i=0; i<x; i++){
                newRow.push(grass)
            }
            newHiddenFieldArray.push(newRow)
        }

        //Used to add holes, if there is already a hole in the random spot then the function runs again. 
        //This allows adding holes randomly throughout the field rather than having them clustered at the beginning if a simple loop was used to add randomly grass or hole characters until the desired number of holes was reached.
        let setHoles = function(){
            let xHoleIndex = Math.floor(Math.random() * (x))
            let yHoleIndex = Math.floor(Math.random() * (y))
            if(newHiddenFieldArray[yHoleIndex][xHoleIndex] === grass){
                newHiddenFieldArray[yHoleIndex][xHoleIndex] = hole
            }else{
                setHoles()
            }
        }
        //Runs set holes until the desired number of holes is reached.
        for(let i=0; i<holes; i++){
            setHoles()
        }
        
        //Validates the field and returns it if valid, else it re runs generateField.
        //*****Can I use a static method in here like this? do I need to use Field or this */
        let newHiddenField = new Field(newHiddenFieldArray)
        if(this.validateField(newHiddenField)){
            return newHiddenField
        }else{
            this.generateField(x,y)
        } 
    }
    

    //Validates a field using a wall follower algorithm. Returns true if valid and false if it is not solveable.
    //test field[0][0] first, if hole, then fail\

    //else start by moving down, then right, then up, then left
    //if the move is a fail, go the next direction (i.e. by updating the direction variable and re running the move/test function)
    //if the move is a success (i.e. grass), change xy coordinates, and try the same direction again (i.e not resetting the direction variable)
    //after a failed move add to the counter
        //add difficulties


    //absolutely no clue how to determine fail
    //maybe check move and isoutof bounds can be static game methods
    //check move must be updated to return win or lose or true
    //how to make Game statics work on the input field, do they need a field input too?
    //fuck this only works if the hat is along the edge, 
    //cant solve with pledge either as it only works starting inside and going out, not going out to in
    //Trémaux's algorithm?
    
    static validateField(testField){
        let direction = "S";
        let x = 0;
        let y = 0;
        let valid = undefined;
        while(valid === undefined){
            //is not lose or win
            //should this maybe be a field method? is hole? is win? is lose?
            //***make everything like .win, .lose out of bounds, be field methods that return true or false that game can use and validate field. This makes sense becaseu it gives info about the field, then the game can decide what to do with that info*/
            testField.hiddenField[y][x]!== hole && testField.hiddenField[y][x] !== hat
        }
    }



//both should be static, the generate field static creates an array, then calls the validate static at the end with the new array as the argument. If valid, returns the field, else runs the generate field static again until it is valid.  validate static should return true or false







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
        for(let line of this.playField){
            let string = '';
            for(let space of line){
                string += space;
            }
            console.log(string);
        }
    };

    //Prints the actual field with holes and objective revealed (useful for debugging).
    printHiddenField(){
        for(let line of this.hiddenField){
            let string = '';
            for(let space of line){
                string += space;
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
            return true
        }
        return false
    }

    //Returns true if coordinates are a hat, else returns false
    isHat(x,y){
        if(this.hiddenField[y][x] === hat){
            return true
        }
        return false
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
        let options = ["You just made me so happy! Are you ready?"];
        this.randomSelector(options);
        },

    waitingYN(){
        let options = ["Okay, I guess I'll wait. Just don't forget about me...Are you ready now?"];
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
        let options = ["Oh, you fell in a hole...again."];
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




























//**eventually add array made with generate field module rather than a predefined array
//**Add logic for the end. Would you like to play again? Which then generates a new field and assigns it to field
let field = new Field([
    [path, grass, grass],
    [grass, grass, grass],
    [grass, hole, hat],
  ]);

let game1 = new Game(field)
game1.startGame()


// let field = new Field([
//     ["*", "O", "░"],
//     ["░", "O", "░"],
//     ["░", "^", "░"],
//     ["░", "░", "░"],
//     ["░", "O", "░"],
//   ]);




// readline.clearLine(process.stdout);
// readline.cursorTo(process.stdout, 0);


//out of bounds function should take in x and y (according to how the keypress will change x and y if valid) if it is inbounds it should return true else it should return false. The moves function should only change x and y if the checkOutOfBoudns function returns true, else it should loop back for new input (like hitting an invisible wall)

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