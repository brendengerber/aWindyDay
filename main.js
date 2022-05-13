//**Need to fix getter and setter for displayField (change name to be less confusing, hiddenField), change printDisplayField to work. createDisplayField works great
//* create static method on Field to create a random field
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
        this._field = field;
        this._hiddenField = Field.createHiddenField(field)
    }
    get field(){
        return this._field
    }
    get displayField(){
        return this._hiddenField
    }
    //Creates the hidden field that will be logged to the console with objective and holes hidden
    //**need to add the property which will be used to print this.hiddenField
    static createHiddenField(field){
        let hiddenField = []
        let rows = field.length
        let columns = field[0].length
        for(let i = 0; i < rows; i++){
            let row = []
            for(let i = 0; i < columns; i++){
                row.push('░')
            }
            hiddenField.push(row)
        }
        hiddenField[0][0] = '*'
        return hiddenField
    }

    playGame(){
        this.print()
   
    }
    //Prints the field that will be displayed with objective and holes hidden
    printDisplayField(){
        for(let line of this.displayField){
            let string = ''
            for(let space of line){
                string += space
            }
            console.log(string)
        }
    }
    //Prints the actual field with holes and objective revealed
    printField(){
        for(let line of this.field){
            let string = ''
            for(let space of line){
                string += space
            }
            console.log(string)
        }
    }
}
//This function will prompt the user for a Yes or No answer and return Y or N. 
//This function also clears the console after each answer preparing it for the next dialog.
function yesNoPrompt(){
    let answer = prompt(">")
    if(answer.toUpperCase()==="N"){
        console.clear()
        return "N"
    }else if(answer.toUpperCase()==="Y"){
        console.clear()
        return "Y"
    }else{
        console.clear()
        console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.")
        return yesNoPrompt()
    }
}

function directionPrompt(){
    let direction = prompt(">")
    if(direction.toUpperCase()==="W"){
        return "W"
    }else if(direction.toUpperCase()==="A"){
        return "A"
    }else if(direction.toUpperCase()==="S"){
        return "S"
    }else if(direction.toUpperCase()==="D"){
        return "D"
    }else{
        console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.")
        return yesNoPrompt()
    }
}


//Asks user if they would like to play and begins the game if so
function introDialog(){
    console.log("Would you like to play a game?")
    let answer = yesNoPrompt()
    // if(answer===undefined){
    //     introDialog()
    // }
    if(answer === "N"){
        console.log("I'm sorry to hear that. Goodbye.")
    }else if(answer === "Y"){
        console.log(
`That's great to hear, I'm excited for your!
Thankfully the tornado missed your home town, 
but the winds were still strong, and you lost your hat!
I'm sure it's somewhere in that field over there though! 
You can use W, A, S, D to move around and look for it.  Good luck!
Are you ready?`
        )
        let answer2 = yesNoPrompt()
        if(answer2 === "N"){

        }else{
            field.playGame()
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


// field.printDisplayField()
// field.createDisplayField()
// field.printDisplayField()
// field.createDisplayField()
console.log(field.displayField)
//introDialog()


// readline.clearLine(process.stdout);
// readline.cursorTo(process.stdout, 0);