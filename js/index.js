console.log('test')
//Window load start game function

//Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Instiate the playing card objects and link to assets
class Card {
    constructor(id, assetLink) {
        this.card = id;
        this.img = assetLink;
        this.width = '10'
        this.height = '20'
    }

    draw(w, h) {
        ctx.drawImage(this.img, w, h, this.width, this.height)
    }

}

//Card image paths
const cardPath = './Assets/Images/Cards/'
const cardType = ['cardDiamonds', 'cardClubs', 'cardHearts','cardSpades','cardJoker'];
let cardPaths = [];

function assignCardPaths() {
    for (let i = 0; i < cardType.length; i++) {
        if (cardType[i] === 'cardJoker') {
            cardPaths.push({id: cardType[i], assetLink: cardPath+cardType[i]+".png"});
        } else {
            for (let k = 0; k <= 12; k++) {
               typeRef = "";
               switch(k) {
                case 0:
                    typeRef = cardType[i]+"A";
                    break;   
                case 1:
                    typeRef = cardType[i]+2;
                    break;       
                case 2:
                    typeRef = cardType[i]+3;
                    break;  
                case 3:
                    typeRef = cardType[i]+4;
                    break;                        
                case 4:
                    typeRef = cardType[i]+5;
                    break;  
                case 5:
                    typeRef = cardType[i]+6;
                    break;  
                case 6:
                    typeRef = cardType[i]+7;
                    break;  
                case 7:
                    typeRef = cardType[i]+8;
                    break;      
                case 8:
                    typeRef = cardType[i]+9;
                    break;  
                case 9:
                    typeRef = cardType[i]+10;
                    break;  
                case 10:
                    typeRef = cardType[i]+"J";
                    break;  
                case 11:
                    typeRef = cardType[i]+"Q";
                    break;          
                case 12:
                    typeRef = cardType[i]+"K";
                    break;         
                default: 
                    typeRef = "cardJoker" //Additional Jokers handles any unexpected value, while keeping the game intact  
                } 
                cardPaths.push({id: typeRef, assetLink: cardPath+typeRef+".png"});
            }
       }
    }
}

assignCardPaths();

console.log(cardPaths);

