//  Callenge 5: BlackJack

// you don't have to write an onClick in the HTML part

let blackJackGame = {
  you: { scoreSpan: "#your-bj-score", div: ".your-box", score: 0 },
  dealer: { scoreSpan: "#dealer-bj-score", div: ".dealer-box", score: 0 },
};

const YOU = blackJackGame.you;
const DEALER = blackJackGame.dealer;

// env variables
const hitSound = new Audio("static/audio/swish.m4a");

let hitButton = document.getElementById("bj-hit");
hitButton.addEventListener("click", blackJackHit);

function blackJackHit() {
  let cardImage = document.createElement("img");
  cardImage.src = "static/images/Q.png";
  document.querySelector(YOU.div).appendChild(cardImage);
  hitSound.play();
  console.log("cia0o");
}
