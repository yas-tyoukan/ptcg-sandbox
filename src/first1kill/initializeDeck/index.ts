import type { Card } from '../types/Card';

const createCard = (name: string, options: Partial<Card> = {}): Card => ({
  name,
  basic: options.basic ?? false,
  pokemon: options.pokemon ?? false,
  item: options.item ?? false,
  tool: options.tool ?? false,
  stadium: options.stadium ?? false,
  energy: options.energy ?? false,
  retreatCost: options.retreatCost ?? 0,
  description: options.description ?? '',
});

const createCards = (num: number, name: string, options: Partial<Card> = {}) =>
  Array(num)
    .fill(null)
    .map(() => createCard(name, options));

export const initializeDeck = () => {
  const deck = createCards(4, 'ケーシィ', {
    basic: true,
    pokemon: true,
    retreatCost: 1,
  })
    .concat(createCards(4, 'ユンゲラー', { pokemon: true }))
    .concat(createCards(1, 'フーディンex', { pokemon: true }))
    .concat(createCards(2, 'ミミッキュ', { energy: true, retreatCost: 1 }))
    .concat(
      createCards(2, 'アラブルタケ', {
        pokemon: true,
        basic: true,
        retreatCost: 3,
      }),
    )
    .concat(
      createCards(2, 'モモワロウ', {
        pokemon: true,
        basic: true,
        retreatCost: 1,
      }),
    )
    .concat(
      createCards(1, 'かがやくヒスイオオニューラ', {
        pokemon: true,
        basic: true,
        retreatCost: 1,
      }),
    )
    .concat(
      createCards(1, 'ヤレユータンV', {
        pokemon: true,
        basic: true,
        retreatCost: 2,
      }),
    )
    .concat(
      createCards(1, 'ラティアスex', {
        pokemon: true,
        basic: true,
        retreatCost: 2,
      }),
    )
    .concat(
      createCards(1, 'モモワロウex', {
        pokemon: true,
        basic: true,
        retreatCost: 1,
      }),
    )
    .concat(
      createCards(1, 'ガチグマアカツキex', {
        pokemon: true,
        basic: true,
        retreatCost: 3,
      }),
    )
    .concat(createCards(4, 'ネストボール', { item: true }))
    .concat(createCards(2, 'ハイパーボール', { item: true }))
    .concat(createCards(1, 'ヒスイのヘビーボール', { item: true }))
    .concat(createCards(2, 'エネルギー転送', { item: true }))
    .concat(createCards(1, '夜のタンカ', { item: true }))
    .concat(createCards(1, 'プレシャスキャリー', { item: true }))
    .concat(createCards(1, '危険な密林', { stadium: true }))
    .concat(createCards(3, 'ブーストエナジー古代', { tool: true }))
    .concat(createCards(1, '森の封印石', { tool: true }));

  return deck.concat(createCards(60 - deck.length, 'その他', {}));
};
