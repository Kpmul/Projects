const topLeft = document.getElementById("circle1");                             // Assign html buttons to variables
const topRight = document.getElementById("circle3");
const bottomLeft = document.getElementById("circle2");
const bottomRight = document.getElementById("circle4");
const startButton = document.getElementById("startButton");
const onOffButton = document.getElementById("onOff");
const currentScore = document.getElementById("scoreButton");
const recordScore = document.getElementById("recordButton");
let seq = [];                                                                   // Assign local variables
let playerSeq = [];
let level = 0;                                                                  // 'level' starts at 1 and represents game round
let turn = 0;                                                                   // 'turn' starts at 0 and represents individual signals
let score = 0;
let personalBest = 0;
let interval;
let wrong;
let playerClock;
currentScore.innerHTML = (score).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});          // Set score displays to hold
recordScore.innerHTML = (personalBest).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});    // two digits e.g 00, 01, 02  


startButton.addEventListener('click', function onClick(event) {                 // Add click event to turn on game
    onOffButton.style.backgroundColor = "Green";                                // Change on on/off light to green
    document.getElementById("startButton").style.pointerEvents = "none";        // Turn off ability to click button while game is on
    setTimeout(activateGame, 2000);                    
    clickDisable();                             // Stall game activation 2 seconds (Total of three seconds when combined with function below)
});
topLeft.addEventListener('click', function onClick(event){                      // Add click event to yop left Button
    playerSeq.push(1);                                                          // Push number '1' onto a 'Player Sequence' array
    flashTL();                                                                  // Flash button when clicked
    playerTurn();                                                               // Activate 'playerTurn' function
})
bottomLeft.addEventListener('click', function onClick(event){                   // Add click event to bottom left button
    playerSeq.push(2);                                                          // Push number '2' onto a 'Player Sequence' array
    flashBL();
    playerTurn();

}) 
topRight.addEventListener('click', function onClick(event){                     // Repeat for next button
    playerSeq.push(3);
    flashTR();
    playerTurn();
})
bottomRight.addEventListener('click', function onClick(event){                  // Repeat for next button
    playerSeq.push(4);
    flashBR();
    playerTurn();
})

function activateGame(){                                                        // Function called when start button is clicked
    level = 1;                                                                  //  Set/Reset variables to starting points
    turn = 0;
    interval = 0;
    seq = [];                                                                   // Will store computer's sequence array
    playerSeq = [];                                                             // Will store player's sequence array
    
    
    for(let i=0;i<20;i++){                                                      // For loop that fills computer's array
        var rand = (Math.floor(Math.random() * 4) +1);                          // with random numbers  
        seq.push(rand);                                                         // Uses Math.random and Math.floor to give a whole number 
    }                                                                           // between 1 and 4 inclusively 

    interval = setInterval(gameTurn, 1000);                                     // Uses 'setInterval' to call 'gameTurn' every 1000/ms
}                                                                               // Game starts off flashing lights every 1500/ms (in combination with 'gameTurn' function)
                                                                                
function gameTurn(){   
    clickDisable();                                                             // Disable player's ability to click while game's turn
    if(turn == level){                                                          // If number of signals reaches current game round
        clearInterval(interval);                                                // use 'clearInterval' to stop calling 'gameTurn'
        playerTimer(); 
        playerTurn();                                                        // Timer starts for player's turn
    }
    else{                                                                       // Until full sequence for round is finished
        setTimeout(() => {                                                      // Set 500/ms delays between game's signals and 
            if(seq[turn] == 1){                                                 // flash button depending on the random number at 
                flashTL();                                                      // index 'turn' in computer's sequence array
            }
            if(seq[turn] == 2){
                flashBL();
            }
            if(seq[turn] == 3){
                flashTR();
            }
            if(seq[turn] == 4){
                flashBR();
            }
            turn++;                                                             // Increment number of signals completed
        }, 400); 
    }
}

