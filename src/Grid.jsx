import React, { useState, useEffect } from 'react';
import './App.css';
import Buttons from './Buttons';
import CellMenu from './CellMenu';

const Grid = ({ gameStarted, setGameStarted, currentPlayer, setCurrentPlayer }) => {
  const initialGrid = Array(4).fill().map(() => Array(5).fill(null));
  const [grid, setGrid] = useState(initialGrid);
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerHistory, setPlayerHistory] = useState([]);

  // Get unavailable numbers for a specific cell
  const getUnavailableNumbers = (rowIndex, colIndex, currentGrid) => {
    const unavailableNums = new Set();
    
    // Check row
    currentGrid[rowIndex].forEach(cell => {
      if (cell) unavailableNums.add(cell);
    });

    // Check column
    currentGrid.forEach(row => {
      const cell = row[colIndex];
      if (cell) unavailableNums.add(cell);
    });

    return unavailableNums;
  };

  // Check if any cell has only one possible option and fill it
  const checkAndAutoFill = (currentGrid) => {
    let gridChanged = false;
    const newGrid = [...currentGrid.map(row => [...row])];
    const allOptions = ['1', '2', '3', '4', '5', 'X'];

    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        if (newGrid[row][col] === null) {
          const unavailable = getUnavailableNumbers(row, col, newGrid);
          const available = allOptions.filter(opt => !unavailable.has(opt));
          
          if (available.length === 1) {
            newGrid[row][col] = available[0];
            gridChanged = true;
          }
        }
      }
    }

    return gridChanged ? newGrid : null;
  };

  const handleMenuSelect = (value) => {
    if (!selectedCell) return;

    // Save current state to history
    setMoveHistory([...moveHistory, grid]);
    setPlayerHistory([...playerHistory, currentPlayer]);

    // Update the selected cell
    let newGrid = grid.map(row => [...row]);
    newGrid[selectedCell.rowIndex][selectedCell.colIndex] = value;

    // Check for auto-fill opportunities
    let autoFilledGrid = checkAndAutoFill(newGrid);
    while (autoFilledGrid) {
      newGrid = autoFilledGrid;
      autoFilledGrid = checkAndAutoFill(newGrid);
    }

    // Update state
    setGrid(newGrid);
    setMenuPosition(null);
    setSelectedCell(null);
    setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuPosition && !event.target.closest('.grid-item')) {
        setMenuPosition(null);
        setSelectedCell(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuPosition]);

  // Handle cell click and show menu
  const handleCellClick = (rowIndex, colIndex, event) => {
    if (!gameStarted || grid[rowIndex][colIndex] !== null) return;
    
    const cellRect = event.currentTarget.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const menuHeight = 200; // Approximate height of menu including padding
    
    // Check if there's enough space below the cell
    const spaceBelow = windowHeight - cellRect.bottom;
    const showAbove = spaceBelow < menuHeight;
    
    setMenuPosition({
      top: showAbove ? (cellRect.top + 'px') : (cellRect.bottom + 'px'),
      left: cellRect.right + 'px',
      showAbove: showAbove
    });
    setSelectedCell({ rowIndex, colIndex });
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuPosition(null);
    setSelectedCell(null);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    // Get the last state from history
    const previousGrid = moveHistory[moveHistory.length - 1];
    const previousPlayer = playerHistory[playerHistory.length - 1];

    // Update current state
    setGrid(previousGrid);
    setCurrentPlayer(previousPlayer);

    // Remove the last state from history
    setMoveHistory(moveHistory.slice(0, -1));
    setPlayerHistory(playerHistory.slice(0, -1));
  };

  const handleQuitGame = () => {
    setGameStarted(false);
    setGrid(initialGrid);
    setCurrentPlayer('Player 1');
    // Clear history when quitting
    setMoveHistory([]);
    setPlayerHistory([]);
  };

  return (
    <div className="relative">
      <div className="grid-container mb-8">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-item ${cell !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      
      {menuPosition && selectedCell && (
        <CellMenu
          position={menuPosition}
          onSelect={handleMenuSelect}
          onClose={handleMenuClose}
          unavailableNumbers={getUnavailableNumbers(selectedCell.rowIndex, selectedCell.colIndex, grid)}
        />
      )}
      
      <div className="flex justify-center gap-4">
        {!gameStarted ? (
          <Buttons text="Start Game" onClick={handleStartGame} />
        ) : (
          <>
            <Buttons 
              text="Undo" 
              onClick={handleUndo}
              otherClass={moveHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            />
            <Buttons text="Quit Game" onClick={handleQuitGame} />
          </>
        )}
      </div>
    </div>
  );
};

export default Grid;
