import React, { useEffect, useRef } from 'react';
import { GameStatus, PieceColor } from '../types';



interface GameInfoProps {
  status: GameStatus;
  turn: PieceColor;
  winner?: PieceColor;
  history: string[];
  onRestart: () => void;
  thinking: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  status,
  turn,
  winner,
  history,
  onRestart,
  thinking,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Group history into pairs (White, Black)
  const historyPairs = [];
  for (let i = 0; i < history.length; i += 2) {
    historyPairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || '',
    });
  }

  return (
    <div className="w-full flex flex-col gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 sm:p-6 rounded-xl shadow-xl h-full lg:h-[650px]">
      
      {/* Title & Status */}
      <div className="pb-4 border-b border-slate-600/50">
        <h2 className="hidden lg:block text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Chess Pro
        </h2>
        
        {status === GameStatus.IN_PROGRESS ? (
          <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${thinking ? 'animate-pulse bg-blue-400' : 'bg-green-500'}`}></div>
              <span className="text-slate-200 font-medium">{thinking ? "Computer is thinking..." : "Your Turn"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded text-sm">
               {turn === 'w' ? <div className="w-4 h-4 rounded-full bg-white border border-gray-400"/> : <div className="w-4 h-4 rounded-full bg-black border border-gray-600"/>}
               <span className="font-semibold">{turn === 'w' ? "White" : "Black"}</span>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg text-center border ${
            status === GameStatus.CHECKMATE 
              ? winner === 'w' ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-100' : 'bg-red-900/50 border-red-500/50 text-red-100'
              : 'bg-yellow-900/50 border-yellow-500/50 text-yellow-100'
          }`}>
            <span className="text-lg font-bold block mb-1">
              {status === GameStatus.CHECKMATE && winner 
                ? (winner === 'w' ? 'White Wins!' : 'Checkmate - Computer Wins')
                : "Game Drawn"}
            </span>
            <span className="text-sm opacity-80">
              {status === GameStatus.CHECKMATE ? "by Checkmate" : (status === GameStatus.STALEMATE ? "Stalemate" : "Insufficient Material")}
            </span>
          </div>
        )}
      </div>

      {/* Move History */}
      <div className="flex-grow flex flex-col min-h-[150px] overflow-hidden bg-slate-900/50 rounded-lg border border-slate-700/50">
        <div className="bg-slate-800/80 p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between px-4">
          <span>#</span>
          <span className="w-1/2 text-center">White</span>
          <span className="w-1/2 text-center">Black</span>
        </div>
        <div ref={scrollRef} className="overflow-y-auto flex-grow p-2 scrollbar-thin">
          <table className="w-full text-sm text-left border-collapse">
            <tbody>
              {historyPairs.map((move, index) => (
                <tr key={index} className="odd:bg-slate-800/30 even:bg-transparent hover:bg-slate-700/50 transition-colors">
                  <td className="p-2 text-slate-500 w-8 font-mono text-xs">{move.num}.</td>
                  <td className="p-2 font-medium text-slate-200 w-1/2 text-center bg-white/5 rounded mx-1">{move.white}</td>
                  <td className="p-2 font-medium text-slate-200 w-1/2 text-center">{move.black}</td>
                </tr>
              ))}
              {historyPairs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500 italic text-sm">
                    Game started. White to move.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg shadow-blue-900/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-blue-400/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Game
        </button>
      </div>
    </div>
  );
};