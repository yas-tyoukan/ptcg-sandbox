import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { initializeDeck } from './initializeDeck';
import type { FirstTurnData } from './types/FirstTurnData';

const includes = <T>(array: T[], value: T): boolean => array.includes(value);
const exclude = <T>(array: T[], value: T): void => {
  const index = array.indexOf(value);
  if (index >= 0) array.splice(index, 1);
};
const countIncludes = <T>(array: T[], value: T): number =>
  array.filter((v) => v === value).length;
const createDeck = ({ sides, hand, draw }: FirstTurnData): string[] => {
  const deckCardNames = initializeDeck().map((card) => card.name);
  for (const c of sides) {
    exclude(deckCardNames, c);
  }
  for (const c of hand) {
    exclude(deckCardNames, c);
  }
  exclude(deckCardNames, draw);
  return deckCardNames;
};
const todoLogOnceFlag: { [key: string]: boolean } = {};
function calculatePoisonDamage(
  { sides, hand, draw }: FirstTurnData,
  deck: string[],
  line: number,
): number | null {
  /*
   * 前提：
   * - ブーストエナジー古代 3枚
   * - アラブルタケ 2枚
   * - モモワロウ 2枚
   * - その他主要カードは1枚ずつ
   */
  // ブーストエナジー古代が全てサイド落ちしている場合は絶対に毒にできない
  if (!includes([...hand, draw, ...deck], 'ブーストエナジー古代')) return 0;

  // ヒスイのヘビーボールとアラブルタケがサイド落ちしている場合は絶対に毒にできない
  if (
    !includes([...hand, draw, ...deck], 'ヒスイのヘビーボール') &&
    !includes([...hand, draw, ...deck], 'アラブルタケ')
  )
    return 0;

  let battleField: string;
  const benchFields: string[] = [];
  // 逃げるを使ったか
  let retreated = false;
  // 支配の鎖を使ったか
  const usedPoisonChain = false;

  // バトル場に出すポケモンを決定する
  if (includes(hand, 'ケーシィ')) {
    battleField = 'ケーシィ';
    exclude(hand, 'ケーシィ');
  } else if (
    includes(hand, 'ヤレユータンV') &&
    !includes(hand, 'ブーストエナジー古代') &&
    !includes(hand, '森の封印石')
  ) {
    battleField = 'ヤレユータンV';
    exclude(hand, 'ヤレユータンV');
  } else if (includes(hand, 'モモワロウ')) {
    battleField = 'モモワロウ';
    exclude(hand, 'モモワロウ');
  } else if (includes(hand, 'かがやくヒスイオオニューラ')) {
    battleField = 'かがやくヒスイオオニューラ';
    exclude(hand, 'かがやくヒスイオオニューラ');
  } else if (includes(hand, 'ミミッキュ')) {
    battleField = 'ミミッキュ';
    exclude(hand, 'ミミッキュ');
  } else if (includes(hand, 'モモワロウex')) {
    battleField = 'モモワロウex';
    exclude(hand, 'モモワロウex');
  } else if (includes(hand, 'ラティアスex')) {
    battleField = 'ラティアスex';
    exclude(hand, 'ラティアスex');
  } else if (includes(hand, 'ヤレユータンV')) {
    battleField = 'ヤレユータンV';
    exclude(hand, 'ヤレユータンV');
  } else if (includes(hand, 'アラブルタケ')) {
    battleField = 'アラブルタケ';
    exclude(hand, 'アラブルタケ');
  } else if (includes(hand, 'ガチグマアカツキex')) {
    battleField = 'ガチグマアカツキex';
    exclude(hand, 'ガチグマアカツキex');
  } else {
    throw new Error('no exist basic pokemon');
  }

  // 1枚引く
  hand.push(draw);

  // たねポケモンは全部ベンチに出す（本来は5匹しか出せないが、ここでは考慮しない）
  const basicPokemon = [
    'ケーシィ',
    'ヤレユータンV',
    'モモワロウ',
    'かがやくヒスイオオニューラ',
    'ミミッキュ',
    'モモワロウex',
    'ラティアスex',
    'アラブルタケ',
    'ガチグマアカツキex',
  ];
  for (const pokemon of basicPokemon) {
    if (!includes(hand, pokemon)) continue;
    benchFields.push(pokemon);
    exclude(hand, pokemon);
  }

  // ヒスイのヘビーボールを使って出せるポケモンは全部ベンチに出す
  while (includes(hand, 'ヒスイのヘビーボール')) {
    exclude(hand, 'ヒスイのヘビーボール');
    // TODO ヤレユータンV、アラブルタケ、モモワロウ、かがやくヒスイオオニューラ、モモワロウex、ラティアスexのいずれかを出す
    // 出す優先度は状況によって変わる
    // バトル場を逃がせるならヤレユータンVを出してバトル場に出したいが、そのためにはラティアスexやモモワロウexが必要かもしれないし、
    // 封印石がサイド落ちしていてプレシャスキャリーがなくアラブルタケを出せないならアラブルタケを出す必要がある
  }

  // ボールを使って出せるポケモンは全部ベンチに出す
  while (includes(hand, 'ネストボール') || includes(hand, 'ハイパーボール')) {
    const ball = includes(hand, 'ネストボール')
      ? 'ネストボール'
      : 'ハイパーボール';
    exclude(hand, ball);
    // TODO ヤレユータンV、アラブルタケ、モモワロウ、かがやくヒスイオオニューラ、モモワロウex、ラティアスexのいずれかを出す
    // 出す優先度は状況によって変わる
    // バトル場を逃がせるならヤレユータンVを出してバトル場に出したいが、そのためにはラティアスexやモモワロウexが必要かもしれないし、
    // 封印石がサイド落ちしていてプレシャスキャリーがなくアラブルタケを出せないならアラブルタケを出す必要がある
  }
  // TODO

  // プレシャスキャリーを使って出せるポケモンは全部ベンチに出す
  // TODO

  if (!includes([...hand, draw], 'ブーストエナジー古代')) {
    // ブーストエナジー古代がない場合
    (() => {
      // ヤレユータンVをバトル場に出す
      if (battleField === 'ヤレユータンV') return;
      if (!includes(benchFields, 'ヤレユータンV')) return 0;

      if (battleField === 'ケーシィ') {
        // バトル場がケーシィならヤレユータンVを出す
        exclude(benchFields, 'ヤレユータンV');
        battleField = 'ヤレユータンV';
      } else if (
        !retreated &&
        (battleField === 'ラティアスex' ||
          includes(benchFields, 'ラティアスex'))
      ) {
        // ラティアスexがいるなら逃げてヤレユータンVを出す
        retreated = true;
        exclude(benchFields, 'ヤレユータンV');
        battleField = 'ヤレユータンV';
      }
      // バトル場が逃げるコスト1のポケモンで、緊急ボードまたはエネルギーがあるなら逃げてヤレユータンVを出す
      // TODO

      // バトル場が逃げるコスト2のポケモンで、緊急ボードとエネルギーがあるなら逃げてヤレユータンVを出す
      // TODO

      // ベンチにモモワロウexと逃げるコスト1の悪ポケモンがいて、逃げられるなら、支配の鎖を使って出した悪ポケモンを逃がしてヤレユータンVを出す
      // TODO
    })();
    if (battleField !== 'ヤレユータンV') {
      // ヤレユータンVをバトル場に出せない場合
      // 森の封印石がないとブーストエナジー古代を持ってくる手段がないので毒にできない
      if (!includes([...hand, draw], '森の封印石')) return 0;
      // 森の封印石があってもアラブルタケがいないと毒にできない
      if (!includes(benchFields, 'アラブルタケ')) return 0;
      // 森の封印石があれば使ってブーストエナジー古代を持ってくる
      // TODO
    }
    // ヤレユータンVで森の封印石とブーストエナジー古代を持ってくる
    // TODO
  } else {
    // ブーストエナジー古代がある場合
    // 森の封印石を使って何か欲しいものがあるならヤレユータンVを出す
    // TODO
  }

  return null;
}

