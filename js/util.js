export default class Util {
    // 指定した時間だけ待つ
    static sleep = (wait = 1000) => {
        return new Promise(resolve => setTimeout(resolve, wait));
    };

    // イベントハンドラを追加する
    static addEventListener = (selector, event, handler) => {
        document.querySelectorAll(selector).forEach((e) => e.addEventListener(event, handler));
    };

    // プレイヤーの手札を合計する
    static getTotal = (hands) => {
        let total = 0;

        hands.forEach((hand) => {
            if (hand.value === "J" || hand.value === "Q" || hand.value === "K") {
                total += 10;
            } else if (hand.value === "A") {
                total += 1;
            } else {
                total += hand.value;
            }
        });
        // Aを11と数えても合計が21を超えなければ11と数える
        hands.forEach((hand) => {
            if (hand.value === "A") {
                if (total + 10 <= 21) {
                    total += 10;
                }
            }
        })
        return total;
    };
}