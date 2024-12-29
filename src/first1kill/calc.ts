import * as fs from 'node:fs';
import * as readline from 'node:readline';
import type { FirstTurnData } from './types/FirstTurnData';

const includes = <T>(array: T[], value: T): boolean => array.includes(value);
const countIncludes = <T>(array: T[], value: T): number =>
  array.filter((v) => v === value).length;

const todoLogOnceFlag: { [key: string]: boolean } = {};
function calculatePoisonDamage(
  { sides, hand, draw }: FirstTurnData,
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
  if (countIncludes(sides, 'ブーストエナジー古代') >= 3) return 0;

  // ヒスイのヘビーボールとアラブルタケ2枚がサイド落ちしている場合は絶対に毒にできない
  if (
    includes(sides, 'ヒスイのヘビーボール') &&
    countIncludes(sides, 'アラブルタケ') >= 2
  )
    return 0;

  // ヤレユータンVスタートできて、特性から全部揃うケース
  if (
    includes(hand, 'ヤレユータンV') &&
    (!includes(sides, '森の封印石') ||
      includes([...hand, draw], 'プレシャスキャリー')) &&
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
      (includes([...hand, draw], 'プレシャスキャリー') &&
        !includes(sides, '森の封印石') &&
        !includes(sides, 'ヒスイのヘビーボール'))
    ) {
      // かがやくヒスイオオニューラが出せるかどうか
      // サイド落ちしている場合でも、ヒスイのヘビーボールがあるなら持ってこられる
      // プレシャスキャリーが手札にあるなら封印石でヒスイのヘビーボールを持ってこられる
      damage += 20;
    }
    if (
      includes(hand, '危険な密林') ||
      (includes([...hand, draw], 'プレシャスキャリー') &&
        !includes(sides, '森の封印石') &&
        countIncludes(sides, '危険な密林') < 2)
    ) {
      // 危険な密林を出せるかどうか
      // プレシャスキャリーが手札にあるなら封印石で持ってこられる
      damage += 20;
    }
    return damage;
  }

  // ケーシィスタートできて、ボールまたは最初のドローからヤレユータンVを出せるケース
  if (
    includes(hand, 'ケーシィ') &&
    (!includes(sides, 'ヤレユータンV') ||
      includes([...hand, draw], 'ヒスイのヘビーボール')) &&
    (draw === 'ヤレユータンV' ||
      includes(hand, 'ネストボール') ||
      includes(hand, 'ハイパーボール')) &&
    (!includes(sides, '森の封印石') ||
      includes([...hand, draw], 'プレシャスキャリー')) &&
    !includes(sides, 'プレシャスキャリー') &&
    countIncludes(sides, 'アラブルタケ') < 2 &&
    countIncludes(sides, 'ブーストエナジー古代') < 3 &&
    countIncludes(sides, 'モモワロウ') < 2 &&
    !(includes(sides, 'モモワロウex') && includes(sides, 'ラティアスex'))
  ) {
    let damage = 60;
    if (
      !includes(sides, 'かがやくヒスイオオニューラ') ||
      (!includes(sides, 'ヤレユータンV') &&
        includes([...hand, draw], 'ヒスイのヘビーボール')) ||
      (includes([...hand, draw], 'プレシャスキャリー') &&
        !includes(sides, '森の封印石') &&
        !includes(sides, 'ヒスイのヘビーボール') &&
        !includes(sides, 'ヤレユータンV'))
    ) {
      // かがやくヒスイオオニューラが出せるかどうか
      // サイド落ちしている場合でも、ヒスイのヘビーボールがあるなら持ってこられる
      // プレシャスキャリーが手札にあるなら封印石でヒスイのヘビーボールを持ってこられる
      // (ただしいずれもヤレユータンVを出すのにヒスイのヘビーボールを使う場合は除く)
      damage += 20;
    }
    if (
      includes(hand, '危険な密林') ||
      (includes([...hand, draw], 'プレシャスキャリー') &&
        !includes(sides, '森の封印石') &&
        countIncludes(sides, '危険な密林') < 2)
    ) {
      // 危険な密林を出せるかどうか
      // プレシャスキャリーが手札にあるなら封印石で持っ来られる
      damage += 20;
    }
    return damage;
  }

  // ヤレユータンVを出せないかつ、ブーストエナジー古代が手札にない場合は毒にできない
  if (
    !includes([...hand, draw], 'ヤレユータンV') &&
    (includes(sides, 'ヤレユータンV')
      ? !includes([...hand, draw], 'ヒスイのヘビーボール')
      : !includes(hand, 'ネストボール') && !includes(hand, 'ハイパーボール')) &&
    !includes(hand, 'ブーストエナジー古代')
  ) {
    return 0;
  }

  // ケーシィスタートできてボールがなく、ヤレユータンVがいない場合で、手札にアラブルタケとブーストエナジー古代がある場合
  if (
    includes(hand, 'ケーシィ') &&
    !includes(hand, 'ネストボール') &&
    !includes(hand, 'ハイパーボール') &&
    !includes(hand, 'ヒスイのヘビーボール') &&
    !includes(hand, 'ヤレユータンV') &&
    includes(hand, 'アラブルタケ') &&
    includes(hand, 'ブーストエナジー古代')
  ) {
    let damage = 10;
    if (includes(hand, 'モモワロウ')) {
      damage += 50;
    }
    if (includes(hand, 'かがやくヒスイオオニューラ')) {
      damage += 20;
    }
    if (includes(hand, '危険な密林')) {
      damage += 20;
    }
    return damage;
  }

  // ケーシィスタートできて、プレシャスキャリーがサイド落ちしていて、ブーストエナジー古代が手札になく、アラブルタケ、ヤレユータンVしか出せないケース
  if (
    includes(hand, 'ケーシィ') &&
    includes(sides, 'プレシャスキャリー') &&
    includes([...hand, draw], 'ブーストエナジー古代')
  ) {
    let ballCount =
      countIncludes([...hand, draw], 'ネストボール') +
      countIncludes(hand, 'ハイパーボール');
    // ヤレユータンVを出す
    let yareyutan = false;
    if (
      includes([...hand, draw], 'ヤレユータンV') ||
      (includes(hand, 'ヒスイのヘビーボール') &&
        includes(sides, 'ヤレユータンV'))
    ) {
      yareyutan = true;
    } else if (ballCount >= 1 && !includes(sides, 'ヤレユータンV')) {
      ballCount--;
      yareyutan = true;
    }
    if (!yareyutan) return null;

    // アラブルタケを出す
    let araburutake = false;
    if (
      includes([...hand, draw], 'アラブルタケ') ||
      (includes(hand, 'ヒスイのヘビーボール') &&
        includes(sides, 'アラブルタケ') &&
        !includes(sides, 'ヤレユータン'))
    ) {
      araburutake = true;
    } else if (ballCount >= 1 && !includes(sides, 'アラブルタケ')) {
      ballCount--;
      araburutake = true;
    }
    if (!araburutake) return null;

    if (ballCount === 0) {
      let damage = 0;
      if (includes([...hand, draw], 'モモワロウ')) {
        // TODO: モモワロウをバトル場に出せるかどうか
        const todo = '// TODO: モモワロウをバトル場に出せるかどうか';
        if (!todoLogOnceFlag[todo]) {
          todoLogOnceFlag[todo] = true;
          console.log(todo);
          console.log(format({ sides, hand, draw, poisonDamage: null }, line));
        }
        return null;
      }
      if (includes([...hand, draw], 'かがやくヒスイオオニューラ')) {
        damage += 20;
      }
      if (includes([...hand, draw], '危険な密林')) {
        damage += 20;
      }
      return damage;
    }

    // まだボールが残っている場合
    // TODO
    return null;
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

    if (data.poisonDamage === null) {
      data.poisonDamage = calculatePoisonDamage(data, lineCount);
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
