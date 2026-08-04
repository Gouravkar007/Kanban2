export interface Card {
  id: string;
  title: string;
  details: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columns: Record<string, Column>;
  columnOrder: string[];
  cards: Record<string, Card>;
}
