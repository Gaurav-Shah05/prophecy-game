import React from 'react';
import { useNavigate } from 'react-router-dom';
import Buttons from '../components/Buttons';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="game-title mb-12">Prophecy Game</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Buttons 
          text="Two Players" 
          onClick={() => navigate('/game/two-player')}
          otherClass="text-lg"
        />
        <Buttons 
          text="Single Player" 
          onClick={() => navigate('/game/single-player')}
          otherClass="text-lg"
        />
      </div>
    </div>
  );
};

export default LandingPage;