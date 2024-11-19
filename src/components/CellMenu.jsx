import React from 'react';

const CellMenu = ({ position, onSelect, onClose, unavailableNumbers, currentPlayer }) => {
  const options = ['1', '2', '3', '4', '5', 'X'];
  const isMobile = window.innerWidth <= 768;

  return (
    <div 
      className={`fixed bg-gray-800 shadow-2xl rounded-xl border border-gray-700 p-3 z-50 cell-menu`}
      style={isMobile ? {
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)'
      } : {
        top: position.top,
        left: position.left,
        transform: position.showAbove 
          ? 'translate(-100%, -100%)' 
          : 'translate(-100%, 0)',
      }}
    >
      <div className={`grid grid-cols-3 ${isMobile ? 'gap-2' : 'gap-3'}`}>
        {options.map((option) => {
          const isDisabled = unavailableNumbers.has(option);
          return (
            <div
              key={option}
              onClick={() => !isDisabled && onSelect(option)}
              className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center text-lg font-semibold
                ${isDisabled 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : currentPlayer === 'Player 1'
                    ? 'cursor-pointer hover:bg-pink-500/20 text-pink-400 hover:text-pink-300'
                    : 'cursor-pointer hover:bg-blue-500/20 text-blue-400 hover:text-blue-300'} 
                rounded-lg transition-all duration-200 border-2
                ${isDisabled 
                  ? 'border-gray-700' 
                  : currentPlayer === 'Player 1'
                    ? 'border-pink-500/30 hover:border-pink-500'
                    : 'border-blue-500/30 hover:border-blue-500'}`}
            >
              {option}
            </div>
          );
        })}
        <div
          onClick={onClose}
          className={`w-full ${isMobile ? 'h-10' : 'h-12'} flex items-center justify-center cursor-pointer 
            hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg col-span-3 
            font-semibold transition-all duration-200 border-2 border-red-500/30 hover:border-red-500
            mt-1`}
        >
          Back
        </div>
      </div>
    </div>
  );
};

export default CellMenu; 