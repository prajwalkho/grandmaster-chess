export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CHECKMATE = 'CHECKMATE',
  DRAW = 'DRAW',
  STALEMATE = 'STALEMATE',
}

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface SquareInfo {
  square: string;
  type: PieceType;
  color: PieceColor;
}

export interface MoveResult {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameState {
  fen: string;
  turn: PieceColor;
  history: string[];
  status: GameStatus;
  winner?: PieceColor;
  isCheck: boolean;
  lastMove: { from: string; to: string } | null;
}