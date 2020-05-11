//  Callenge 5: BlackJack

let blackJackGame = {
  you: { scoreSpan: "#your-bj-score", div: ".your-box", score: 0 },

  dealer: { scoreSpan: "#dealer-bj-score", div: ".dealer-box", score: 0 },

  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  cardsValue: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },
};

const YOU = blackJackGame.you;
const DEALER = blackJackGame.dealer;

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame.cards[randomIndex];
}

function UpdateScore(card, activePlayer) {
  // if adding 11 keeps player under 21: ADD 11, otherwise: ADD 1
  if (card === "A") {
    if (activePlayer.score + blackJackGame.cardsValue[card][1] <= 21) {
      // +blackJackGame.cardsValue[card][1]
      activePlayer.score += 11;
    } else {
      // +blackJackGame.cardsValue[card][0]
      activePlayer.score += 1;
    }
  } else {
    activePlayer.score += blackJackGame.cardsValue[card];
  }
}

function showScore(activePlayer) {
  if (activePlayer.score <= 21) {
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  } else {
    document.querySelector(activePlayer.scoreSpan).textContent = "BUST!";
    document.querySelector(activePlayer.scoreSpan).style.color = "red";
  }
}

const hitSound = new Audio("static/audio/swish.m4a");

// you don't have to write an onClick in the HTML part
let hitButton = document.getElementById("bj-hit");
hitButton.addEventListener("click", blackJackHIT);

let dealButton = document.getElementById("bj-deal");
dealButton.addEventListener("click", blackJackDEAL);

function blackJackHIT() {
  let card = randomCard();
  showCards(card, YOU);
  UpdateScore(card, YOU);
  showScore(YOU);
}

function showCards(card, activePlayer) {
  if (activePlayer.score <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer.div).appendChild(cardImage);
    hitSound.play();
  }
}

function blackJackDEAL() {
  let yourCards = document.querySelector(YOU.div).querySelectorAll("img");

  let dealerCards = document.querySelector(DEALER.div).querySelectorAll("img");

  yourCards.forEach((image) => image.remove());
  dealerCards.forEach((image) => image.remove());

  YOU.score = 0;
  DEALER.score = 0;
  document.querySelector("#your-bj-score").textContent = 0;
  document.querySelector("#dealer-bj-score").textContent = 0;

  document.querySelector("#your-bj-score").style.color = "#ffffff";
  document.querySelector("#dealer-bj-score").style.color = "#ffffff";
}
