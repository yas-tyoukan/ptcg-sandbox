export type Card = {
  name: string;
  pokemon: boolean;
  basic: boolean;
  item: boolean;
  tool: boolean;
  stadium: boolean;
  energy: boolean;
  retreatCost?: number;
  description?: string;
};
