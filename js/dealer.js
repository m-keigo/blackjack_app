import Player from "./player.js";
import Util from "./util.js";

export default class Dealer extends Player {
    constructor(selector) {
        super(selector);
    }

    // カードを引くか判定
    #pickAi(hands) {
        // 手札の合計計算
        let total = Util.getTotal(hands);

        let isPick = false;
        if (total <= 16) {
            isPick = true;
        } else {
            isPick = false;
        }
        return isPick;
    }

    addCard(cards, hands) {
        while (this.#pickAi(hands)) {
            this.hands.push(this.drawCard(cards));
        }
    }

    // 手札を表示（script.jsで使用/定義元）
    displayDealerCard(hands, player, showDealerHands) {
        // ディーラーの1枚目は常に表示
        document.querySelector(player.selector).appendChild(hands[0].getHTML());
        let firstHand = hands[0].value;
        // 1枚目のスコア表示
        if (firstHand === "J" || firstHand === "Q" || firstHand === "K") {
            firstHand = 10;
        }
        if (firstHand === "A") {
            firstHand = 11;
        }
        document.querySelector("#dealer-result").innerText = firstHand;

        if (showDealerHands) {
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
            document.querySelector("#dealer-result").innerText = Util.getTotal(hands);
        }
    }
}