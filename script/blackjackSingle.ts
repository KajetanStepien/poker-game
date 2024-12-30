import { Game } from "./blackjackLogic.js";
import { Player } from "./blackjackLogic.js";
import { Deck } from "./blackjackLogic.js";
import { Hand } from "./blackjackLogic.js";
import { Card } from "./blackjackLogic.js";
const continueButton = document.getElementById("bjContinue-btn") as HTMLButtonElement;
const playersSelect = document.getElementById("bjSelect-players") as HTMLSelectElement;
const bjSettings = document.getElementById("bj-menu");
const blackjacktable: HTMLElement = document.getElementById("blackjackgame-table-container");
const betButtonElement = document.getElementById("bet-button") as HTMLButtonElement;
const bettingPanelElement: HTMLElement = document.getElementById("betting-panel");
const valueSpan: HTMLSpanElement = document.getElementById("bet-value");
const allinBtn = document.getElementById("allin-btn") as HTMLButtonElement;
const halfBtn = document.getElementById("1/2-btn") as HTMLButtonElement;
const thirdBtn = document.getElementById("1/3-btn") as HTMLButtonElement;
const quarterBtn = document.getElementById("1/4-btn") as HTMLButtonElement;
const rangeBetInput = document.getElementById("rangeInput") as HTMLInputElement;
const stackSpan: HTMLSpanElement = document.getElementById("playerName-namebox-stack");
const betValueLabel: HTMLSpanElement = document.getElementById("player-bet-value");
const dealerHandValue: HTMLSpanElement = document.getElementById("dealer-hand-value");
const playerHandValue: HTMLSpanElement = document.getElementById("player-hand-value");
const actionBtnHit = document.getElementById("action-btn-hit") as HTMLButtonElement;
const actionBtnStand = document.getElementById("action-btn-stand") as HTMLButtonElement;
const actionBtnDouble = document.getElementById("action-btn-dd") as HTMLButtonElement;
const actionBtnSplit = document.getElementById("action-btn-split") as HTMLButtonElement;
let betValue: number;
let betMadeAmount: number;
let playerStack: number;
let betMade: boolean;
let dealerHandValueNumber: number;

