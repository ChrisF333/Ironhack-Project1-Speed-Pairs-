//force window to top on load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };


//Code starts - declare important global variables
var timeAllowed = 15.0;
var attempts = 0;
var gameEnded = false;
//and declare audio file for background music
var backgroundMusic = new Audio('./Assets/Sounds/clock-running.wav') 

//Declare all DOM elements for regular referral
const introRef = document.getElementById('intro');
const gameAreaRef = document.getElementById('game-area');
const boardRef = document.getElementById('board');
const clockRef = document.getElementById('countdown');
const tickRef = document.getElementById('tick');
const pairsFoundRef = document.getElementById('pairs-found');
const loseBannerRef = document.getElementById('lose-banner');
const winBannerRef = document.getElementById('win-banner');
const loseDialogueRef = document.getElementById('lose-dialogue');
const loseHeaderRef = document.getElementById('lose-header');
const winDialogueRef = document.getElementById('win-dialogue');
const gameTitleRef = document.getElementById("game-title-one");
const gtRedRef = document.getElementById("gt-red");
const gtBlackRef = document.getElementById("gt-black");

//Handle start button
const startBtnRef = document.getElementById('btn-start');
startBtnRef.addEventListener('click', startGame);

//Start game function
function startGame() {
    introRef.style.display = "none";
    gameAreaRef.style.display = "flex";
    boardRef.style.setProperty('visibility', 'visible');
    clockRef.style.display = "block";
    attempts += 1;
    backgroundMusic.play();
    backgroundMusic.loop = true;
    setClock();
    gameTitleAnimation();    
}

//Instiate the playing card objects and link to assets
class Card {
    constructor(name, id, assetLink) {
        this.name = name;
        this.id = id;
        this.img = assetLink;
        this.width = '10'
        this.height = '20'
    }
}

//Card image paths - avoiding hard-coding as much as possible
const cardPath = './Assets/Images/Cards/'
const cardType = ['cardDiamonds', 'cardClubs', 'cardHearts','cardSpades','cardJoker'];
let cardPaths = [];

function assignCardPaths() {
    for (let i = 0; i < cardType.length; i++) {
        if (cardType[i] === 'cardJoker') {
            cardPaths.push({name: cardType[i], id: "Jk" ,assetLink: cardPath+cardType[i]+".png"});
        } else {
            for (let k = 0; k <= 12; k++) {
               typeRef = "";
               typeid = ""
               switch(k) {
                case 0:
                    typeRef = cardType[i]+"A";
                    typeId = "A";
                    break;   
                case 1:
                    typeRef = cardType[i]+2;
                    typeId = "2";
                    break;       
                case 2:
                    typeRef = cardType[i]+3;
                    typeId = "3";
                    break;  
                case 3:
                    typeRef = cardType[i]+4;
                    typeId = "4";
                    break;                        
                case 4:
                    typeRef = cardType[i]+5;
                    typeId = "5";
                    break;  
                case 5:
                    typeRef = cardType[i]+6;
                    typeId = "6";
                    break;  
                case 6:
                    typeRef = cardType[i]+7;
                    typeId = "7";
                    break;  
                case 7:
                    typeRef = cardType[i]+8;
                    typeId = "8";
                    break;      
                case 8:
                    typeRef = cardType[i]+9;
                    typeId = "9";
                    break;  
                case 9:
                    typeRef = cardType[i]+10;
                    typeId = "10";
                    break;  
                case 10:
                    typeRef = cardType[i]+"J";
                    typeId = "J";
                    break;  
                case 11:
                    typeRef = cardType[i]+"Q";
                    typeId = "Q";
                    break;          
                case 12:
                    typeRef = cardType[i]+"K";
                    typeId = "K";
                    break;         
                default: 
                    typeRef = "cardJoker"; //Additional Jokers handles any unexpected value, while keeping the game intact  
                    typeId = "Jk";
                } 
                cardPaths.push({name: typeRef, id: typeId, assetLink: cardPath+typeRef+".png"});
            }
       }
    }
}

assignCardPaths();

//Assemble the deck of cards 
var cardDeck = [];
function getDeck() {
    cardPaths.forEach(e => {
        cardDeck.push(new Card(e.name, e.id, e.assetLink));
    });
    return cardDeck;
}

getDeck();

//Refine to 25 cards (12 pairs and 1 joker) and shuffle - this is the shuffled deck for the game
function chooseCards(cardDeck) {
    let shuffledDeck = [];
    let cardIds = cardDeck.map(item => item.id).filter((value, index, self) => self.indexOf(value) === index && value !== 'Jk');
    cardIds.sort(() => Math.random() - 0.5);    
    for (let i = 0; i < 12; i++) {
        let selectedCards = cardDeck.filter((el) => el.id === cardIds[i]);
        selectedCards.sort(() => Math.random() - 0.5);
        //shuffledDeck.push(selectedCards.slice(0,2)); //make sure to just push the object and not the array
        shuffledDeck.push(selectedCards[0]); 
        shuffledDeck.push(selectedCards[1]);
    };
    shuffledDeck.push((cardDeck.filter((el) => el.id === 'Jk'))[0]); //make sure to just push the object and not the array
    shuffledDeck.sort(() => Math.random() - 0.5);
    return shuffledDeck;
}

