# **Find Your Hat**
## **Desctiption**
    This is a small game I created which was inspired by one of my all time favorites growing up: Maze Craze. The game featured randomly generated mazes and had a mode where you could not see the maze and had to memorize it as you played. 

## **Technologies**
    1. JavaScript
    2. Node.js v16.16.0

## **Usage**
    1. Download and install Node and NPM.
    2. Navigate to the project's directory in the command line install modules with the command "npm install".
    3. Run the script with the command "node main.js". For best results use windows cmd prompt.
    4. Play the game and enjoy.

## **Functionality**
    1. Generates a random maze using a recursive function.

    2. Validates the randomly generated maze with a custom maze solver based on the Hansel and Gretel bread crumb method.

    3. Renders sprites and builds frames for the game engine to display using a custom draw module. Sprites have transparent backgrounds allowing them to be layered easily.

    4. Manages assets allowing them to be easily created and added to the game. Assets can be created by using standard ANSI characters. Asset update methods can change the asset's color, possition, and current frame. 

    5. Tracks the game using a state object which allows for updates.

    7. Draws and updates assets using a custom game engine.

## **Credits**
    Thank you for the inspiration to create this game.
    1. Codecademy
    2. Maze Craze

## **License**
    GNU General Public License v3.0, see COPYING.txt for complete document.