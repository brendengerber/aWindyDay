const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


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

const test = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ])
