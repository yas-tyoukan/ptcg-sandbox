import * as fs from 'node:fs';
import { Board } from './Board';
import { initializeDeck } from './initializeDeck';
import { getFirstMatchCardByName } from './utils/getFirstMatchCardByName';

// function fetchRequiredCards(board: Board): void {
//   // 1. 森の封印石がヤレユータンVについている場合、好きなカードを持ってくる
//   if (
//     board.battleField?.name === 'ヤレユータンV' &&
//     board.hasTool('森の封印石')
//   ) {
//     board.searchDeckForCard([
//       'モモワロウ',
//       'かがやくヒスイオオニューラ',
//       'アラブルタケ',
//       'ブーストエナジー古代',
//       '危険な密林',
//     ]);
//   }
//
//   // 2. ヤレユータンVがバトル場にいる場合、道具カード（ブーストエナジー古代）を持ってくる
//   if (board.battleField?.name === 'ヤレユータンV') {
//     board.searchDeckForCard(['ブーストエナジー古代']);
//   }
//
//   // 3. プレシャスキャリーでたねポケモンを持ってくる
//   if (board.hasItem('プレシャスキャリー')) {
//     board.useItem('プレシャスキャリー', [
//       'モモワロウ',
//       'かがやくヒスイオオニューラ',
//       'アラブルタケ',
//     ]);
//   }
// }
//
// function setupBoard(board: Board): void {
//   // 1. 必要なポケモンをベンチに出す
//   board.placeOnBench('アラブルタケ');
//   board.placeOnBench('かがやくヒスイオオニューラ');
//   board.placeOnBench('モモワロウ');
//
//   // 2. アラブルタケにブーストエナジー古代をつける
//   board.attachToolToPokemon('アラブルタケ', 'ブーストエナジー古代');
//
//   // 3. スタジアム「危険な密林」を場に出す
//   board.placeStadium('危険な密林');
// }
//
// function switchBattlePokemon(board: Board): void {
//   board.switchBattleField('モモワロウ');
// }
//
// function calculatePoisonDamage(board: Board): number {
//   let poisonDamage = 10; // 基本毒ダメージ
//
//   // モモワロウがバトル場にいる場合 +50
//   if (board.battleField?.name === 'モモワロウ') {
//     poisonDamage += 50;
//   }
//
//   // かがやくヒスイオオニューラがベンチまたはバトル場にいる場合 +20
//   if (board.isPokemonOnBenchOrBattleField('かがやくヒスイオオニューラ')) {
//     poisonDamage += 20;
//   }
//
//   // スタジアム「危険な密林」が場にある場合 +20
//   if (board.isStadiumInPlay('危険な密林')) {
//     poisonDamage += 20;
//   }
//
//   return poisonDamage;
// }

const simulate = (board: Board) => {
  board.reset();
  while (!board.hand.find((card) => card.basic && card.pokemon)) {
    // たねポケモンが手札にくるまで切り直し
    board.setup();
    board.putSide();
  }
};