chooseCards(cardDeck);

//Draw the cards on the canvas
function drawCards(shuffledDeck) {
    let board = document.getElementById('board'); 
    for(let i = 0; i < shuffledDeck.length; i++) {
        let cardItem = document.createElement('img');
        cardItem.src = shuffledDeck[i].img; 
        //cardItem.setAttribute = ('class', 'playing-card');
        cardItem.class = 'playing-card';
        cardItem.id = shuffledDeck[i].id;
        cardItem.addEventListener('click', cardClicked, false);
        board.appendChild(cardItem);
    }
}

drawCards(chooseCards(cardDeck));

//declare key game monitoring variables
let numberCardsSelected = 0;
let cardsSelected = [];
let pairsFound = 0;

//Handle card click events and trigger matching when two are selected
function cardClicked(e) {
    var a = e.target || e.srcElement;
    if(a.id === 'Jk') { gameOver(pairsFound,true); } //Clicking the joker triggers instant game over
    if (a.class === 'playing-card') {
        numberCardsSelected += 1
        a.style.border = "3px solid orange";
        a.class = "playing-card-selected";
        cardsSelected.push(a);
    } else {
        numberCardsSelected -= 1
        a.class = 'playing-card';
        a.style.border = "none";
        cardsSelected = cardsSelected.filter((el) => el !== a);
    };
    if (numberCardsSelected === 2) {
        cardMatcher(cardsSelected);
        cardsSelected = [];
        numberCardsSelected = 0;
    };
    if (pairsFound >= 12) {
        return gameOver();
    };
    return pairsFound;    
}

//Compare the two cards and handle matched and unmatched events
function cardMatcher(cardsSelected) {
    if (cardsSelected[0].id === cardsSelected[1].id) {
        cardsSelected.forEach((el) => {
            el.src="./Assets/Images/Others/cardBack_green5.png";
            el.class = "paired"
            el.style.border = "1px solid darkgrey";
            el.removeEventListener('click', cardClicked);
        });
        matchFoundAnimation();
        return pairsFound += 1;
    } else {
        cardsSelected.forEach((el) => {
            el.class = "playing-card"
            el.style.border = "none";
            //return false
        });
        noMatchAnimation();
    }    
}

//Shows and then fades out green tick to indicate match found
function matchFoundAnimation() {
   tickRef.style.opacity = 1;
   let fadeEffect = setInterval(function () {
    if (!tickRef.style.opacity) {
        tickRef.style.opacity = 1;
    }
    if (tickRef.style.opacity > 0) {
        tickRef.style.opacity -= 0.1;
    } else {
        clearInterval(fadeEffect);
    }
}, 50);
    const matchSound = new Audio('./Assets/Sounds/match_sound.wav');
    matchSound.play();
}

//Shakes the board to indicate no match is found
function noMatchAnimation() {
    boardRef.style.setProperty('margin-left','25px');
    setTimeout(function() {
        boardRef.style.setProperty('margin-right','25px');
    },50)
    setTimeout(function() {
        boardRef.style.setProperty('margin-left','25px');
    },50)
    setTimeout(function() {
        boardRef.style.setProperty('margin-right','25px');
    },50)
    setTimeout(function() {
       boardRef.style.setProperty('margin-left','25px');
    },50)
    setTimeout(function() {
        boardRef.style.setProperty('margin-left','10px')
        boardRef.style.setProperty('margin-right','10px');
    },10)
    const noMatchSound = new Audio('./Assets/Sounds/nomatch_sound.wav');
    noMatchSound.play();
}



function gameTitleAnimation() {
    let titleTimer = 30.0;
    let gameTitleClock = setInterval(function () {
        if(gameEnded === true) {
            clearInterval(gameTitleClock)
        } else { 
            if (gtRedRef.style.color === "red") {
                gtRedRef.style.setProperty('color', 'black'); 
            } 
            else {
                gtRedRef.style.setProperty('color', 'red') 
            };
            if (gtBlackRef.style.color === "black") {
                gtBlackRef.style.setProperty('color', 'red');
            } else {
                gtBlackRef.style.setProperty('color', 'black');
            };
            if (gameTitleRef.style.border === "2pt solid black") {
                gameTitleRef.style.setProperty('border', '2pt solid red');
            } else {
                gameTitleRef.style.setProperty('border', '2pt solid black');
            };
        }       
        titleTimer -= 0.75;
    }, 750);
}

//Set the game clock and handle timeout, pairs found updates and game title animation
function setClock() {
    let timeLeft = timeAllowed; //set at top of code
    let gameClock = setInterval(function () {
        if(gameEnded === true) {
            clearInterval(gameClock);
        } else if(timeLeft <= 0){
          clearInterval(gameClock);
          clockRef.innerHTML = "Time Up";
          gameOver(pairsFound);
        } else {
            clockRef.innerHTML = timeLeft.toFixed(2); // + " seconds remaining";
            pairsFoundRef.innerHTML = pairsFound;
          if (timeLeft < 10) {
            clockRef.style.color = 'red';
            clockRef.innerHTML = timeLeft.toFixed(2);
            pairsFoundRef.innerHTML = pairsFound;
          }
        }
        timeLeft -= 0.01;
      }, 10);
}

