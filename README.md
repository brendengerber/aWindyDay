# **A Windy Day**
## **Desctiption**
This is a small game I created which was inspired by one of my all time favorites growing up: Maze Craze. The game featured randomly generated mazes and had a mode where you could not see the maze and had to memorize it as you played. 

## **Technologies**
1. JavaScript
2. Node.js v16.16.0

## **Usage**
1. If you do not have Node.js and NPM installed, you can download them from thier official [website](https://nodejs.org/en/).
2. Navigate to the project's directory in the command line install modules with the command "npm install".
3. Run the script with the command "node main.js". For best results use windows cmd prompt.
4. Play the game and enjoy.

## **Functionality**
1. Generates a random maze using a recursive function.
2. Validates the randomly generated maze with a custom maze solver based on the Hansel and Gretel bread crumb method.   
3. Manages assets allowing them to be easily created and added to the game. Assets can be created by using standard ANSI characters. Asset update methods can change the asset's current position, color, and shape. Asset sprites have transparent backgrounds allowing them to be easily layered.
4. Renders sprites and builds frames for the game engine to display using a custom draw module. 
5. Draws and updates assets using a custom game engine.
6. Tracks the game using a state object.
7. Records stats locally for each individual player using custom events.

## **Credits**
Thank you for the inspiration to create this game.
1. Codecademy
2. Maze Craze

## **License**
GNU General Public License v3.0, see COPYING.txt for complete document.
