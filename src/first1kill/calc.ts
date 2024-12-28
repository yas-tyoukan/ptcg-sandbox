import * as fs from 'node:fs';
import * as readline from 'node:readline';
import type { FirstTurnData } from './types/FirstTurnData';

const includes = <T>(array: T[], value: T): boolean => array.includes(value);
const countIncludes = <T>(array: T[], value: T): number =>
  array.filter((v) => v === value).length;

function calculatePoisonDamage({
  sides,
  hand,
  draw,
}: FirstTurnData): number | null {
  /*
   * 前提：
   * - ブーストエナジー古代 3枚
   * - アラブルタケ 2枚
   * - モモワロウ 2枚
   * - その他主要カードは1枚ずつ
   */

  // ヤレユータンVスタートできて、特性から全部揃うケース
  if (
    includes(hand, 'ヤレユータンV') &&
    !includes(sides, '森の封印石') &&
    !includes(sides, 'プレシャスキャリー') &&
    countIncludes(sides, 'アラブルタケ') < 2 &&
    countIncludes(sides, 'ブーストエナジー古代') < 3 &&
    countIncludes(sides, 'モモワロウ') < 2 &&
    !(includes(sides, 'モモワロウex') && includes(sides, 'ラティアスex'))
  ) {
    let damage = 60;
    if (
      !includes(sides, 'かがやくヒスイオオニューラ') ||
      includes([...hand, draw], 'ヒスイのヘビーボール') ||
      includes([...hand, draw], 'プレシャスキャリー')
    ) {
      // かがやくヒスイオオニューラが出せるかどうか
      // サイド落ちしている場合でも、ヒスイのヘビーボールがあるなら持ってこれる
      // プレシャスキャリーが手札にあるなら封印石でヒスイのヘビーボールを持ってこれる
      damage += 20;
    }
    if (
      includes(hand, '危険な密林') ||
      (includes([...hand, draw], 'プレシャスキャリー') &&
        countIncludes(sides, '危険な密林') < 2)
    ) {
      // 危険な密林を出せるかどうか
      // プレシャスキャリーが手札にあるなら封印石で持ってこれる
      damage += 20;
    }
    return damage;
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

  let isFirstLine = true;
  let nullCount = 0;
  for await (const line of rl) {
    if (isFirstLine) {
      outputStream.write(`${line}\n`);
      isFirstLine = false;
      continue;
    }

    const fields = line.split(',');
    const data: FirstTurnData = {
      sides: fields.slice(0, 6),
      hand: fields.slice(6, 13),
      draw: fields[13],
      poisonDamage: fields[14] ? Number.parseInt(fields[14], 10) : null,
    };

    if (data.poisonDamage === null) {
      data.poisonDamage = calculatePoisonDamage(data);
    }
    const newLine =
      data.poisonDamage !== null
        ? `${fields.slice(0, 14).join(',')},${data.poisonDamage}`
        : line;
    outputStream.write(`${newLine}\n`);
    if (data.poisonDamage === null) {
      nullCount += 1;
      if (nullCount <= 1) console.log(format(data));
    }
  }

  outputStream.end();
  console.log('処理が完了しました。');
  console.log(`未計算行数: ${nullCount}`);
}

const format = (data: FirstTurnData) => {
  return `【サイド】:\n ${data.sides.join('\n')} \n【手札】:\n ${data.hand.join('\n')} \n【ドロー】: ${data.draw} \n【毒ダメージ】: ${data.poisonDamage}`;
};

const inputFile = './result/input.csv';
const outputFile = './result/output.csv';

processCSV(inputFile, outputFile).catch(console.error);
