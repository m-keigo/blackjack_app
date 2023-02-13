const SUITS = ["♠", "♣", "♥", "♦"];
const VALUES = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

export default class Deck {
  constructor(cards = createDeck()) {
    this.cards = cards;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const temp = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = temp;
    }
  }

  // デッキからカードを1枚ドロー(player.jsで使用/定義元)
  pickCard() {
    return this.cards.shift();
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♠" || this.suit === "♣" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement('li');
    cardDiv.innerText = this.suit;
    cardDiv.classList.add("card", this.color)
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}

function createDeck() {
  let unshuffledDeck = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      let card = new Card(suit, value);
      unshuffledDeck.push(card);
    })
  })
  return unshuffledDeck;
}