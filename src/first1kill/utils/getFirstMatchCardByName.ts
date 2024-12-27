import type { Card } from '../types/Card';

export const getFirstMatchCardByName = (
  cards: Card[],
  names: string[],
): Card | undefined => {
  for (const name of names) {
    const matchedCard = cards.find((card) => card.name === name);
    if (matchedCard) {
      return matchedCard;
    }
  }
  return undefined;
};
