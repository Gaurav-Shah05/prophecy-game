import React from 'react';

const CellMenu = ({ position, onSelect, onClose, unavailableNumbers }) => {
  const options = ['1', '2', '3', '4', '5', 'X'];

  return (
    <div 
      className="fixed bg-white shadow-lg rounded-md border border-gray-200 p-2 z-50"
      style={{
        top: position.top,
        left: position.left,
        transform: position.showAbove 
          ? 'translate(-100%, -100%)' 
          : 'translate(-100%, 0)',
      }}
    >
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isDisabled = unavailableNumbers.has(option);
          return (
            <div
              key={option}
              onClick={() => !isDisabled && onSelect(option)}
              className={`w-10 h-10 flex items-center justify-center 
                ${isDisabled 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-100'} 
                rounded`}
            >
              {option}
            </div>
          );
        })}
        <div
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded col-span-3"
        >
          Back
        </div>
      </div>
    </div>
  );
};

export default CellMenu; 