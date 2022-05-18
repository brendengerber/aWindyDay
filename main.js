//* create static method on Field to create a random field or a seperate module
//*do prompt functions belong in the class? maybe as module functions assigned to methods. for now they all work outside of it fine so could be a module
//*Is there a way to remove the waiting prompt and display the "here we go text under the new board for example?"
//IMPORTANT After winning or losing one time, if you answer you don't want to play again the game restarts regardless, while showing the previous board. maybe prompt functions must reset the answer again so it's ready for a new prommpt. winning or losing after the bug causes correct behavior
//seems the problem is in resetGame as it happens with a n answer even after removing playAgainPrompt
//possibly it jumps back into the while loop, maybe can fix by turning play game into an object with loop and check methods so they dont run sequentially down
//maybe add a property which is an object containing game functions
//make sure when adding new field that it somehow keeps the first loss status of the previous field. maybe it should just be a global variable
//*change all instances of holes and path etc to the characters, maybe make them properites of Field objects too. That way it's easier to change if i want to in the future
//*Add green and brown for path and grass
//make intro dialog only return and not start the process, then have a function called start game which calls that prompt and runs the loop if it returns y
//add arrays for different things for the comp to say
//Differentiate between dialogs and yes no prompt
// after a stats file is made the comp should say "You came back! Would you like to see your stats or play another round?"
//add arrays for dialogs to pull from

//create a player class. this player should have the info of the player, as well as a stats property containing an object which contains all of the stats (wins, losses, moves per game). There should also be a set stats method, which uses the current stats and has an argument of "newStats", it should update stats without looping through all previous games. Finally this class should have a games property, set to an array of all the games played. The games class will create an object and push it to this array, this should include a game id, and the stats for that game

//add start dialog to start game method, if it is just used to return y or n then it can be a module/function, and the begin game actually runs in the method
//make a new object in play game? the object can contain x and y stuff, plus start game, play loop, etc

//add out of bounds logic

//change all dialogs to return y or to activate playGame(). If all are set to return y or n, then in the game class method i may need to call it and then add if statements. If they all return y or n then they should also go into their own object


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

class Player{
    constructor(name){
        this._name = name
    }
    get name(){
        return this._name
    }
    stats = {
        wins: 0,
        losses: 0,
        totalMoves: 0,
        averageMoves: 0,
        winPercentage: this.wins/(this.wins + this.losses)
    }
    games = []
    firstLoss = false
}


//Field class used to play the game
class Game {
    constructor(field){
        this._field = field;
    }
    get field(){
        return this._field
    }






    startGame(){
        if(prompts.startGamePrompt()=== "Y"){
            this.playGame()
        }
    }






    playGame(){
        let gameOver = false;
        let x = 0;
        let y = 0;
         
        
        //Asks user if they would like to play and begins the game if so

        
        //***change field in field object to be something more like hiddenField to avoid field.field */
        //This function will check the move for Win/Loss and update the playField appropriately.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
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


        //This function inniciates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
        //*Add logic to play the same field vs a new field. set field to a new Field (maybe this goes in the play again prompt?)
        let lose = function(){
            console.clear()
            field.printPlayField();
            if(field.firstLoss === false){
                field.firstLoss = true;
                console.log("Oops, you fell in a hole!\nDid I forget to mention that there were holes?\nAlright, that one's on me.")
            }else{
                console.log("Oh you fell in a hole...again.");
            }
            resetGame()
        }.bind(this);


        //This function initiates the loss dialog and displays the final field
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
        //*Add logic to play the same field vs a new field
        let win = function(){
            console.clear()
            this.field.printPlayField();
            console.log("Woah, you did it! You found your hat! To be honest...I didn't see that coming.");
            resetGame()
        }.bind(this)
        //Resets the game and begins again





        let resetGame = function(){
            let answer = prompts.playAgainPrompt()
            if(answer === "Y"){
                console.clear();
                gameOver = false;
                x = 0;
                y = 0;
                //***********not working, think i just need to add play field and hidden field properties for game. field will be the input field that doesnt change unless it is set to have a new field */
                this.field.playField = Field.createPlayField(this.field.hiddenField);
                playLoop() 
            }
        }.bind(this)


        //Allows player to move around the board. Changes playField to show path. Includes win and loss logic.
        let playLoop = function(){
            while(!gameOver){
                console.clear();
                this.field.printPlayField();
                let direction = prompts.directionPrompt();
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
        }.bind(this)    
        playLoop()   
    };
    
}


class Field {
    constructor(hiddenFieldArray){
        this._hiddenField = hiddenFieldArray;
        this._playField = Field.createPlayField(hiddenFieldArray);
    };
    get hiddenField(){
        return this._hiddenField
    };
    get playField(){
        return this._playField
    };
    set playField(hiddenFieldArray){
        this._playField = Field.createPlayField(hiddenFieldArray);
    };

