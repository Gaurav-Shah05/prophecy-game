// src/App.js
import React, { useState } from 'react';
import Grid from './Grid';

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('Player 1');

    // Function to get player color class
    const getPlayerColorClass = (player) => {
        return player === 'Player 1' ? 'text-pink-400' : 'text-blue-400';
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="game-title">Prophecy Game</h1>
            <div className="player-info mt-1.5 m-auto">
                {gameStarted ? (
                    <span>
                        Current Player: {' '}
                        <span className={getPlayerColorClass(currentPlayer)}>
                            {currentPlayer}
                        </span>
                    </span>
                ) : (
                    <>
                        Click <span className="font-semibold text-blue-400">Start Game</span> to begin the prophecy!
                    </>
                )}
            </div>
            <div className="w-full md:w-6/12 flex flex-col justify-between m-auto">
                <Grid 
                    gameStarted={gameStarted} 
                    setGameStarted={setGameStarted}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                />
            </div>
        </div>
    );
}

export default App;