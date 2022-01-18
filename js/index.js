console.log('test')

//force window to top on load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }


//Code starts - declare importaant global variables
var timeAllowed = 30.0;
var attempts = 0;
var gameEnded = false;

//Handle start button
const startBtnRef = document.getElementById('btn-start');
startBtnRef.addEventListener('click', startGame);

//Start game function
function startGame() {
    const introRef = document.getElementById('intro');
    const boardRef = document.getElementById('board');
    const clockRef = document.getElementById('countdown');
    introRef.style.display = "none";
    boardRef.style.setProperty('visibility', 'visible');
    clockRef.style.display = "block";
    attempts += 1;
    setClock();
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

    draw(x, y) {
        ctx.drawImage(this.img, x, y, this.width, this.height)
    }

}

//Card image paths
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

//Assemble the deck of cards (select appropriate number of cards here?)
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
    //let x = 0;
    //let y = 0;
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

//declare key game monitor variables
let numberCardsSelected = 0;
let cardsSelected = [];
let pairsFound = 0;

//Handle card click events and trigger matching when two are selected
function cardClicked(e) {
    var a = e.target || e.srcElement;
    console.log(a.id);
    if(a.id === 'Jk') { gameOver(pairsFound); } //Clicking the joker triggers instant game over
    if (a.class === 'playing-card') {
        numberCardsSelected += 1
        a.style.border = "2px solid orange";
        a.class = "playing-card-selected";
        cardsSelected.push(a);
        //console.log(a.class);
        //console.log(cardsSelected);
    } else {
        numberCardsSelected -= 1
        a.class = 'playing-card';
        a.style.border = "none";
        cardsSelected = cardsSelected.filter((el) => el !== a);
        //console.log(a.class);
        //console.log(cardsSelected);
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
    console.log(cardsSelected);
    console.log(numberCardsSelected);
    if (cardsSelected[0].id === cardsSelected[1].id) {
        console.log("cards match!");
        cardsSelected.forEach((el) => {
            el.src="./Assets/Images/Others/cardBack_green5.png";
            el.class = "paired"
            el.style.border = "1px solid darkgrey";
            el.removeEventListener('click', cardClicked);
        });
        matchFoundAnimation();
        return pairsFound += 1;
    } else {
        console.log("cards do not match");
        cardsSelected.forEach((el) => {
            el.class = "playing-card"
            el.style.border = "none";
            //return false
        });
        noMatchAnimation();
    }
    console.log(cardsSelected);
}

//Shows and then fades out green tick
function matchFoundAnimation() {
   const tickRef = document.getElementById('tick');
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
}, 30);
}

//Shakes the board to indicate no match is found
function noMatchAnimation() {
    const boardRef = document.getElementById('board');
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
}

//Set the game clock and handle timeout
function setClock() {
    let timeLeft = timeAllowed; //set at top of code
    let gameClock = setInterval(function () {
        if(gameEnded === true) {
            clearInterval(gameClock);
        } else if(timeLeft <= 0){
          clearInterval(gameClock);
          document.getElementById("countdown").innerHTML = "Time Up";
          gameOver(pairsFound);
        } else {
          document.getElementById("countdown").innerHTML = timeLeft.toFixed(2); // + " seconds remaining";
        }
        timeLeft -= 0.01;
      }, 10);
}

//Handle game over events
function gameOver(pairsFound) {
    console.log('Game Over!');
    gameEnded = true;     
    const boardRef = document.getElementById('board');
    const clockRef = document.getElementById('countdown');
    const loseBannerRef = document.getElementById('lose-banner');
    const winBannerRef = document.getElementById('win-banner');
    boardRef.style.display = "none";
    clockRef.style.display = "none";
    if (pairsFound < 12) {
        loseBannerRef.style.display = "flex";
    } else {
        const winDialogueRef = document.getElementById('win-dialogue');
        let timeSpent = (attempts * timeAllowed) / 60;
        winDialogueRef.innerHTML = `Congratulations, you just wasted ${timeSpent} minutes of your life trying to beat me. Now which one of us is the loser?`
        winBannerRef.style.display = "flex";
    }
}

//Clear the board by looping through and removing all the card elements
function clearBoard() {
    const boardRef = document.getElementById('board');
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
    attempts += 1;
    gameEnded = false;
    const loseBannerRef = document.getElementById('lose-banner');
    const boardRef = document.getElementById('board');
    const clockRef = document.getElementById('countdown');
    loseBannerRef.style.display = "none";
    boardRef.style.display = "flex";
    clockRef.style.display = "block";
    setClock();
}

//Handle start over button
const startOverBtnRef = document.getElementById('btn-start-over');
startOverBtnRef.addEventListener('click', startOver);

//Clear attempts and start over
function startOver() {
    console.log('button working')
    attempts = 0;
    clearBoard();
    reShuffle = chooseCards(cardDeck); 
    drawCards(reShuffle);
    pairsFound = 0;
    attempts += 1;
    gameEnded = false;
    const WinBannerRef = document.getElementById('win-banner');
    const boardRef = document.getElementById('board');
    const clockRef = document.getElementById('countdown');
    WinBannerRef.style.display = "none";
    boardRef.style.display = "flex";
    clockRef.style.display = "block";
    setClock();
}
//console.log(chooseCards(cardDeck));

