﻿/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />




// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var spinButton: objects.Button;
var bet1btn: objects.Button;
var bet50btn: objects.Button;
var bet100btn: objects.Button;
var bet200btn: objects.Button;
var bet;
var resetButton: objects.Button;
var tiles: createjs.Bitmap[] = [];
var tileContainers: createjs.Container[] = [];

// Game Variables
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;

var betlabel: createjs.Text;
var betbg: createjs.Bitmap;
var winninglabel: createjs.Text;
var winningbg: createjs.Bitmap;
var creditlabel: createjs.Text;
var creditbg: createjs.Bitmap;


/* Tally Variables */
var grapes = 0;
var lemons = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/bgPic.png" },
    { id: "ptsbg", src: "assets/images/ptsbg.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" },
    { id: "spinclick", src: "assets/audio/drop22.au" }
];

var atlas = {
    "images": ["assets/images/atlas.png"],
    "frames": [
        [2, 2, 139, 141],
        [2, 145, 94, 49],
        [98, 145, 94, 49],
        [143, 2, 139, 141],
        [194, 145, 94, 49],
        [284, 2, 139, 141],
        [290, 145, 94, 49],
        [386, 145, 94, 49],
        [425, 2, 139, 141],
        [482, 145, 94, 49],
        [566, 2, 139, 141],
        [707, 2, 139, 141],
        [848, 2, 139, 139]
    ],

    "animations": {
        "seven": [0],
        "bet1": [1],
        "bet100": [2],
        "bar": [3],
        "bet200": [4],
        "blank": [5],
        "bet50": [6],
        "reset": [7],
        "cherry": [8],
        "spin": [9],
        "lemon": [10],
        "orange": [11],
        "bell": [12]
    },
};



// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;

/* Tally Variables */
var grapes = 0;
var lemons = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

var spinResult;
var fruits = "";

// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);

    // Load Texture Atlas
    textureAtlas = new createjs.SpriteSheet(atlas);

    //Setup statistics object
    setupStats();
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}


// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring

    stage.update();

    stats.end(); // end measuring
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "lemon";
                lemons++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "seven";
                sevens++;
                break;
        }
    }
    return betLine;
}

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    lemons = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

function spinReels() {
    // Add Spin Reels code here
    console.log(playerBet);
    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
    console.log(fruits);


    for (var tile = 0; tile < 3; tile++) {
        if (turn > 0) {
            game.removeChild(tiles[tile]);
        }

        tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
        tiles[tile].scaleX = 0.5;
        tiles[tile].scaleY = 0.5;
       
        tiles[tile].x = 80 + (120 * tile);
        tiles[tile].y = 398;

        game.addChild(tiles[tile]);
        //console.log(game.getNumChildren());
    }


}

// Callback function that allows me to respond to button click events
function spinButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    console.log(fruits);
}

// Callback functions that change the alpha transparency of the button


function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
            console.log(winnings);
        }
        else if (lemons == 3) {
            winnings = playerBet * 20;
            console.log(winnings);
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
            console.log(winnings);
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
            console.log(winnings);
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
            console.log(winnings);
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
            console.log(winnings);
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
            console.log(winnings);
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
            console.log(winnings);
        }
        else if (lemons == 2) {
            winnings = playerBet * 2;
            console.log(winnings);
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
            console.log(winnings);
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
            console.log(winnings);
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
            console.log(winnings);
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
            console.log(winnings);
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
            console.log(winnings);
        }
        else {
            winnings = playerBet * 1;
            console.log(winnings);
        }

        if (sevens == 1) {
            winnings = playerBet * 5;
            console.log(winnings);
        }
        winNumber++;
        // showWinMessage();
    }
    else {
        lossNumber++;
        //  showLossMessage();
    }

}

//bet
function betbtn1() {
    game.removeChild(betlabel);
    playerBet = 1;
    betbtn(1);
}

function betbtn50() {
    game.removeChild(betlabel);
    playerBet = 50;
    betbtn(50);
}

function betbtn100() {
    game.removeChild(betlabel);
    playerBet = 100;
    betbtn(100);
}

function betbtn200() {
    game.removeChild(betlabel);
    playerBet = 200;
    betbtn(200);
}

function betbtn(betvalue) {
  
    betlabel = new createjs.Text(betvalue, "25px Consolas", "#FF0000");
  
    betlabel.regX = betlabel.getMeasuredWidth() * 0.5;
    betlabel.regY = betlabel.getMeasuredHeight() * 0.5;
    betlabel.x = 240;
    betlabel.y = 315;

    game.addChild(betlabel);
  
}

function winbtn(winvalue) {
    winninglabel = new createjs.Text(winvalue, "25px Consolas", "#FF0000");
    winninglabel.regX = betlabel.getMeasuredWidth() * 0.5;
    winninglabel.regY = betlabel.getMeasuredHeight() * 0.5;
    winninglabel.x = 310;
    winninglabel.y = 315;

    game.addChild(winninglabel);
}

function createUI(): void {
    // instantiate my background
    background = new createjs.Bitmap(assets.getResult("background"));
    background.x = 3;
    background.y = 3;
    background.scaleX = 0.55;
    background.scaleY = 0.55;

    game.addChild(background);

    //bet background
    betbg = new createjs.Bitmap(assets.getResult("ptsbg"));
    betbg.scaleX = 0.55;
    betbg.scaleY = 0.55;
    betbg.x = 190;
    betbg.y = 310;
    game.addChild(betbg);

    //credit background
    creditbg = new createjs.Bitmap(assets.getResult("ptsbg"));
    creditbg.scaleX = 0.55;
    creditbg.scaleY = 0.55;
    creditbg.x = 70;
    creditbg.y = 310;
    game.addChild(creditbg);

    //winnning background
    winningbg = new createjs.Bitmap(assets.getResult("ptsbg"));
    winningbg.scaleX = 0.55;
    winningbg.scaleY = 0.55;
    winningbg.x = 310;
    winningbg.y = 310;
    game.addChild(winningbg);
    
    // Spin Button
    spinButton = new objects.Button("spin", 378, 570, false);
    game.addChild(spinButton);

    spinButton.on("click", spinReels);

    // Spin Button
    bet1btn = new objects.Button("bet1", 318, 570, false);
    game.addChild(bet1btn);

    bet1btn.on("click", betbtn1);

    // Spin Button
    bet50btn = new objects.Button("bet50", 258, 570, false);
    game.addChild(bet50btn);

    bet50btn.on("click", betbtn50);

    // Spin Button
    bet100btn = new objects.Button("bet100", 198, 570, false);
    game.addChild(bet100btn);

    bet100btn.on("click", betbtn100);

    // Spin Button
    bet200btn = new objects.Button("bet200", 138, 570, false);
    game.addChild(bet200btn);

    bet200btn.on("click", betbtn200);


    // Reset Button
    resetButton = new objects.Button("reset", 78, 570, false);
    game.addChild(resetButton);

    resetButton.on("click", function () {
        console.log("reset clicked");
    });
}


// Our Main Game Function
function main() {
    // instantiate my game container
    game = new createjs.Container();
    game.x = 20;
    game.y = 20;

    // Create Slotmachine User Interface
    createUI();


    stage.addChild(game);

}