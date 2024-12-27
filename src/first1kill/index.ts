import { Board } from './Board';
import { initializeDeck } from './initializeDeck';
import { getFirstMatchCardByName } from './utils/getFirstMatchCardByName';

function fetchRequiredCards(board: Board): void {
  // 1. 森の封印石がヤレユータンVについている場合、好きなカードを持ってくる
  if (
    board.battleField?.name === 'ヤレユータンV' &&
    board.hasTool('森の封印石')
  ) {
    board.searchDeckForCard([
      'モモワロウ',
      'かがやくヒスイオオニューラ',
      'アラブルタケ',
      'ブーストエナジー古代',
      '危険な密林',
    ]);
  }

  // 2. ヤレユータンVがバトル場にいる場合、道具カード（ブーストエナジー古代）を持ってくる
  if (board.battleField?.name === 'ヤレユータンV') {
    board.searchDeckForCard(['ブーストエナジー古代']);
  }

  // 3. プレシャスキャリーでたねポケモンを持ってくる
  if (board.hasItem('プレシャスキャリー')) {
    board.useItem('プレシャスキャリー', [
      'モモワロウ',
      'かがやくヒスイオオニューラ',
      'アラブルタケ',
    ]);
  }
}

function setupBoard(board: Board): void {
  // 1. 必要なポケモンをベンチに出す
  board.placeOnBench('アラブルタケ');
  board.placeOnBench('かがやくヒスイオオニューラ');
  board.placeOnBench('モモワロウ');

  // 2. アラブルタケにブーストエナジー古代をつける
  board.attachToolToPokemon('アラブルタケ', 'ブーストエナジー古代');

  // 3. スタジアム「危険な密林」を場に出す
  board.placeStadium('危険な密林');
}
function switchBattlePokemon(board: Board): void {
  board.switchBattleField('モモワロウ');
}

function calculatePoisonDamage(board: Board): number {
  let poisonDamage = 10; // 基本毒ダメージ

  // モモワロウがバトル場にいる場合 +50
  if (board.battleField?.name === 'モモワロウ') {
    poisonDamage += 50;
  }

  // かがやくヒスイオオニューラがベンチまたはバトル場にいる場合 +20
  if (board.isPokemonOnBenchOrBattleField('かがやくヒスイオオニューラ')) {
    poisonDamage += 20;
  }

  // スタジアム「危険な密林」が場にある場合 +20
  if (board.isStadiumInPlay('危険な密林')) {
    poisonDamage += 20;
  }

  return poisonDamage;
}

const main = (board: Board) => {
  while (board.hand.find((card) => card.basic && card.pokemon) !== undefined) {
    // たねポケモンが手札にくるまで切り直し
    board.setup();
  }
  const basicPokemons = board.hand.filter((card) => card.basic && card.pokemon);
  // バトル場にたねポケモンを出す
  // TODO: ここのロジックは精査が必要
  const battleCard = (() => {
    if (basicPokemons.length === 1) return basicPokemons[0];
    if (
      board.hand.some((card) => card.name === 'プレシャスキャリー') &&
      board.hand.some((card) => card.name === 'ブーストエナジー古代')
    ) {
      // プレシャスキャリーとブーストエナジー古代が手札にある場合
      return (
        getFirstMatchCardByName(board.hand, [
          'モモワロウ',
          'ケーシィ',
          'かがやくヒスイオオニューラ',
          'モモワロウex',
          'アラブルタケ',
          'ヤレユータンV',
          'ラティアスex',
          'ガチグマアカツキex',
        ]) ?? basicPokemons[0]
      );
    }
    return (
      getFirstMatchCardByName(board.hand, [
        'ケーシィ',
        'ヤレユータンV',
        'モモワロウ',
        'かがやくヒスイオオニューラ',
        'モモワロウex',
        'アラブルタケ',
        'ヤレユータンV',
        'ラティアスex',
        'ガチグマアカツキex',
      ]) ?? basicPokemons[0]
    );
  })();
  board.prayPokemonOnBattleField(battleCard);

  // サイドを出す
  board.putSide();

  // 1枚ドローする
  board.draw(1);

  // 必要なカードを山札から引く
  fetchRequiredCards(board);

  // ポケモンと道具・スタジアムを配置する
  setupBoard(board);

  // バトル場のポケモンを入れ替える
  switchBattlePokemon(board);

  // 毒ダメージ計算
  const poisonDamage = calculatePoisonDamage(board);
  console.log(`毒による最大ダメージ: ${poisonDamage}`);
};

main(new Board(initializeDeck()));

function simulateFirstTurnHand(): {
  hand: Card[];
  battlePokemon: Card;
  side: Card[];
} {
  // デッキを作成（たねポケモンが10枚、その他のカードが50枚のデッキ）
  const deck = initializeDeck();

  while (true) {
    // デッキをシャッフル
    shuffle(deck);

    // 山札から7枚引いて手札とする
    const hand = deck.slice(0, 7);

    // 手札にたねポケモンが1枚もない場合、やり直し
    if (!hand.some((card) => card.basic && card.pokemon)) {
      continue;
    }

    // 手札から1枚のたねポケモンを選んでバトル場に出す
    const battlePokemon = hand.find((card) => card.basic && card.pokemon)!;

    // サイドとして山札の上から6枚を引いてサイドにセット
    const side = deck.slice(7, 13);

    return {
      hand,
      battlePokemon,
      side,
    };
  }
}

// シミュレーション実行と結果の出力
const result = simulateFirstTurnHand();
console.log('手札:', result.hand);
console.log('バトル場:', result.battlePokemon);
console.log('サイド:', result.side);