async function processCSV(inputFile: string, outputFile: string) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  const outputStream = fs.createWriteStream(outputFile);

  let nullCount = 0;
  let lineCount = 0;
  for await (const line of rl) {
    lineCount += 1;
    if (lineCount === 1) {
      outputStream.write(`${line}\n`);
      continue;
    }

    const fields = line.split(',');
    const data: FirstTurnData = {
      sides: fields.slice(0, 6),
      hand: fields.slice(6, 13),
      draw: fields[13],
      poisonDamage: fields[14] ? Number.parseInt(fields[14], 10) : null,
    };

    const deck = createDeck(data);

    if (data.poisonDamage === null) {
      data.poisonDamage = calculatePoisonDamage(data, deck, lineCount);
    }
    const newLine =
      data.poisonDamage !== null
        ? `${fields.slice(0, 14).join(',')},${data.poisonDamage}`
        : line;
    outputStream.write(`${newLine}\n`);
    if (data.poisonDamage === null) {
      nullCount += 1;
      if (nullCount <= 1) console.log(format(data, lineCount));
    }
  }

  outputStream.end();
  console.log('処理が完了しました。');
  console.log(`未計算行数: ${nullCount}`);
}

const format = (data: FirstTurnData, lineCount: number) => {
  return `--${lineCount}行目--\n【サイド】:\n ${data.sides.join('\n')} \n【手札】:\n ${data.hand.join('\n')} \n【ドロー】: ${data.draw} \n【毒ダメージ】: ${data.poisonDamage}`;
};

const inputFile = './result/input.csv';
const outputFile = './result/output.csv';

processCSV(inputFile, outputFile).catch(console.error);
