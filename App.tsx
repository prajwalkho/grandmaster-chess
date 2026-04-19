import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { getBestMove } from './services/chessEngine';
import { GameStatus, PieceColor } from './types';

const App: React.FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [status, setStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
  const [winner, setWinner] = useState<PieceColor | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([]);
  const [computerThinking, setComputerThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        setGame(gameCopy);
        setHistory(gameCopy.history());
        setLastMove({ from: result.from, to: result.to });
        
        if (gameCopy.isGameOver()) {
          if (gameCopy.isCheckmate()) {
            setStatus(GameStatus.CHECKMATE);
            setWinner(gameCopy.turn() === 'w' ? 'b' : 'w');
          } else if (gameCopy.isDraw() || gameCopy.isStalemate()) {
            setStatus(GameStatus.DRAW);
          } else {
             setStatus(GameStatus.DRAW);
          }
        }
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  const onUserMove = (from: string, to: string) => {
    if (computerThinking || status !== GameStatus.IN_PROGRESS) return;
    makeMove({ from, to, promotion: 'q' });
  };

  useEffect(() => {
    if (game.turn() === 'b' && status === GameStatus.IN_PROGRESS && !computerThinking) {
      const playComputerTurn = async () => {
        setComputerThinking(true);
        setTimeout(() => {
          try {
            const bestMove = getBestMove(game);
            if (bestMove) {
              const gameCopy = new Chess(game.fen());
              const moveResult = gameCopy.move(bestMove);
              if (moveResult) {
                setGame(gameCopy);
                setHistory(gameCopy.history());
                setLastMove({ from: moveResult.from, to: moveResult.to });

                 if (gameCopy.isGameOver()) {
                  if (gameCopy.isCheckmate()) {
                    setStatus(GameStatus.CHECKMATE);
                    setWinner('b');
                  } else {
                    setStatus(GameStatus.DRAW);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Engine Error", error);
          } finally {
            setComputerThinking(false);
          }
        }, 300); // Slight delay for natural feel
      };
      playComputerTurn();
    }
  }, [game, status, makeMove]);

  const handleRestart = () => {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([]);
    setStatus(GameStatus.IN_PROGRESS);
    setWinner(undefined);
    setLastMove(null);
    setComputerThinking(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1e293b] text-white flex flex-col items-center justify-center p-0 sm:p-4 md:p-8 lg:p-12 overflow-y-auto">
      
      {/* Header for Mobile */}
      <header className="w-full max-w-6xl flex justify-between items-center p-4 lg:hidden">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">grandmaster-chess</h1>
      </header>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-12 pb-8 sm:pb-0">
        
        {/* Board Container */}
        <div className="w-full lg:w-auto flex-shrink-0 flex justify-center">
          <div className="relative w-full max-w-[95vw] sm:max-w-[600px] lg:max-w-[650px] aspect-square shadow-2xl rounded-sm sm:rounded-xl overflow-hidden border-[8px] sm:border-[12px] border-[#262522]">
             <Board 
               game={game} 
               onMove={onUserMove} 
               validMoves={game.moves()}
               disabled={status !== GameStatus.IN_PROGRESS || computerThinking || game.turn() === 'b'}
               orientation="w"
               lastMove={lastMove}
             />
          </div>
        </div>

        {/* Sidebar / Info Panel */}
        <div className="w-full max-w-[95vw] sm:max-w-[600px] lg:max-w-[400px] flex-grow">
          <GameInfo 
            status={status}
            turn={game.turn()}
            winner={winner}
            history={history}
            onRestart={handleRestart}
            thinking={computerThinking}
          />
        </div>
        
      </div>
    </div>
  );
};

export default App;