function formatAsCurrency(amount: number, vaultStyle: keyof Intl.NumberFormatOptionsStyleRegistry = "currency",  currency: string = "USD", locale: string = "en-US"): string{
    return new Intl.NumberFormat(locale, {
        style: vaultStyle,
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
}


function sendBet(){
    betMadeAmount = betValue;
    betValue = 0;
    playerStack = playerStack - betMadeAmount;
}
function losthand(){
    console.log("you lost");
    actionBtnHit.classList.add("hidden");
    actionBtnStand.classList.add("hidden");
    actionBtnDouble.classList.add("hidden");
    actionBtnSplit.classList.add("hidden");
    return;
}

function bettingLogic(stackValue: number): Promise<void>{
    playerStack = stackValue;
    betMade = false;
    return new Promise((resolve, reject) =>{
    if(betButtonElement){
        let isBetting: boolean = false;
        betButtonElement.addEventListener("click", ()=>{
            betValueLabel.classList.add("hidden");
            if(playerStack>0){
            bettingPanelElement.classList.toggle("hidden");
            betButtonElement.classList.toggle("betBtn-confirm");
            betButtonElement.innerText="CONFIRM";
            isBetting = !isBetting;
            if(isBetting){
                rangeBetInput.min = String(0.1*playerStack);
                rangeBetInput.max = String(playerStack);
                rangeBetInput.step = String(playerStack*0.01);
                allinBtn.addEventListener("click", ()=>{
                    valueSpan.innerText = formatAsCurrency(playerStack, "decimal");
                    rangeBetInput.value = String(playerStack);
                    })
                halfBtn.addEventListener("click", ()=>{
                    valueSpan.innerText = formatAsCurrency(playerStack/2, "decimal");
                    rangeBetInput.value = String(playerStack/2);
                    })
                thirdBtn.addEventListener("click", ()=>{
                    valueSpan.innerText = formatAsCurrency(playerStack/3, "decimal");
                    rangeBetInput.value = String(playerStack/3);
                    })
                quarterBtn.addEventListener("click", ()=>{
                    valueSpan.innerText = formatAsCurrency(playerStack/4, "decimal");
                    rangeBetInput.value = String(playerStack/4);
                    })
                rangeBetInput.addEventListener("input", ()=>{
                valueSpan.innerText = formatAsCurrency(Number(rangeBetInput.value), "decimal");
                })
            } else{
                betValue = Number(valueSpan.innerText.replace(/,/g,""));
                sendBet();
                console.log(betMadeAmount);
                console.log(playerStack);
                valueSpan.innerText="0.00";
                rangeBetInput.value = "0";
                betButtonElement.innerText="BET";
                stackSpan.innerText = formatAsCurrency(playerStack);
                betValueLabel.classList.toggle("hidden");
                betValueLabel.innerText=formatAsCurrency(betMadeAmount);
                allowBetPlacing();
                betMade = true;
                resolve();
            }
            }else{
                console.log("BUSTED. NO CREDITSS");
            }
        })
    }
});
}

function loadBlackjackDesign(){
    bjSettings.classList.add("hidden");
    const bodyElement: HTMLElement = document.querySelector("body");
    bodyElement.classList.add("blackjackSingle");
    bodyElement.classList.add("bjgame-mobile");
    blackjacktable.classList.remove("hidden");
}

function allowBetPlacing(){
    betButtonElement.classList.toggle("hidden");
}

function renderCard(src: string = "./assets/cards/bicycle_blue.png", type: string = "dealer"){
    if(type==="dealer"){
        const dealerCardsSlot: HTMLElement = document.getElementById("dealer-card-slots");
        let backSuitCardSrc: string = src;
        const backsuitCard: HTMLImageElement = document.createElement("img");
        backsuitCard.src = backSuitCardSrc;
        dealerCardsSlot.insertBefore(backsuitCard, dealerHandValue);
    }

    if(type==="player"){
        const playerCardsSlot: HTMLElement = document.getElementById("player-card-slots");
        let CardSrc: string = src;
        const Card: HTMLImageElement = document.createElement("img");
        Card.src = CardSrc;
        playerCardsSlot.insertBefore(Card, playerHandValue);
    }
}
async function renderAllDealerCards(dealerHandArr: Card[]){
    let firstSrc: string = "./assets/cards/" + dealerHandArr[1].rank + dealerHandArr[1].suit + ".png";
    renderCard(firstSrc);
    let previousCardCount = 2;
    dealerHandValueNumber = dealerHandArr[1].value;
    while(true){
        if(dealerHandArr.length>previousCardCount){
            for(let i = previousCardCount; i<dealerHandArr.length; i++){
                let src: string = "./assets/cards/" + dealerHandArr[i].rank + dealerHandArr[i].suit + ".png";
                renderCard(src);
            }
            previousCardCount = dealerHandArr.length;
        }
        dealerHandValue.classList.remove("hidden");
        dealerHandValue.innerText = String(dealerHandValueNumber);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

async function renderAllPlayerCards(playerHandArr: Card[]){
    let previousCardCount: number = 0;
    let playerHandValueNumber: number = 0; 
    while(true){
        if(playerHandArr.length>previousCardCount){
            for(let i = previousCardCount; i<playerHandArr.length; i++){
                let src: string = "./assets/cards/" + playerHandArr[i].rank + playerHandArr[i].suit + ".png";
                renderCard(src, "player");
                playerHandValueNumber = playerHandValueNumber + playerHandArr[i].value;
            }
            previousCardCount = playerHandArr.length;
            playerHandValue.classList.remove("hidden");
            playerHandValue.innerText = String(playerHandValueNumber);
            if(playerHandValueNumber>21){
                losthand()
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
async function checkPlayerHand(){
    while(true){
        if((Number(playerHandValue.innerText))<=21 && (Number(playerHandValue.innerText))>dealerHandValueNumber){
            console.log("you won1");
            console.log("player value: "+Number(playerHandValue.innerText));
            console.log("dealer value: " + dealerHandValueNumber);
            actionBtnHit.classList.add("hidden");
            actionBtnStand.classList.add("hidden");
            actionBtnDouble.classList.add("hidden");
            actionBtnSplit.classList.add("hidden");
            return;
        }
        if((Number(playerHandValue.innerText))<=21 && dealerHandValueNumber>21){
            console.log("you won2");
            actionBtnHit.classList.add("hidden");
            actionBtnStand.classList.add("hidden");
            actionBtnDouble.classList.add("hidden");
            actionBtnSplit.classList.add("hidden");
            return;
        }
        if((Number(playerHandValue.innerText))===dealerHandValueNumber){
            console.log("draw");
            actionBtnHit.classList.add("hidden");
            actionBtnStand.classList.add("hidden");
            actionBtnDouble.classList.add("hidden");
            actionBtnSplit.classList.add("hidden");
            return;
        }
        if(Number(playerHandValue.innerText)>21){
            losthand();
            return;
        }
        if(Number(playerHandValue.innerText)<=21 && dealerHandValueNumber<=21 && Number(playerHandValue.innerText)<dealerHandValueNumber){
            losthand();
            return;
        }
    await new Promise((resolve) => setTimeout(resolve, 100));
}
}

function buttonShowingLogic(){
    if(Number(playerHandValue.innerText)===21){
        console.log("BLACKJACK. YOU WON.");
        actionBtnDouble.classList.toggle("hidden");
    } else{
        actionBtnHit.classList.toggle("hidden");
        actionBtnStand.classList.toggle("hidden");
    }
    if(betMadeAmount*2<=playerStack){
        actionBtnDouble.classList.toggle("hidden");
    }
}

function hitButton(hand, player, deck){
    if(actionBtnHit){
    actionBtnHit.addEventListener("click", ()=>{
        hand.hit(player, deck);
        const playerHand = hand.playersHands.get(player);
        console.log(playerHand);
        const lastCard = playerHand[playerHand.length - 1];
        if(lastCard.rank === "A" && (Number(playerHandValue.innerText)>10)){
            lastCard.value = 1;
        }
    })
    }
}
function doubleButton(hand, player, deck){
    if(actionBtnDouble){
        actionBtnDouble.addEventListener("click", ()=>{
            hand.hit(player, deck);
            console.log(hand.playersHands.get(player));
            playerStack = playerStack - betMadeAmount;
            betMadeAmount = betMadeAmount*2;
            betValueLabel.innerText = formatAsCurrency(betMadeAmount);
            stackSpan.innerText = formatAsCurrency(playerStack); 
        })
        }
}

function standButton(hand, deck){
    if(actionBtnStand){
        actionBtnStand.addEventListener("click", ()=>{
            actionBtnHit.classList.add("hidden");
            actionBtnStand.classList.add("hidden");
            actionBtnDouble.classList.add("hidden");
            actionBtnSplit.classList.add("hidden");
            dealDealerHand(hand.dealerHand, hand, deck);
        })
    }
}

function dealDealerHand(dealerHandArr: Card[], hand, deck){
    const dealerCardsSlot: HTMLElement = document.getElementById("dealer-card-slots");
    dealerCardsSlot.removeChild(dealerCardsSlot.firstElementChild);
    let firstDealerCardSrc: string = "./assets/cards/" + dealerHandArr[0].rank + dealerHandArr[0].suit + ".png";
    let backSuitCardSrc: string = "./assets/cards/" + dealerHandArr[0].rank + dealerHandArr[0].suit + ".png";;
    const backsuitCard: HTMLImageElement = document.createElement("img");
    backsuitCard.src = backSuitCardSrc;
    dealerCardsSlot.prepend(backsuitCard);
    console.log("Ee");
    dealerHandValueNumber = dealerHandValueNumber + dealerHandArr[0].value;

    while(dealerHandValueNumber<17){
        hand.dealerHit(deck);
        console.log(hand.dealerHand);
        dealerHandValueNumber = 0;
        for(let i = 0; i<dealerHandArr.length;i++){
            dealerHandValueNumber = dealerHandValueNumber + dealerHandArr[i].value;
        }
    }
    checkPlayerHand();
}


async function startGame(startingStackAmount: number){
    loadBlackjackDesign();
    allowBetPlacing();
    await bettingLogic(startingStackAmount);

    const game = new Game();
    const deck = new Deck();
    const player = game.initializePlayers(1, startingStackAmount);
    const hand = new Hand();

    if(betMade){
        deck.shuffle();
        hand.start(player, deck);
        renderCard();
        renderAllDealerCards(hand.dealerHand);
        renderAllPlayerCards(hand.playersHands.get(player[0]));
        hitButton(hand, player[0], deck);
        doubleButton(hand, player[0], deck);
        standButton(hand, deck);
        buttonShowingLogic();
    }
}



export function blackjackSingleLogic(){
if(continueButton){
    continueButton.addEventListener("click", ()=>{
        const startingStackElement = document.getElementById("bjSelect-stackValue") as HTMLSelectElement;
        const startingStackAmount: number = Number(startingStackElement.value);
        if(playersSelect.value==="1"){
            const stackSpan: HTMLSpanElement = document.getElementById("playerName-namebox-stack");
            stackSpan.innerText = formatAsCurrency(startingStackAmount);
            startGame(startingStackAmount);
        }
    })
}
}