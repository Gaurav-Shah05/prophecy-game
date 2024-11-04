// src/App.js
import React, { useState } from 'react';
import Grid from './Grid';
import Buttons from './Buttons';

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('Player 1');

    return (
        <div>
            <h1 className="text-left text-4xl font-bold">Prophecy Game</h1>
            <h1 className="text-lg mb-2">
                {gameStarted 
                    ? `Current Player: ${currentPlayer}`
                    :  (
                        <>
                            Click <span className="font-semibold text-blue-500">Start Game</span> to start playing!
                        </>
                    )
}
            </h1>
            <div className="w-4/12 flex flex-col justify-between m-auto">
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