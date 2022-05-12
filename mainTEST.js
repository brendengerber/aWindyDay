const prompt = require('prompt-sync')({sigint: true});
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let down=0,up=0,right=0,left=0;
let gameOver = false;
let position=[0,0]; //player is in which row and which column

class Field {
 constructor(field){
   this._field = field;
 }  
 get field(){
   return this._field;
 }
 print(){
   let len = this._field.length
   let fieldJoin = []
   for(let i=0;i< len;i++){
     fieldJoin.push(this._field[i].join(''));
   }
   fieldJoin = fieldJoin.join('\n');
   console.log(fieldJoin);
 }
 logic(){
   while(!gameOver){
    myField.print();
    const direction = prompt('Where do you want to move?'); 
    if(direction==='d'){
        if(position[0]<(myField.field).length-1 && myField._field[position[0]+1][position[1]]!=='O'){
          if(myField._field[position[0]+1][position[1]]!=='^'){
            myField._field[position[0]+1][position[1]]='*'
            down++;
            position[0]=position[0]+1;
            console.log(position);
          }
          else if(myField._field[position[0]+1][position[1]]==='^'){
            console.log('Congrats! You found the hat.');
            gameOver = true;
          }
        }
      else{
        console.log('You Suck. Game Over');
        gameOver = true;

      }
    }

    if(direction==='r'){
      if(position[1]<(myField.field)[0].length-1 && myField._field[position[0]][position[1]+1]!=='O'){
      if(myField._field[position[0]][position[1]+1]!=='^'){
        myField._field[position[0]][position[1]+1]='*'
        right++;
        position[1]=position[1]+1;
        console.log(position);

      }
      else if(myField._field[position[0]][position[1]+1]==='^'){
        console.log('Congrats! You found the hat.');
        gameOver = true;
      }
    }
      else{
        console.log('You Suck. Game Over.');
        gameOver = true;
      }
    }

    if(direction==='l'){
      if(position[1]>0 && myField._field[position[0]][position[1]-1]!=='O'){
      if(myField._field[position[0]][position[1]-1]!=='^'){
        myField._field[position[0]][position[1]-1]='*'
        left++;
        position[1]=position[1]-1;
        console.log(position);

      }
      else if(myField._field[position[0]][position[1]-1]==='^'){
        console.log('Congrats! You found the hat.');
        gameOver = true;
      }
    }
      else{
        console.log('You Suck. Game Over.');
        gameOver = true;
      }
    }
    if(direction==='u'){
        if(position[0]>0 && myField._field[position[0]-1][position[1]]!=='O'){
          if(myField._field[position[0]-1][position[1]]!=='^'){
            myField._field[position[0]-1][position[1]]='*'
            down++;
            position[0]=position[0]-1;
            console.log(position);
          }
          else if(myField._field[position[0]-1][position[1]]==='^'){
            console.log('Congrats! You found the hat.');
            gameOver = true;
          }
        }
      else{
        console.log('You Suck. Game Over');
        gameOver = true;

      }
    }
  }
 }
 generateField(width,height){
   let bigOCount=0;
   let consecutiveO=0;
   this._field[0][0]=pathCharacter;
   for(let i=0;i< height;i++){
     for(let j=1;j< width;j++){
       let random = Math.floor(Math.random()*2);
       if(random===0){
         this._field[i][j]=hole;
         if(bigOCount>(height*width)/4 || consecutiveO>0){
           this._field[i][j]=fieldCharacter;
         }
         bigOCount++;
         consecutiveO++;
       }
       else{
         this._field[i][j]= fieldCharacter;
         consecutiveO=0;
       }
     }
   }
   let rand1 = Math.floor(Math.random()*height);
   let rand2 = Math.floor(Math.random()*width);
   if(rand1 && rand2 !==0){
     this._field[rand1][rand2] = '^';
   }
   else{
     this._field[rand1][rand2+1] = '^';
   }
 }
}
const myField = new Field([
  ['*', '░', 'O'],
  ['░', '░', '░'],
  ['O', '░', '░'],
  ['░', '^', '░'],
  ['░', 'O', '░']
]);
myField.generateField(5,5);
myField.logic()



