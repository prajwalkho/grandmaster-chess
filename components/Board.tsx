import React from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPieceIcon } from './Icons';
import { PieceColor } from '../types';

interface BoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
  validMoves: string[];
  disabled: boolean;
  orientation: PieceColor;
  lastMove: { from: string; to: string } | null;
}

export const Board: React.FC<BoardProps> = ({ 
  game, 
  onMove, 
  disabled, 
  lastMove
}) => {
  const [selectedSquare, setSelectedSquare] = React.useState<string | null>(null);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const possibleMoves = React.useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare as Square, verbose: true }).map((m: any) => m.to);
  }, [selectedSquare, game]);

  const handleSquareClick = (square: string) => {
    if (disabled) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      return;
    }

    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare as Square, verbose: true });
      const move = moves.find((m: any) => m.to === square);
      
      if (move) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        return;
      }
    }

    const piece = game.get(square as Square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const getSquareColor = (fileIndex: number, rankIndex: number) => {
    const isLight = (fileIndex + rankIndex) % 2 === 0;
    // Standard Tournament Colors
    return isLight ? 'bg-[#EBECD0]' : 'bg-[#779556]';
  };

  return (
    <div className="w-full h-full select-none bg-[#302E2B]">
      <div className="grid grid-cols-8 w-full h-full">
        {ranks.map((rank, rIndex) => (
          files.map((file, fIndex) => {
            const square = `${file}${rank}`;
            const piece = game.get(square as Square);
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isCaptureMove = isPossibleMove && piece;
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const inCheck = piece?.type === 'k' && piece?.color === game.turn() && game.inCheck();
            const squareColorClass = getSquareColor(fIndex, rIndex);
            const isLightSquare = (fIndex + rIndex) % 2 === 0;
            const coordinateColor = isLightSquare ? "text-[#779556]" : "text-[#EBECD0]";

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  ${squareColorClass}
                  relative flex items-center justify-center
                  cursor-pointer
                `}
              >
                {/* Coordinates */}
                {fIndex === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold ${coordinateColor}`}>
                    {rank}
                  </span>
                )}
                {rIndex === 7 && (
                  <span className={`absolute bottom-0 sm:bottom-0.5 right-1 text-[10px] sm:text-xs font-bold ${coordinateColor}`}>
                    {file}
                  </span>
                )}

                {/* Move Highlights */}
                {(isLastMoveFrom || isLastMoveTo) && (
                   <div className="absolute inset-0 bg-yellow-200 opacity-50 mix-blend-multiply" />
                )}
                
                {isSelected && (
                  <div className="absolute inset-0 bg-[rgba(255,255,50,0.5)]" />
                )}

                {inCheck && (
                   <div className="absolute inset-0 radial-gradient bg-red-600/60 blur-[2px]" style={{clipPath: 'circle(50% at 50% 50%)'}} />
                )}

                {/* Piece Layer */}
                <div className="w-[100%] h-[100%] z-10 p-[2%] transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95">
                  {piece && (
                    <ChessPieceIcon type={piece.type} color={piece.color} />
                  )}
                </div>

                {/* Possible Move Indicators */}
                {isPossibleMove && !isCaptureMove && (
                  <div className="absolute z-20 w-3 h-3 sm:w-4 sm:h-4 bg-black/20 rounded-full" />
                )}
                
                {isCaptureMove && (
                  <div className="absolute z-20 w-full h-full border-[5px] border-black/10 rounded-full scale-90" />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};