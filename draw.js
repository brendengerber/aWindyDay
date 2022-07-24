module.exports = {    
    //Takes an array of array sprites to composite into a single frame.
    //Layers assets and treats "blank" as transparent which allows for transparent asset backgrounds and layering.
    //The first array will be the top layer, while the final array will be the bottom layer.
    //Dimensions arg should be an object such as {x:, y:}. Anything possitioned outside of those dimensions will not be drawn.
    //Default dimensions are the longest x and the longest y dimensions present in the array of sprites.
    createFrame: function(arrays, dimensions){
        let frame = [];
        let xDimension = 0;
        let yDimension = 0;
        //Sets the frame's dimensions to the dimensions arg if one was given.
        if(dimensions !== undefined){
            xDimension = dimensions.x;
            yDimension = dimensions.y;
        }
        //Sets the frame's dimensions in case no dimensions arg was given.
        if(dimensions === undefined){
            //Finds the array with the most columns and sets the dimension.
            for(let array of arrays){
                for(let row of array){
                    if(row.length > xDimension){
                        xDimension = row.length;
                    }
                }
            }
            //Finds the array with the most rows and sets the dimension.
            for(let array of arrays){
                if(array.length > yDimension){
                    yDimension = array.length;
                }
            }
        }
        //Uses the dimensions to build a blank frame filled with spaces.
        for(let y = yDimension; y > 0; y--){
            let row = [];
            for(let x = xDimension; x >0; x--){
                row.push('blank');
            }
            frame.push(row);
        }
        //Populates the frame with assets only on 'blank' spots, allowing for layering.
        for(let array of arrays){
            //Used to track which x,y location the loop is at so characters can be added if the location in the final frame is 'blank'.
            let yIndex = 0;
            let xIndex = 0;
            //Loops through the sprite.
            for(let [i, row] of array.entries()){
                //Checks if the character is to be drawn within the set y dimension of the frame.
                if(i < yDimension){
                    for(let [i, character] of row.entries()){
                        //Checks if the character is to be drawn within the set x dimension of the frame.
                        if(i < xDimension){
                            //If the x,y location is blank, adds the character.
                            if(frame[yIndex][xIndex] === 'blank'){
                                frame[yIndex][xIndex] = character;
                            }
                            //Increments xIndex to start the next column.
                            xIndex++;
                        }
                    }
                }
                //Resets xIndex for the next row and increments yIndex to replace characters in the next row.
                xIndex = 0;
                //Increments the yIndex to start the next row.
                yIndex++;
            }
        }
        //Replaces 'blank' with ' ' for drawing to terminal.
        for(let array of frame){
            for(let character of array){
                if(character === 'blank'){
                    array[array.indexOf(character)] = ' ';  
                }
            }
        }
        return frame;
    },
    //Used to create a string from the frame array.
    arrayToString: function(array){
        let string = ``;   
        for(let row of array){
            for(let character of row){
                string+=character;
            }
            string += '\n';
        }
        return string;
    },

    //Can be used to convert string art to an array for drawing. 
    //Create a multi line string with String.raw` and begin on the next line. This is important especially if the asset includes backslashes which would normall escape.
    stringToArray: function(string){
        let array = [];
        for(let row of string.split('\n')){
            let rowArray = [];
            for(let character of row){
                rowArray.push(character);
            }
            array.push(rowArray);
        }
        array.shift();
        return JSON.stringify(array);
    },

    //Adds 'blank'/transparent margins to possition a sprite correctly in the frame.
    //Offset argument is an object such as {x:0, y:0}.
    //Moves the top left corner of the sprite from the top left of the frame according to the offset.
    //Negative coordinates are allowed and any portion of the sprite not in the frame will not be drawn.
    possitionSprite(array, offset){
        let possitionedSprite = [];
        //Creates a copy of the sprite to add margins/possition to while leaving the original sprite in tact.
        for(let row of array){
            let rowCopy = [];
            for(let character of row){
                rowCopy.push(character);   
            }
            possitionedSprite.push(rowCopy);
        }

        //Possitions sprite if y offset is positive.
        if(offset.y > 0){
            //Adds a blank margin to the top to move the sprite down according to the offset.
            for(let y = offset.y; y > 0; y--){
                possitionedSprite.unshift(['blank']);
            }
        }

        //Possitions sprite if x offset is positive.
        if(offset.x > 0){
            //Adds a blank margin to the left side to move the sprite right according to the offset.
            for(let row of possitionedSprite){
                for(let x = offset.x; x>0; x--){
                    row.unshift('blank');
                }
            }
        }
        
        //Possitions sprite if y offset is negative.
        if(offset.y < 0){
            for(let y = offset.y; y < 0; y++){
                possitionedSprite.shift();
            }
        }
        //Possitions sprite if x offset is negative.
        if(offset.x < 0){
            for(let row of possitionedSprite){
                for(let x = offset.x; x < 0; x++){
                    row.shift();
                }
            }
        }
        return possitionedSprite;
    },

    //Colors a sprite. Color should be supplied as a string escape sequence such as "\x1b[31m"
    //A helpful list of colors can be found here. https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
    //Simply replace 31 with the number in the FG column. 
    //Adding a 1 will make the color a lighter shade, 2 will make the color a dimmer shade. (\x1b[1;31m)
    colorSprite(array,color){
        //Creates a copy of the array to color while leaving the original asset intact.
        let coloredSprite = [];
        for(let row of array){
            let coloredRow = [];
            for(let character of row){
                if(character !== 'blank'){
                    coloredRow.push(color + character + '\x1b[0m');
                }else{
                    coloredRow.push(character);
                } 
            }
            coloredSprite.push(coloredRow);
        }
        // coloredSprite.push('\x1b[0m')
        return coloredSprite;
    },

    //Animates an array of multiline strings.
    //Use arrayToString() to convert an array asset to a multi line string.
    //Callback is the function that will run when the animation is complete.
    animate(array, fps, callback){
        let numberOfFrames = array.length;
        let index = 0;
        let animationLoop = function(){
            console.clear();
            console.log(array[index]);
            index++;
            numberOfFrames--;
            if(numberOfFrames === 0){
                clearInterval(animationLoopInterval);
                callback();
            }
        }
        animationLoopInterval = setInterval(animationLoop, 1000/fps);
    }
}
