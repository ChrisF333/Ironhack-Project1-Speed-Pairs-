console.log('test')
//Window load start game function

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
cardDeck = [];
function getDeck() {
    cardPaths.forEach(e => {
        cardDeck.push(new Card(e.name, e.id, e.assetLink));
    });
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
        let imgString = shuffledDeck[i].img;
        cardItem.src = shuffledDeck[i].img; 
        //cardItem.setAttribute = ('class', 'playing-card');
        cardItem.class = 'playing-card';
        cardItem.id = shuffledDeck[i].id;
        cardItem.addEventListener('click', cardClicked, false);
        board.appendChild(cardItem);
        console.log(cardItem.src);
    }
}

drawCards(chooseCards(cardDeck));

//declare key game monitor variables
let cardsClicked = 0;
let pairsFound = 0;

function cardClicked(e) {
    //if joker then call game over function
    var a = e.target || e.srcElement;
    console.log(a.id);
    if (a.class === 'playing-card') {
        a.style.border = "2px solid orange";
        a.class = "playing-card-selected";
        console.log(a.class);
    } else {
        a.class = 'playing-card';
        a.style.border = "none";
        console.log(a.class);
    }
    
}



console.log(chooseCards(cardDeck));
