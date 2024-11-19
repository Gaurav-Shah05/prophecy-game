import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SinglePlayerSetup from './pages/SinglePlayerSetup';
import Grid from './components/Grid';
import './App.css';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('Player 1');

  return (
    <Router>
      <div className="max-w-[1200px] mx-auto px-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game/single-player" element={<SinglePlayerSetup />} />
          <Route 
            path="/game/two-player" 
            element={
              <Grid 
                gameMode="two-player"
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            } 
          />
          <Route 
            path="/game/single-player/first" 
            element={
              <Grid 
                gameMode="single-player"
                playerTurn="first"
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            } 
          />
          <Route 
            path="/game/single-player/second" 
            element={
              <Grid 
                gameMode="single-player"
                playerTurn="second"
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;