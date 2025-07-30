const suit = ['♠', '♥', '♦', '♣'];
const number = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let playerHand = [];
let cpuHand = [];
let deck = [];
let score = 0;
$("#change").hide();
$("#score-text").hide();
$("#judge").hide();
$("#reset").hide();


// トランプの作成
function CreateDeck() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 13; j++) {
            deck.push({ suit: suit[i], num: number[j] });
        }
    }
    // console.log(deck);
    return deck;
}

// 山札をシャッフル
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// オブジェクトの文字列への変換
function formatHand(hand) {
    return hand.map(card => {
        if (typeof card === 'string') {
            return card;
        } else {
            return `${card.suit}${card.num}`;
        }
    }).join(' ');
}

// ゲームスタート
function startgame() {
    let deck = CreateDeck();
    deck = shuffle(deck);

    // カード配布
    playerHand = deck.splice(0, 5);
    console.log(playerHand)

    // 表示・非表示
    $("#player-cards").text(formatHand(playerHand));
    $("#start").hide();
    $("#controls button").show();
    $("#score").show();
    console.log(deck);

}


// 捨てる手札の選択
let trash = [0, 0, 0, 0, 0];
function excard(num) {
    const button = $(`#controls button:nth-child(${num})`);
    if (num === 6) {
        for (let i = 0; i < 5; i++) {
            trash.splice(i, 1, 0);
        }
        console.log(trash);
        button.removeClass("selected");
    }
    else {
        trash.splice(num - 1, 1, 1);
        console.log(trash);
        button.addClass("selected");
    }
}

// 手札交換
function exchange() {
    for (let i = 0; i < 5; i++) {
        if (trash[i] === 1) {
            playerHand[i] = deck.shift();
        }
    }
    $("#player-cards").text(formatHand(playerHand));
    $("#controls button").hide();
    $("#change").show();
    $("#judge").show();
    console.log(playerHand);
    console.log(deck);
}

function judgeHand(hand) {
    const numOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const numCount = {};
    const suitCount = {};
    let nums = [];

    // 数字とスートのカウント
    hand.forEach(card => {
        numCount[card.num] = (numCount[card.num] || 0) + 1;
        suitCount[card.suit] = (suitCount[card.suit] || 0) + 1;
        nums.push(card.num);
    });

    const counts = Object.values(numCount).sort((a, b) => b - a); // 役判定用
    const isFlush = Object.values(suitCount).some(count => count === 5);

    // 数字を並べ替え、ストレート判定
    const sortedNums = nums.map(n => numOrder.indexOf(n)).sort((a, b) => a - b);
    const isStraight = sortedNums.every((n, i, arr) => i === 0 || n === arr[i - 1] + 1) ||
        (JSON.stringify(sortedNums) === JSON.stringify([0, 1, 2, 3, 12])); // A-2-3-4-5

    const has = val => counts.includes(val);
    if (isFlush && isStraight && sortedNums.includes(12) && sortedNums.includes(8)) {
        score += 100;
        return "ロイヤルストレートフラッシュ";
    } else if (isFlush && isStraight) {
        score += 75;
        return "ストレートフラッシュ";
    } else if (has(4)) {
        score += 50;
        return "フォーカード";
    } else if (has(3) && has(2)) {
        score += 25;
        return "フルハウス";
    } else if (isFlush) {
        score += 20;
        return "フラッシュ";
    } else if (isStraight) {
        score += 15;
        return "ストレート";
    } else if (has(3)) {
        score += 10;
        return "スリーカード";
    } else if (counts.filter(c => c === 2).length === 2) {
        score += 5;
        return "ツーペア";
    } else if (has(2)) {
        score += 2;
        return "ワンペア";
    } else {
        score += 0;
        return "ハイカード";
    }

}

function rslt(){
    result = judgeHand(playerHand);
    // console.log("あなたの役は:", result);
    // console.log(score);
    $("#player-result").text(result);
    $("#score").text(score);
    $("#score-text").show();
    $("#reset").show();
    $("#judge").hide();
}