// const basicPokemons = board.hand.filter((card) => card.basic && card.pokemon);
// // バトル場にたねポケモンを出す
// // TODO: ここのロジックは精査が必要
// const battleCard = (() => {
//   if (basicPokemons.length === 1) return basicPokemons[0];
//   if (
//     board.hand.some((card) => card.name === 'プレシャスキャリー') &&
//     board.hand.some((card) => card.name === 'ブーストエナジー古代')
//   ) {
//     // プレシャスキャリーとブーストエナジー古代が手札にある場合
//     return (
//       getFirstMatchCardByName(board.hand, [
//         'モモワロウ',
//         'ケーシィ',
//         'かがやくヒスイオオニューラ',
//         'モモワロウex',
//         'アラブルタケ',
//         'ヤレユータンV',
//         'ラティアスex',
//         'ガチグマアカツキex',
//       ]) ?? basicPokemons[0]
//     );
//   }
//   return (
//     getFirstMatchCardByName(board.hand, [
//       'ケーシィ',
//       'ヤレユータンV',
//       'モモワロウ',
//       'かがやくヒスイオオニューラ',
//       'モモワロウex',
//       'アラブルタケ',
//       'ヤレユータンV',
//       'ラティアスex',
//       'ガチグマアカツキex',
//     ]) ?? basicPokemons[0]
//   );
// })();
// board.prayPokemonOnBattleField(battleCard);
// if (board.battleField === null) return;
//
// // サイドを出す
// board.putSide();
//
// // 1枚ドローする
// board.draw(1);
//
// // TODO: 実際の動きをシミュレートするよりも、パターンを洗い出して確立を求めた方が良いかも
// // サイド落ちで毒にできないケース
// if (
//   (board.side.filter((card) => card.name === 'アラブルタケ').length >= 2 &&
//     board.hand.find((card) => card.name === 'ヒスイのヘビーボール') ===
//       undefined) ||
//   board.side.filter((card) => card.name === 'ブーストエナジー古代').length >=
//     2
// ) {
//   // アラブルタケがサイド落ちでヒスイのヘビーボールが手札にない ( // TODO 封印石でヒスイのヘビーボール持って来れるが一旦無視 )
//   return 0;
// }
//
// // アラブルタケを出せるか
// if (board.hand.find((card) => card.name === 'アラブルタケ')
//   || board.hand.find((card) => card.name === 'ネストボール'
//     || board.hand.find((card) => card.name === 'ハイパーボール'
//       || board.hand.find((card) => card.name === 'ハイパーボール')
// ) {
//
// }
//
// // 手札だけで100出せるケース
// if (
//   // バトル場がモモワロウ、またはモモワロウが手札にいて、バトル場を逃がせる
//   (board.battleField.name === 'モモワロウ' ||
//     (board.hand.find((card) => card.name === 'モモワロウ') &&
//       (board.battleField.retreatCost !== undefined &&
//       board.battleField.retreatCost <= 1 &&
//       (board.hand.find((card) => card.name === '緊急ボード') ||
//         board.hand.find((card) => card.name === '超エネルギー')) ||
//
//       ))) &&
//   board.hand.find((card) => card.name === 'アラブルタケ') &&
//   board.hand.find((card) => card.name === 'ブーストエナジー古代')
// ) {
//   let damage = 60;
//   if (board.hand.find((card) => card.name === 'かがやくヒスイオオニューラ')) {
//     damage += 20;
//   }
//   if (board.hand.find((card) => card.name === '危険な密林')) {
//     damage += 20;
//   }
//   return damage;
// }
//
// if (
//   // バトル場を逃がせる
//   (board.battleField.name === 'ケーシィ' ||
//     (board.battleField.retreatCost !== undefined &&
//       board.battleField.retreatCost <= 1 &&
//       (board.hand.find((card) => card.name === '緊急ボード') ||
//         board.hand.find((card) => card.name === '超エネルギー')))) &&
//   board.hand.find((card) => card.name === 'モモワロウ') &&
//   board.hand.find((card) => card.name === 'かがやくヒスイオオニューラ') &&
//   board.hand.find((card) => card.name === 'アラブルタケ') &&
//   board.hand.find((card) => card.name === 'ブーストエナジー古代') &&
//   board.hand.find((card) => card.name === '危険な密林')
// ) {
//   return 100;
// }
//
// // ヤレユータンVスタートのケース
// if (board.battleField.name === 'ヤレユータンV') {
//   // ケーシィの場合、ヤレユータンVをバトル場に出す
//   const yareyutan = board.hand.find((card) => card.name === 'ヤレユータンV');
//   if (yareyutan !== undefined) {
//     board.playBench(yareyutan);
//     board.switchPokemon(yareyutan);
//   }
// }
//
// /**
//  * 基本条件（毒を与えられない）:
//  * ブーストエナジー古代が全てサイドにある場合: 0ダメージ
//  * アラブルタケが全てサイドにある場合: 0ダメージ
//  * 最小条件（毒のみ）:
//  * アラブルタケとブーストエナジー古代が使用可能: 10ダメージ
//  * モモワロウ条件:
//  * アラブルタケ + ブーストエナジー古代 + モモワロウ（バトル場）: 60ダメージ
//  * ヒスイオオニューラ条件:
//  * アラブルタケ + ブーストエナジー古代 + かがやくヒスイオオニューラ（ベンチ/バトル場）: 30ダメージ
//  * スタジアム条件:
//  * アラブルタケ + ブーストエナジー古代 + 危険な密林: 30ダメージ
//  * 複合条件:
//  * アラブルタケ + ブーストエナジー古代 + モモワロウ + かがやくヒスイオオニューラ: 80ダメージ
//  * アラブルタケ + ブーストエナジー古代 + モモワロウ + 危険な密林: 80ダメージ
//  * アラブルタケ + ブーストエナジー古代 + かがやくヒスイオオニューラ + 危険な密林: 50ダメージ
//  * 最大条件:
//  * アラブルタケ + ブーストエナジー古代 + モモワロウ + かがやくヒスイオオニューラ + 危険な密林: 100ダメージ
//  * ヤレユータンV条件:
//  * ヤレユータンVがバトル場 + 森の封印石 + プレシャスキャリー + 必要なカードが山札/手札にある: 80ダメージ（危険な密林なし）または100ダメージ（危険な密林あり）
//  * ラティアスex/モモワロウex条件:
//  * ラティアスexまたはモモワロウexを使用して必要なカードを集められる場合: 上記の条件に準じる
//  * プレシャスキャリー条件:
//  * プレシャスキャリーを使用して必要なポケモンを集められる場合: 上記の条件に準じる
//  */
//
// if (
//   board.side.filter((card) => card.name === 'ヤレユータンV').length >= 1 &&
//   board.hand.find((card) => card.name === 'ブーストエナジー古代') ===
//     undefined
// ) {
//   // ヤレユータンVがサイド、かつ、手札にブーストエナジー古代がない場合は終了
//   return 0;
// }
//
// // 手札にプレシャスキャリーとブーストエナジー古代を持ってくる
// (() => {
//   if (
//     board.hand.find((card) => card.name === 'プレシャスキャリー') &&
//     board.hand.find((card) => card.name === 'ブーストエナジー古代')
//   )
//     return;
//   // 手札にない場合は、ヤレユータンVをバトル場に出して持ってくる
//
//   // ヤレユータンVをバトル場に出す
//   (() => {
//     if (board.battleField.name === 'ヤレユータンV') return;
//     if (board.battleField.name === 'ケーシィ') {
//       // バトル場のケーシィ
//       const kc = board.battleField;
//       // 手札のヤレユータンV
//       const yareyutan = board.hand.find(
//         (card) => card.name === 'ヤレユータンV',
//       );
//       if (yareyutan !== undefined) {
//         // ヤレユータンVが手札にある場合、ベンチに出してバトル場と入れ替える
//         board.playBench(yareyutan);
//         board.switchPokemon(yareyutan);
//         board.benchField = board.benchField.filter((card) => card !== kc);
//         board.deck.push(kc);
//         board.shuffleDeck();
//       }
//       // バトル場がケーシィなら特性で入れ替える
//       if (
//         board.hand.find((card) => card.name === 'ネストボール') ||
//         board.hand.find((card) => card.name === 'ハイパーボール')
//       ) {
//         // ネストボールかハイパーボールが手札にある場合、ヤレユータンVをバトル場に出す
//       }
//     }
//   })();
// })();
//
// // ヤレユータンVを使って必要なパーツを揃えるケース
//
// // バトル場がヤレユータンVの場合、好きなカードを持ってくる
//
// // 必要なカードを山札から引く
// fetchRequiredCards(board);
//
// // ポケモンと道具・スタジアムを配置する
// setupBoard(board);
//
// // バトル場のポケモンを入れ替える
// switchBattlePokemon(board);
//
// // 毒ダメージ計算
// const poisonDamage = calculatePoisonDamage(board);
// console.log(`毒による最大ダメージ: ${poisonDamage}`);
// };

const main = (board: Board) => {
  const fileName = './result/output.csv';
  const fileExists = fs.existsSync(fileName);
  if (!fileExists) {
    fs.writeFileSync(
      fileName,
      'サイド1,サイド2,サイド3,サイド4,サイド5,サイド6,手札1,手札2,手札3,手札4,手札5,手札6,手札7,ドロー,毒ダメージ\n',
    );
  }
  const writeStream = fs.createWriteStream(fileName, { flags: 'a' });
  let count = 0;
  while (count < 10000) {
    simulate(board);
    const result = `${board.side.map((card) => card.name).join(',')},${board.hand
      .map((card) => card.name)
      .join(',')},${board.deck[0].name}\n`;
    writeStream.write(result);
    count += 1;
  }
  writeStream.end();
};

main(new Board(initializeDeck()));

// シミュレーション実行と結果の出力
