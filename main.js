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

// Variable names WIP
// let games = [0];
// games.push(games.length)
// let game+game[games.length-1] = new Game(field)


//Need to move input functions to their own module
//Imports necessary modules
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

//Sets game characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

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
        winPercentage: this.wins/(this.wins + this.losses)
    };
    games = [];
    firstLoss = false;
};

//Used to play the game.
class Game {
    constructor(field){
        this._field = field;
    }
    get field(){
        return this._field;
    }
    //Used to start the game or exit.
    startGame(){
        let answer = prompts.startGamePrompt()
        if(answer === "Y"){
            this.playGame();
        }else if(answer === "N"){
            process.exit();
        }
    }
    //Contains game logic.
    playGame(){
        let gameOver = false;
        let x = 0;
        let y = 0;
        //Checks the move for Win/Loss and update the playField appropriately.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let checkMove = function(){
            if(this.field.hiddenField[y][x]!== "O" && this.field.hiddenField[y][x] !== "^"){
                this.field.playField[y][x] = "𓀠";
            }else if(this.field.hiddenField[y][x] === "O"){
                this.field.playField[y][x] = "O";
                gameOver = true;
                lose();
            }else if(this.field.hiddenField[y][x] === "^"){
                this.field.playField[y][x] = "^";
                gameOver = true;
                win();
            }
        }.bind(this);
        //Initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let lose = function(){
            console.clear();
            this.field.printPlayField();
            if(this.field.firstLoss === false){
                this.field.firstLoss = true;
                console.log("Oops, you fell in a hole!\nDid I forget to mention that there were holes?\nAlright, that one's on me.")
            }else{
                console.log("Oh you fell in a hole...again.");
            }
            resetGame();
        }.bind(this);
        //Initiates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this".
        let win = function(){
            console.clear();
            this.field.printPlayField();
            console.log("Woah, you did it! You found your hat! To be honest...I didn't see that coming.");
            resetGame();
        }.bind(this);
        //Resets the game and begins again.
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
                playLoop();
            }else if(answer === "N"){
                process.exit()
            }
        }.bind(this);
        //Allows player to move around the board. Changes playField to show path. Includes win and loss logic.
        let playLoop = function(){
            while(!gameOver){
                console.clear();
                this.field.printPlayField();
                let direction = prompts.directionPrompt();
                //Resets the board if directionPrompt returns undefined (i.e. a key other than wasd was pressed)
                if(direction === undefined){
                    console.clear()
                    this.field.printPlayField();
                    direction = prompts.directionPrompt()
                }
                //Moves the player, sets the possition, and checks for win or loss conditions
                if(direction === "W"){
                    this.field.playField[y][x] = "*";
                    y -= 1;
                    checkMove();
                }else if(direction === "A"){
                    this.field.playField[y][x] = "*";
                    x -= 1;
                    checkMove();
                }else if(direction === "S"){
                    this.field.playField[y][x] = "*";
                    y += 1;
                    checkMove();
                }else if(direction === "D"){
                    this.field.playField[y][x] = "*";
                    x += 1;
                    checkMove();
                }
            }
        }.bind(this); 
        playLoop();   
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
    //Creates the play field that will be logged to the console with objective and holes hidden.
    static createPlayField(hiddenFieldArray){
        let playField = [];
        let rows = hiddenFieldArray.length;
        let columns = hiddenFieldArray[0].length;
        for(let i = 0; i < rows; i++){
            let row = [];
            for(let i = 0; i < columns; i++){
                row.push('░');
            }
            playField.push(row);
        }
        playField[0][0] = '𓀠';
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
};

//Contains all the prompts used within the game logic.
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
            console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.");
            return this.yesNoPrompt();
        }
    },
    //Prompts the user for direction input and returns it. If input is invalid it will ask again.
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
            return undefined
        }
    },
    //To be used after a user says they are not ready yet. Loops through itself until the user says they are ready. Then it will return Y.
    waitingPrompt(){
        console.log("Oh, okay, I guess I'll wait. Just don't forget about me...Are you ready now?")
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            return "Y";
        }else if(answer === "N"){
            this.waitingPrompt();
        }
    },
    //Asks the player if they would like to play again and if they are ready and returns Y or N.
    playAgainPrompt(){
        console.log("Would you like to start over?")
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            console.log("You just made me so happy! Are you ready?");
            answer = this.yesNoPrompt();
            if(answer === "Y"){
                return "Y";
            }else if(answer === "N"){
                return this.waitingPrompt();
            }
        }else if(answer === "N"){
            console.log("I'm really sorry to hear that. I'm going to miss you. Goodbye.");
            return "N";
        }
    },
    //Asks user if they would like to play and returns Y or N.
    startGamePrompt(){
        console.clear()
        console.log("Would you like to play a game?");
        let answer = this.yesNoPrompt();
        if(answer === "N"){
            console.log("I'm sorry to hear that. Goodbye.");
            return "N";
        }else if(answer === "Y"){
            console.log(
    `That's great to hear, I'm excited for your!
    Thankfully the tornado missed your home town, 
    but the winds were still strong, and you lost your hat!
    I'm sure it's somewhere in that field over there though! 
    You can use W, A, S, D to move around and look for it.  Good luck!
    Are you ready?`
            );
            answer = this.yesNoPrompt();
            if(answer === "N"){
                return this.waitingPrompt();
            }else if(answer === "Y"){
                return "Y";
            }
        }
    }
}




























//**eventually add array made with generate field module rather than a predefined array
//**Add logic for the end. Would you like to play again? Which then generates a new field and assigns it to field
let field = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);

let game1 = new Game(field)
game1.startGame()




// readline.clearLine(process.stdout);
// readline.cursorTo(process.stdout, 0);