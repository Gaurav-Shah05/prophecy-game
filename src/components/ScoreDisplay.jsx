import React from 'react';

const ScoreDisplay = ({ 
  isGameOver, 
  player1Score, 
  player2Score, 
  gameStarted,
  winner 
}) => {
  if (!gameStarted) return null;

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700 max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Game Over!</h2>
        
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-between items-center p-4 bg-gray-800/80 rounded-xl">
            <span className="text-pink-400 font-semibold">Player 1</span>
            <span className="text-2xl font-bold text-pink-400">{player1Score}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-800/80 rounded-xl">
            <span className="text-blue-400 font-semibold">Player 2</span>
            <span className="text-2xl font-bold text-blue-400">{player2Score}</span>
          </div>
        </div>

        <div className="text-xl md:text-2xl font-bold mt-4 text-center">
          {winner === 'tie' ? (
            <span className="text-purple-400">It's a tie!</span>
          ) : (
            <span className={winner === 'Player 1' ? 'text-pink-400' : 'text-blue-400'}>
              {winner} wins!
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-8 mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-pink-400 font-semibold">Player 1:</span>
        <span className="text-xl font-bold text-pink-400">{player1Score}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-blue-400 font-semibold">Player 2:</span>
        <span className="text-xl font-bold text-blue-400">{player2Score}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;