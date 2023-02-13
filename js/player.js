import Util from "./util.js";

export default class Player {
    hands; // プレイヤーの手札

    get hands() {
        return this.hands;
    }

    constructor(selector) {
        this.hands = [];
        this.selector = selector; // you or dealer
    }

    // デッキからカードを1枚ドロー
    drawCard(cards) {
        return cards.pickCard(); // deck.jsより使用（呼び出し元）
    }

    // 1枚ドローしてカードを手札に追加
    addCard(cards) {
        this.hands.push(this.drawCard(cards));
    }

    // 手札を表示（script.jsで使用/定義元）
    displayCard(hands, player) {
        // if文手札の合計が21以下
        // 既存のdiv要素を削除（子要素を全削除）
        const oldCardDiv = document.querySelector(player.selector);
        while(oldCardDiv.firstChild) {
            oldCardDiv.removeChild(oldCardDiv.firstChild);
        }
        // 新しい手札を表示
        hands.forEach(hand => {
            document.querySelector(player.selector).appendChild(hand.getHTML());
        });

        // スコア表示
        document.querySelector("#your-result").innerText = Util.getTotal(hands);
    }
}