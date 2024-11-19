import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Buttons from '../components/Buttons';

const LandingPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();


  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="game-title mb-12">Prophecies</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {/* Buttons */}
        <Buttons 
          text="How to Play" 
          onClick={openPopup}
          otherClass="text-lg"
        />
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

      {/* Instructions Popup */}
      {isPopupOpen && (
  <div className="popup-overlay" onClick={closePopup}>
    <div 
      className="popup-content font-sans text-base leading-relaxed" 
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
    >

      {/* Popup Header */}
      <h2 className="text-3xl font-bold mb-6">Welcome to the Game of Prophecies!</h2>

      {/* Introductory Context */}
        <p className="mb-4">
        In this game from designer Andy Juell, a prophecy isn’t just a prediction. It’s an action. And it can, in a headache-inducing way, alter the very future that it aims to forecast…
        </p>
        <p className="mb-6">
        Your goal: Accurately predict how many numbers will appear in a given row or column, by writing that number somewhere in the row or column.
        </p>

        {/* Instructions List */}
        <ul className="list-disc pl-5 text-left">
          <li className="mb-2">Take turns marking empty cells with either a number or an X. Each number is a kind of prophecy: a prediction of how many numbers will eventually appear in that row or column.</li>
          <li className="mb-2">The smallest usable number is 1, and the largest is the length of the row or column (whichever is larger). Meanwhile, an X simply fills up a spot, ensuring no number appears there.</li>
          <li className="mb-2">To avoid repeat prophecies, no number can appear more than once in a given row or column.</li>
          <li className="mb-2">If a cell becomes impossible to fill, because any number would be a repeat prophecy, an X will automatically appear. This is just a friendly act of bookkeeping; it does not count as a turn.</li>
          <li className="mb-2">Whoever makes the correct prophecy in each row (and each column) is awarded that number of points. Note that a single prophecy may score twice (once in its row, and once in its column), while some rows or columns may contain no correct prophecy.</li>
          <li className="mb-2">Whoever scores more points is the winner!</li>

        </ul>

        {/* Footer */}
        <p className="mt-6 font-medium">In our rendition of this game, you can play with a friend or with our bot!</p>
        <p className="mt-6 font-medium">Credits: Ben Orlin, <span className="italic">Math Games with Bad Drawings</span></p>
        {/* Close Button */}
        <button 
          className="btn close-btn mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
          onClick={closePopup}
        >
          Close
        </button>
      </div>
    </div>
  )}

    </div>
  );
};

export default LandingPage;
