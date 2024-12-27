import type { Card } from '../types/Card';

export class Board {
  private originalDeck: Card[];
  deck: Card[];
  hand: Card[];
  battleField: Card | null;
  benchField: Card[];
  side: Card[];

  constructor(deck: Card[]) {
    this.originalDeck = deck;
    this.deck = [...deck];
    this.hand = [];
    this.battleField = null;
    this.benchField = [];
    this.side = [];
  }

  setup(): void {
    this.deck = [...this.originalDeck];
    this.hand = [];
    this.battleField = null;
    this.benchField = [];
    this.side = [];
    this.shuffleDeck();
    this.draw(7);
  }

  private shuffle = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  public shuffleDeck(): void {
    this.deck = this.shuffle(this.deck);
  }

  public draw(num: number): void {
    this.hand = this.deck.splice(0, num);
    // TODO: ドローできたかどうかを返す
  }

  public resetHand(): void {
    this.deck = this.deck.concat(this.hand);
    this.hand = [];
  }

  public prayPokemonOnBattleField(card: Card): void {
    this.battleField = card;
    this.hand = this.hand.filter((c) => c !== card);
  }

  public putSide(): void {
    this.side = this.deck.splice(0, 6);
  }

  public getGameState(): {
    hand: Card[];
    battleField: Card | null;
    side: Card[];
  } {
    return {
      hand: this.hand,
      battleField: this.battleField,
      side: this.side,
    };
  }
}
