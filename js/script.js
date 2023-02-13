import Player from "./player.js";
import Dealer from "./dealer.js";
import Deck from "./deck.js";
import Util from "./util.js";

// Gemeクラス
export default class Game {
    #you;
    #dealer;
    #cards; // デッキ
    #isRunning; // ゲーム実行状態（true or false）
    #showDealerHands; // ディーラーのカードの表示/非表示切り替え（true or false）
    #wins;
    #loses;
    #draws;

    constructor() {
        this.#you = null;
        this.#dealer = null;
        this.#cards = [];
        this.#isRunning = false;
        this.#showDealerHands = false;
        this.#wins = 0;
        this.#loses = 0;
        this.#draws = 0;
        // ボタンのイベントハンドラ登録
        this.#setupEvents();
    }

    run() {
        this.#initialize();
    }

    /**
     * ボタンのイベントハンドラ登録
    **/
    #setupEvents() {
        // Hitボタンクリックイベント
        Util.addEventListener("#hit-button", "click", this.#onClickHit.bind(this));

        // Standボタンクリックイベント
        Util.addEventListener("#stand-button", "click", this.#onClickStand.bind(this));

        // Dealボタンクリックイベント
        Util.addEventListener("#deal-button", "click", this.#onClickDeal.bind(this));

        // Restartボタンクリックイベント
        Util.addEventListener("#restart-button", "click", this.#onClickRestart.bind(this));
    }

    #onClickHit() {
        if (this.#isRunning === true) {
            // 自分がカードを引く
            this.#dealCard(this.#you, 1, this.#cards);

            // ディーラーがカードを引く
            this.#dealCard(this.#dealer, 1, this.#cards);

            // 画面更新
            this.#showCard(this.#you.hands, this.#you);

            // 自分の合計が21を超えた場合、勝敗判定に移る
            if (Util.getTotal(this.#you.hands) > 21) {
                this.#onClickStand();
            }
        }
    }

    #onClickStand() {
        if (this.#isRunning === true) {
            // 画面更新
            this.#showDealerHands = true;
            this.#showCard(this.#you.hands, this.#you);
            this.#showCard(this.#dealer.hands, this.#dealer, this.#showDealerHands);

            // 勝敗判定
            let result = this.#judge();
            // 1秒待ち
            // Util.sleep(); // ←1秒待ててない（原因不明）
            setTimeout(this.#showResult.bind(this), 1000, result);

            // ゲーム実行状態更新
            this.#isRunning = false;
            this.#updateBtnView();
        }
    }

    #onClickDeal() {
        if (this.#isRunning === false) {
            let playerHands = document.querySelectorAll(".card");
            playerHands.forEach(playerHand => playerHand.remove());

            document.querySelector("#your-result").innerText = 0;
            document.querySelector("#dealer-result").innerText = 0;

            this.#you.hands = [];
            this.#dealer.hands = [];
            // デッキを生成 & シャッフル
            this.#cards = new Deck();
            this.#cards.shuffle();

            // デッキを2枚ずつプレイヤーに配布
            this.#dealCard(this.#you, 2, this.#cards);
            this.#dealCard(this.#dealer, 2, this.#cards);
            Util.getTotal(this.#you.hands);

            // ゲーム実行状態を更新
            this.#isRunning = true;
            this.#updateBtnView();

            // 画面更新
            this.#showCard(this.#dealer.hands, this.#dealer);
            this.#showCard(this.#you.hands, this.#you);
        }
    }

    #onClickRestart() {
        this.#isRunning = false;
        location.reload();
    }

    /**
     * ゲーム初期化
    **/
    #initialize() {
        // プレイヤーを生成
        this.#you = new Player(".card-slot.you");
        this.#dealer = new Dealer(".card-slot.dealer");

        // デッキを生成 & シャッフル
        this.#cards = new Deck();
        this.#cards.shuffle();

        // デッキを2枚ずつプレイヤーに配布
        this.#dealCard(this.#you, 2, this.#cards);
        this.#dealCard(this.#dealer, 2, this.#cards);
        Util.getTotal(this.#you.hands);

        // ゲーム実行状態を更新
        this.#isRunning = true;

        // 画面更新
        this.#showCard(this.#dealer.hands, this.#dealer);
        this.#showCard(this.#you.hands, this.#you);
    }

    // デッキからカードをn枚プレイヤーに配布
    #dealCard(player, n, cards) {
        for (let i = 0; i < n; i++) {
            player.addCard(cards, player.hands);
        }
    }

    // 手札を表示（player.jsより使用/呼び出し元）
    #showCard(hands, player, showDealerHands) {
        if (player.selector === ".card-slot.dealer") {
            return player.displayDealerCard(hands, player, showDealerHands);
        } else {
            return player.displayCard(hands, player);
        }
    }

    // ボタンの活性/非活性
    #updateBtnView() {
        if (this.#isRunning === true) {
            document.querySelector("#hit-button").removeAttribute("disabled");
            document.querySelector("#stand-button").removeAttribute("disabled");
            document.querySelector("#deal-button").setAttribute("disabled", false);
            document.querySelector("#restart-button").setAttribute("disabled",false);
        } else if (this.#isRunning === false) {
            document.querySelector("#hit-button").setAttribute("disabled", false);
            document.querySelector("#stand-button").setAttribute("disabled", false);
            document.querySelector("#deal-button").removeAttribute("disabled");
            document.querySelector("#restart-button").removeAttribute("disabled");
        }
    }

    // 勝敗判定
    #judge() {
        let result;
        // プレイヤーの手札合計
        let yourTotal = Util.getTotal(this.#you.hands);
        let dealerTotal = Util.getTotal(this.#dealer.hands);

        if (yourTotal > 21) {
            result = "loose";
        } else if (yourTotal <= 21 && dealerTotal > 21) {
            result = "win";
        } else {
            // 両者21未満のとき
            if (yourTotal > dealerTotal) {
                result = "win";
            } else if (yourTotal < dealerTotal) {
                result = "loose";
            } else {
                result = "draw";
            }
        }
        return result;
    }

    #showResult(result) {
        let winsCount = this.#wins;
        let losesCount = this.#loses;
        let drawsCount = this.#draws;
        if(result === "win") {
            document.querySelector("#wins").textContent = winsCount += 1;
        } else if (result === "loose") {
            document.querySelector("#loses").textContent = losesCount += 1;
        } else {
            document.querySelector("#draws").textContent = drawsCount += 1;
        }
        alert(result);
        // スコアカウント更新
        this.#wins = winsCount;
        this.#loses = losesCount;
        this.#draws = drawsCount;
    }
}