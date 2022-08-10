module.exports = {    
    //Takes an array of array sprites to composite into a single frame.
    //Array sprites should be rectangular i.e., all rows should be the same length, and all columns should be the same length. The draw.makeRectangular method can help by adding blank space to the end of shorter rows. 
    //Layers assets and treats "blank" as transparent which allows for transparent asset backgrounds and layering.
    //The first array will be the top layer, while the final array will be the bottom layer.
    //Dimensions arg should be an object such as {x:, y:}. Anything positioned outside of those dimensions will not be drawn.
    //Default dimensions are the longest x and the longest y dimensions present in the array of sprites.
    createFrame: function(arrays, dimensions){
        let frame;
        let xDimension = 0;
        let yDimension = 0;
        //Sets the frame's dimensions to the dimensions arg if one was given.
        if(dimensions !== undefined){
            xDimension = dimensions.x;
            yDimension = dimensions.y;
        //Sets the frame's dimensions in case no dimensions arg was given.
        }else{
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
        //Uses the dimensions to build a transparent frame filled with "blank".
        frame = Array.from({length: yDimension}, () => Array(xDimension).fill("blank"));        

        //Populates the frame with assets only on 'blank' spots, allowing for layering.
        for(let array of arrays){
            //Used to track which x,y location the loop is at so characters can be added if the location in the final frame is 'blank'.
            let yIndex = 0;
            let xIndex = 0;
            //Loops through the sprite.
            for(let row of array){
                for(let character of row){
                    if(frame[yIndex][xIndex] === 'blank'){
                        frame[yIndex][xIndex] = character;
                    }
                    //Increments xIndex to start the next column.
                    xIndex++;
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

    //Adds 'blank'/transparent margins to position a sprite correctly in the frame.
    //Offset argument is an object such as {x:0, y:0}.
    //Dimensions argument is an object such as {x:0, y:0} representing size of the final frame.
    //Moves the top left corner of the sprite from the top left of the frame according to the offset.
    //Negative coordinates are allowed and any portion of the sprite not in the frame will not be drawn.
    positionSprite(array, offset, dimensions){
        let positionedSprite = [];
        //Creates a copy of the sprite to add margins/position to while leaving the original sprite in tact.
        for(let row of array){
            let rowCopy = [];
            for(let character of row){
                rowCopy.push(character);   
            }
            positionedSprite.push(rowCopy);
        }

        //Possitions sprite if x offset is positive.
        if(offset.x > 0){
            //Adds a blank margin to the left side to move the sprite right according to the offset.
            for(let row of positionedSprite){
                for(let x = offset.x; x>0; x--){
                    row.unshift('blank');
                }
            }
        }

        //Possitions sprite if y offset is positive.
        if(offset.y > 0){
            //Adds a blank margin to the top to move the sprite down according to the offset.
            for(let y = offset.y; y > 0; y--){
                //Adds a row of the proper length filled with 'blank'
                positionedSprite.unshift(Array.from({length: positionedSprite[0].length}, () => "blank"))
            }
        }

        //Possitions sprite if x offset is negative.
        if(offset.x < 0){
            for(let row of positionedSprite){
                row.splice(0, Math.abs(offset.x));
            }
        }

        //Possitions sprite if y offset is negative.
        if(offset.y < 0){
            row.splice(0,Math.abs(offset.y));
        }

        //Possitions the sprite if x offset brings part of the array out of the frame on the right.
        if(positionedSprite[0].length > dimensions.x){
            let outOfFrame =  positionedSprite[0].length - dimensions.x; 
            for(let row of positionedSprite){
                row.splice(row.length - outOfFrame, outOfFrame);
            }
        }

        //Possitions the sprite if y offset brings part of the array out of the frame on the bottom.
        if(positionedSprite.length > dimensions.y){
            let outOfFrame =  positionedSprite.length - dimensions.y;
            positionedSprite.splice(positionedSprite.length - outOfFrame, outOfFrame);
        }
        return positionedSprite;
    },

    //Colors a sprite. Color should be supplied as a string escape sequence such as "\x1b[31m".
    //A helpful list of colors can be found here. https://en.wikipedia.org/wiki/ANSI_escape_code#Colors.
    //Simply replace 31 with the number in the FG column. 
    //Adding a 1 will make the color a lighter shade, 2 will make the color a dimmer shade. (\x1b[1;31m).
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
    //Callback will run when the animation is complete.
    animate(array, fps, callback){      
        //Prevents inputs from being buffered and potentially skipping the prompts following the animation.
        process.stdin.resume();
        process.stdin.setRawMode(true);

        let numberOfFrames = array.length;
        let index = 0;
        let animationLoop = function(){
            console.clear();
            console.log(array[index]);
            index++;
            numberOfFrames--;
            if(numberOfFrames  === 0){
                clearInterval(animationLoopInterval);
                callback();
            }
        }
        animationLoopInterval = setInterval(animationLoop, 1000/fps);
    },

    //Creates a string from the frame array asset.
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

    //Converts string art to an array for drawing. 
    //Argument should be a multi line string with String.raw` and begin on the next line. This is important especially if the asset includes backslashes which would normall escape.
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

    //Adds 'blank' space to the end of each row of an asset array making it rectangular for drawing.
    makeRectangular: function(array){
        let rectangularArray = array;
        let maxLength = 0;
        for(let row of rectangularArray){
            if(row.length > maxLength){
                maxLength = row.length;
            }
        }
        for(let row of rectangularArray){
            if(row.length < maxLength){
                for(let i = (maxLength - row.length); i > 0; i--){
                    row.push('blank');
                }
            }
        }
        return JSON.stringify(rectangularArray);
    }
};
