// this variable handles all game infos (states)

let blackJackGame = {
  you: { scoreSpan: "#your-bj-score", div: ".your-box", score: 0 },

  dealer: { scoreSpan: "#dealer-bj-score", div: ".dealer-box", score: 0 },

  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  // mapping each card with her precise value
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

  wins: 0,
  losses: 0,
  draws: 0,

  isStand: false, // did user clicked the STAND button?
  turnsOver: false,
};

//                  P L A Y E R S

const YOU = blackJackGame.you;
const DEALER = blackJackGame.dealer;

//                  B U T T O N S

// these f()s are written without any onClick properties in the HTML file
// we use .addEventListener( "click", f() ) to register click events
let hitButton = document.getElementById("bj-hit");
hitButton.addEventListener("click", blackJackHIT);

let standButton = document.getElementById("bj-stand");
standButton.addEventListener("click", dealerLogic);

let dealButton = document.getElementById("bj-deal");
dealButton.addEventListener("click", blackJackDEAL);

//                   A U D I O S

const hitSound = new Audio("static/audio/swish.m4a");
const winSound = new Audio("static/audio/cash.mp3");
const lossSound = new Audio("static/audio/aww.mp3");

//                F U N C T I O N S

//  this f() generates card choosing randomly from an array
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame.cards[randomIndex];
}

//  this f() handles the graphics for a selected card to be displayed
function showCards(card, activePlayer) {
  if (activePlayer.score <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer.div).appendChild(cardImage);
    hitSound.play();
  }
}

//  this f() updates the internal score of both players
function UpdateScore(card, activePlayer) {
  // if adding 11 keeps player under 21: ADD 11, otherwise: ADD 1
  if (card === "A") {
    if (activePlayer.score + blackJackGame.cardsValue[card][1] <= 21) {
      activePlayer.score += 11; // +blackJackGame.cardsValue[card][1]
    } else {
      activePlayer.score += 1; // +blackJackGame.cardsValue[card][0]
    }
  } else {
    activePlayer.score += blackJackGame.cardsValue[card];
  }
}

//  based on the internal score, this f() handles
//  the graphic partfor the score in order to be diplayed
function showScore(activePlayer) {
  if (activePlayer.score <= 21) {
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  } else {
    document.querySelector(activePlayer.scoreSpan).textContent = "BUST!";
    document.querySelector(activePlayer.scoreSpan).style.color = "red";
  }
}

//                  G A M E   L O G I C

// onClick HIT button
function blackJackHIT() {
  if (blackJackGame.isStand === false) {
    let card = randomCard();
    showCards(card, YOU);
    UpdateScore(card, YOU);
    showScore(YOU);
  }
}

// onClick DEAL button
function blackJackDEAL() {
  if (blackJackGame.turnsOver === true) {
    blackJackGame.isStand = false;

    let yourCards = document.querySelector(YOU.div).querySelectorAll("img");

    let dealerCards = document
      .querySelector(DEALER.div)
      .querySelectorAll("img");

    yourCards.forEach((image) => image.remove());
    dealerCards.forEach((image) => image.remove());

    // handling the score of each player
    YOU.score = 0;
    DEALER.score = 0;
    document.querySelector("#your-bj-score").textContent = 0;
    document.querySelector("#dealer-bj-score").textContent = 0;
    document.querySelector("#your-bj-score").style.color = "#ffffff";
    document.querySelector("#dealer-bj-score").style.color = "#ffffff";

    // header resets once match has finished
    document.querySelector("#bj-results").textContent = "Let's play!";
    document.querySelector("#bj-results").style.color = "black";
    blackJackGame.turnsOver = true;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// onClick STAND button
// this f() regulates the dealer behaviour
async function dealerLogic() {
  blackJackGame.isStand = true;

  while (DEALER.score < 16 && blackJackGame.isStand) {
    let card = randomCard();
    showCards(card, DEALER);
    UpdateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackJackGame.turnsOver = true;
  let winner = computeWinner();
  showResult(winner);
}

// this f() computes winner and returns who just won AND
// handles wins, draws and losses in the table
function computeWinner() {
  let winner;
  // prettier-ignore
  if (YOU.score <= 21) {
    // condition : higher score than dealer OR  dealer busts
    if (YOU.score > DEALER.score || DEALER.score > 21) {
      winner = YOU;
      blackJackGame.wins++;

    } else if (YOU.score < DEALER.score || YOU.score > 21) {
      winner = DEALER;
      blackJackGame.losses++;

    } else if (YOU.score === DEALER.score) {
      blackJackGame.draws++;
    }

    // condition : when user busts but dealer doesn't
  } else if (YOU.score > 21 && DEALER.score <= 21) {
    winner = DEALER;
    blackJackGame.losses++;

    // condition : when both user and dealer bust
  } else if (YOU.score > 21 && DEALER.score > 21) {
    blackJackGame.draws++;
  }

  return winner;
}

// this f() handles the graphics of the final results
function showResult(winner) {
  let message, messageColor;

  if (blackJackGame.turnsOver === true) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackJackGame.wins;
      message = "you won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackJackGame.losses;
      message = "you lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackJackGame.draws;
      message = "you drew!";
      messageColor = "black";
    }

    document.querySelector("#bj-results").textContent = message;
    document.querySelector("#bj-results").style.color = messageColor;
  }
}