//Handle random lose sounds
function lossSound() {
    let loseSounds = [];
    loseSounds.push(new Audio('./Assets/Sounds/Laugh.wav'));
    loseSounds.push(new Audio('./Assets/Sounds/crowd-laughing.wav'));
    loseSounds.push(new Audio('./Assets/Sounds/woman-laugh.wav'));
    loseSounds.push(new Audio('./Assets/Sounds/losing_short_tune.wav'));
    loseSounds.push(new Audio('./Assets/Sounds/other_laugh.wav'));
    soundNum = Math.floor(Math.random() * loseSounds.length)
    loseSounds[soundNum].play();
    loseSounds.loop = false;
    loseSounds.playbackRate = 5;
}

//Handle game over events
function gameOver(pairsFound,jokerPresent) {
    gameEnded = true;     
    backgroundMusic.pause();
    gameAreaRef.style.display = 'none';
    boardRef.style.display = "none";
    clockRef.style.display = "none";
    if (pairsFound < 12) {
        lossSound();
        loserDialogues = [
            'It\'s such a joy watching you fail. I just wanted you to know that.', 'Does your mother know how much of a failure you are?'
            ,'Try, try and try again. And then give up. Loser.', `How many attempts is that now? Oh yes it\'s ${attempts}. Not that we\'re keeping score of course...`
            ,'Perhaps you should ask Amanda to take a look at your typos...', 'There\'s no easy way to say this: you suck. I mean, you really, really do. No offence.'
            ,'When I said Speed Pairs was <i>unbeatable</i>, what exactly were you expecting?','Roses are red, violets are blue, you really suck, sad but it\'s true'
            ,'Your failure is making Speed Pairs Great Again. Thank you.'
        ];
        if (attempts === 1 && !jokerPresent) {
                loseHeaderRef.innerHTML = 'You lost.'
                loseDialogueRef.innerHTML = `Wow, that wasn\'t even close. You\'re really terrible at this.`
        } else if (jokerPresent === true) {
                loseHeaderRef.innerHTML = 'Smh.'
                loseDialogueRef.innerHTML = `I tell you not to click on the joker and you click on the joker. You're not the sharpest tool in the toolbox are you?`;
        } 
        else {
            let n = Math.floor(Math.random() * loserDialogues.length);
            loseDialogueRef.innerHTML = loserDialogues[n];
            loseHeaderRef.innerHTML = 'You lost. Again.'
        }
        loseBannerRef.style.display = "flex";
    } else {
        //const winDialogueRef = document.getElementById('win-dialogue');
        let timeSpent = parseFloat((attempts * timeAllowed) / 60).toFixed(2);
        const winSound = new Audio('./Assets/Sounds/Applause.wav');
        winSound.play();
        winDialogueRef.innerHTML = `Congratulations, you just wasted ${timeSpent} minutes of your life trying to beat me. Now which one of us is the loser?`
        winBannerRef.style.display = "flex";
    }
}

//Clear the board by looping through and removing all the card elements
function clearBoard() {
    //const boardRef = document.getElementById('board');
    while (boardRef.firstChild) { //true false test to see if any child element still exists
        boardRef.removeChild(boardRef.lastChild);
    }
}

//Handle try again button
const tryAgainBtnRef = document.getElementById('btn-try-again');
tryAgainBtnRef.addEventListener('click', tryAgain);

//Try again function
function tryAgain() {
    clearBoard();
    reShuffle = chooseCards(cardDeck); 
    drawCards(reShuffle);
    pairsFound = 0;
    numberCardsSelected = 0;
    cardsSelected = [];
    attempts += 1;
    gameEnded = false;
    backgroundMusic.play();
    backgroundMusic.loop = true;
    gameAreaRef.style.display = "flex";
    loseBannerRef.style.display = "none";
    boardRef.style.display = "flex";
    clockRef.style.display = "block";
    document.getElementById('countdown').style.color = 'white';
    setClock();
    gameTitleAnimation();
}

//Handle start over button
const startOverBtnRef = document.getElementById('btn-start-over');
startOverBtnRef.addEventListener('click', startOver);

//Clear attempts and start over
function startOver() {
    attempts = 0;
    clearBoard();
    reShuffle = chooseCards(cardDeck); 
    drawCards(reShuffle);
    pairsFound = 0;
    numberCardsSelected = 0;
    cardsSelected = [];
    attempts = 0;
    gameEnded = false;
    backgroundMusic.play();
    backgroundMusic.loop = true;
    winBannerRef.style.display = "none";
    gameAreaRef.style.display = 'flex';
    boardRef.style.display = "flex";
    clockRef.style.display = "block";
    document.getElementById('countdown').style.color = 'white';
    setClock();
    gameTitleAnimation();
}

//Code ends.