    //**This needs to be set somewhere outside of the field if the field is going to change */
    firstLoss = false;

    //Creates the play field that will be logged to the console with objective and holes hidden
    //**need to add the property which will be used to print this.playField
    static createPlayField(hiddenFieldArray){
        let playField = [];
        let rows = hiddenFieldArray.length;
        let columns = hiddenFieldArray[0].length;
        for(let i = 0; i < rows; i++){
            let row = []
            for(let i = 0; i < columns; i++){
                row.push('░');
            }
            playField.push(row);
        }
        playField[0][0] = '𓀠';
        return playField
    };
    

    //Prints the field that will be displayed with objective and holes hidden
    printPlayField(){
        for(let line of this.playField){
            let string = '';
            for(let space of line){
                string += space;
            }
            console.log(string);
        }
    };
    //Prints the actual field with holes and objective revealed (useful for debugging)
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

//Does it make sense to add dialogs here? Should these just be put into the game object?

const prompts = {
    yesNoPrompt(){
        let answer = prompt(">");
        if(answer.toUpperCase()==="N"){
            console.clear();
            return "N"
        }else if(answer.toUpperCase()==="Y"){
            console.clear();
            return "Y"
        }else{
            console.clear();
            console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.");
            return this.yesNoPrompt();
        }
    },
    directionPrompt(){
        let direction = prompt(">");
        if(direction.toUpperCase()==="W"){
            return "W"
        }else if(direction.toUpperCase()==="A"){
            return "A"
        }else if(direction.toUpperCase()==="S"){
            return "S"
        }else if(direction.toUpperCase()==="D"){
            return "D"
        }else{
            console.clear()
            this.field.printPlayField()
            console.log("It really is important that you eneter either W, A, S, or D, otherwise I just can't help you!")
            return this.directionPrompt()
        }
    },
    //This function can be used after a user says they are not ready yet. It will loop through itself until the user says they are ready. Then it will return Y.
    //***why does this function activate field.playGame while playAgainPrompt returns Y? */
    waitingPrompt(){
        console.log("Oh, okay, I guess I'll wait. Just don't forget about me...Are you ready now?")
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            field.playGame()
        }else if(answer === "N"){
            this.waitingPrompt()
        }
    },
        //*Perhaps add the new field option here
    //**so if dialogs activate functions then shouldnt this be field.playGame() instead of return y? To match with the way waiting dialog works */
    playAgainPrompt(){
        console.log("Would you like to start over?")
        let answer = this.yesNoPrompt();
        if(answer === "Y"){
            console.log("You just made me so happy! Are you ready?")
            answer = this.yesNoPrompt();
            if(answer === "Y"){
                return "Y"
            }else if(answer === "N"){
                this.waitingPrompt()
            }
        }else if(answer === "N"){
            console.log("I'm really sorry to hear that. I'm going to miss you. Goodbye.");
        }
    },
    startGamePrompt(){
        console.clear()
        console.log("Would you like to play a game?");
        let answer = this.yesNoPrompt();
        if(answer === "N"){
            console.log("I'm sorry to hear that. Goodbye.");
            process.exit()
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
                this.waitingPrompt()
            }else if(answer === "Y"){
                return "Y";
            }
        }
    }
}


//This function will prompt the user for a Yes or No answer and return Y or N. 
//This function also clears the console after each answer preparing it for the next dialog.



//This function will prompt the user for direction input and returns it. If input is invalid it will ask again.






















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