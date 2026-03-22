import { Chess, Move } from 'chess.js';

// Piece weights for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified position tables (bonus for better positioning)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const getPieceValue = (piece: any, squareIndex: number, isWhite: boolean): number => {
  if (!piece) return 0;
  let value = PIECE_VALUES[piece.type] || 0;
  
  // Apply position tables (simplified: only pawns and knights for now)
  // Mirror index for black
  const idx = isWhite ? squareIndex : 63 - squareIndex;
  
  if (piece.type === 'p') value += PAWN_TABLE[idx];
  if (piece.type === 'n') value += KNIGHT_TABLE[idx];
  
  return isWhite ? value : -value;
};

const evaluateBoard = (game: Chess): number => {
  let totalEvaluation = 0;
  const board = game.board();

  // Single loop board evaluation
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        // square index 0-63
        const squareIndex = i * 8 + j;
        totalEvaluation += getPieceValue(piece, squareIndex, piece.color === 'w');
      }
    }
  }
  return totalEvaluation;
};

// Minimax with Alpha-Beta Pruning
const minimax = (
  game: Chess, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalValue = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalValue);
      alpha = Math.max(alpha, evalValue);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalValue = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalValue);
      beta = Math.min(beta, evalValue);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMove = (game: Chess): string | null => {
  const moves = game.moves();
  if (moves.length === 0) return null;

  // Clone game to avoid mutating the UI state directly during calculation
  // (Though chess.js .move() mutates, so we usually clone or undo)
  // But here we receive the main game instance, so we must be careful.
  // Better to instantiate a new Chess object with the current FEN.
  const gameCopy = new Chess(game.fen());
  
  let bestMove = null;
  let bestValue = Infinity; // Black wants to minimize score (White is positive, Black is negative)
  
  // If it were White Computer, we would start with -Infinity. 
  // Assuming Computer is always Black in this app.
  const isEngineWhite = game.turn() === 'w';
  if (isEngineWhite) bestValue = -Infinity;

  // Shuffle moves to add a tiny bit of randomness for equal positions
  moves.sort(() => Math.random() - 0.5);

  const depth = 3; // Search depth (Ply)

  for (const move of moves) {
    gameCopy.move(move);
    const boardValue = minimax(
      gameCopy, 
      depth - 1, 
      -Infinity, 
      Infinity, 
      !isEngineWhite
    );
    gameCopy.undo();

    if (isEngineWhite) {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove || moves[0]; // Fallback
};