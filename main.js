//Imports necessary modules
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

//Sets game characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//Field class used to play the game
class Field {
    constructor(field){
        this._field = field
    }
    get field(){
        return this._field
    }
    playGame(){





        
    }
    print(){
        for(let line of this.field){
            let string = ''
            for(let space of line){
                string += space
            }
            console.log(string)
        }
    }
}
//**eventually add array made with generate field module rather than a predefined array
//**Add logic for the end. Would you like to play again? Which then generates a new field and assigns it to field
let field = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ])



//Asks user if they would like to play and begins the game if so
function introDialog(){
    console.log("Would you like to play a game?\n")
    let play = prompt(">")
    if(play.toUpperCase()==="N"){
        console.clear()
        console.log("I'm sorry to hear that. Goodbye.")
    }else if(play.toUpperCase() !=="N" && play.toUpperCase() !=="Y"){
        console.clear()
        console.log("I'm sorry, I'm not very smart. I don't understand. Please enter Y for yes and N for no.")
        introDialog()
    }else{
        console.clear()
        console.log(
            `
            That's great to hear, I'm excited for your!
            Thankfully the tornado missed your home town, 
            but the winds were still strong, and you lost your hat!
            I'm sure it's somewhere in that field over there though! 
            You can use W, A, S, D to move around and look for it.  Good luck!
            Are you ready?
            `
        )
        let beginGame = prompt(">")
        if(beginGame ===

        // field.playGame()
    }
}

introDialog()
// test.print()
// console.clear()
// test.print()

// readline.clearLine(process.stdout);
// readline.cursorTo(process.stdout, 0);