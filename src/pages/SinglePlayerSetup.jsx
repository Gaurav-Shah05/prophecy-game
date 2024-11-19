import React from 'react';
import { useNavigate } from 'react-router-dom';
import Buttons from '../components/Buttons';

const SinglePlayerSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="game-title mb-8">Choose Your Turn</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Buttons 
          text="Play First" 
          onClick={() => navigate('/game/single-player/first')}
          otherClass="text-lg"
        />
        <Buttons 
          text="Play Second" 
          onClick={() => navigate('/game/single-player/second')}
          otherClass="text-lg"
        />
        <Buttons 
          text="Back" 
          onClick={() => navigate('/')}
          otherClass="text-lg bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
        />
      </div>
    </div>
  );
};

export default SinglePlayerSetup; 