function playerTurn(){    
    clickEnable();                                                              // When button is clicked in response to game, 'playerTurn' is called
    resetTimer();                                                               // and player's timer is resest to 0 on click                                            

    if(playerSeq[playerSeq.length-1] !== seq[playerSeq.length-1]) {             // If the latest number pushed onto player's array when button is clicked
       playerLoses();                                                           // is not equal to the number in the same position of the compter's array
    }                                                                           // player's sequence does not match computer's and player loses game
    else if(playerSeq.length === level){                                        
        playerTimerStop();                                                      // If it does match, the player's timer stops
        score++;                                                                // Score increments
        level++;                                                                // Level increments
        turn = 0;                                                               // Reset turn to zero so computer can start flash sequence form the start
        playerSeq = [];                                                         // Empty player's array so can compare full response sequence next player's turn

        if(level > 5 && level < 10){                                            // If level goes over 5, shorten the 'gameTurn' interval calls
            interval = setInterval(gameTurn, 800);                              // Speeds up flash intervals
        }
        else if(level > 9 && level < 14){                                       // Repeat when level gets over 9
            interval = setInterval(gameTurn, 600);
        }
        else if(level > 13){                                                    // Repeat when level gets over 13
            interval = setInterval(gameTurn, 450);
        }
        else{                                                                   // Otherwise keep flashing at 1000/ms
            interval = setInterval(gameTurn, 1000);
        }    
    }
}

function playerLoses(){                                                         // If player loses
    clickDisable();                                                             // Stop player from being able to click anything
    if(score > personalBest){                                                   
        personalBest = score;                                                   // Saves personal best score by comparing it against score
    }

    wrong = setInterval(flashAll,400);                                          // Call the 'flashAll' function repeatedly to flash all buttons
    setTimeout(stop, 2000);                                                     // for 2000/ms (5 times in total) 
    currentScore.innerHTML = (score).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});    // set current score in right hand display
    recordScore.innerHTML = (personalBest).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});  // set personal best in left hand display
    onOffButton.style.backgroundColor = "Red";                                  // Change on/off button back to red
    score = 0;                                                                  // Reset score to 0
    playerTimerStop();                                                          // Stop player timer
}

function clickDisable(){  
    document.getElementById("startButton").style.pointerEvents = "none";        // Function to turn off click events on all buttons                      
    document.getElementById("circle1").style.pointerEvents = "none";             
    document.getElementById("circle2").style.pointerEvents = "none";
    document.getElementById("circle3").style.pointerEvents = "none";
    document.getElementById("circle4").style.pointerEvents = "none";
}
function clickEnable(){                                                         // Function to turn on click events on all buttons
    document.getElementById("startButton").style.pointerEvents = "auto";          
    document.getElementById("circle1").style.pointerEvents = "auto";
    document.getElementById("circle2").style.pointerEvents = "auto";
    document.getElementById("circle3").style.pointerEvents = "auto";
    document.getElementById("circle4").style.pointerEvents = "auto";
}

function flashAll(){                                                              // Function to flash all lights simultaneously
    flashTL();
    flashBL();
    flashTR();
    flashBR();
}
function stop(){                                                                  // Function to stop call to 'flashAll' when player is wrong  
    clearInterval(wrong);
    document.getElementById("startButton").style.pointerEvents = "auto";          // Turn all click events back on
    document.getElementById("circle1").style.pointerEvents = "auto";
    document.getElementById("circle2").style.pointerEvents = "auto";
    document.getElementById("circle3").style.pointerEvents = "auto";
    document.getElementById("circle4").style.pointerEvents = "auto";
}
function playerTimer(){                                                            // Sets a 5 second timer for player to respons
    playerClock = setTimeout(playerLoses, 5000);                                   // Call to 'playerLoses' if nothing is clicked in 5 seconds 
}
function playerTimerStop (){                                                       // Function to stop the player timer when game's turn
    clearTimeout(playerClock);
}
function resetTimer(){                                                             // Function to reset player's timer  
    playerTimerStop();                                                             // Used everytime a signal is clicked
    playerTimer();
}
function flashTL(){                                                                // Function to 'flash' top left button
    topLeft.style.backgroundColor = "rgb(165, 253, 165)";                          // RGB is changed to lighter colour
    setTimeout(changeBack, 200);                                                   // Call to 'changeBack' to reset colour to normal colour after 200/ms
}
function flashBL(){                                                                // Function repeated for all buttons 
    bottomLeft.style.backgroundColor = "rgb(255, 255, 213)  ";
    setTimeout(changeBack, 200);
}
function flashTR(){
    topRight.style.backgroundColor = "rgb(250, 120, 120)";
    setTimeout(changeBack, 200);
}
function flashBR(){
    bottomRight.style.backgroundColor = "rgb(141, 141, 255)";
    setTimeout(changeBack, 200);
}
function changeBack(){                                                              // Sets the RGB back to the orignal colour on all buttons
    topLeft.style.backgroundColor = "rgb(7, 227, 7)";
    bottomLeft.style.backgroundColor = "rgb(255, 255, 0)";
    topRight.style.backgroundColor = "rgb(252, 0, 0)";
    bottomRight.style.backgroundColor = "rgb(0, 0, 248) ";
}