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
  const [playerMoves, setPlayerMoves] = useState(Array(4).fill().map(() => Array(5).fill(null)));
  const [autoFilledCells, setAutoFilledCells] = useState(
    Array(4).fill().map(() => Array(5).fill(false))
  );

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
    const newAutoFilled = [...autoFilledCells.map(row => [...row])];
    const allOptions = ['1', '2', '3', '4', '5'];

    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        if (newGrid[row][col] === null) {
          const unavailable = getUnavailableNumbers(row, col, newGrid);
          
          // Check if all numbers (1-5) are used in this row or column
          const allNumbersUsed = allOptions.every(num => unavailable.has(num));
          
          // Only fill with X if all numbers are used
          if (allNumbersUsed) {
            newGrid[row][col] = 'X';
            newAutoFilled[row][col] = true; // Mark as auto-filled
            gridChanged = true;
          }
        }
      }
    }

    if (gridChanged) {
      setAutoFilledCells(newAutoFilled);
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
    let newPlayerMoves = playerMoves.map(row => [...row]);
    let newAutoFilled = autoFilledCells.map(row => [...row]);
    
    // Store which player made this move and mark as not auto-filled
    newGrid[selectedCell.rowIndex][selectedCell.colIndex] = value;
    newPlayerMoves[selectedCell.rowIndex][selectedCell.colIndex] = currentPlayer;
    newAutoFilled[selectedCell.rowIndex][selectedCell.colIndex] = false;

    // Check for auto-fill opportunities
    let autoFilledGrid = checkAndAutoFill(newGrid);
    while (autoFilledGrid) {
      newGrid = autoFilledGrid;
      // For auto-filled cells, also track the current player
      for(let i = 0; i < newGrid.length; i++) {
        for(let j = 0; j < newGrid[0].length; j++) {
          if(newGrid[i][j] !== null && playerMoves[i][j] === null) {
            newPlayerMoves[i][j] = currentPlayer;
          }
        }
      }
      autoFilledGrid = checkAndAutoFill(newGrid);
    }

    // Update state
    setGrid(newGrid);
    setPlayerMoves(newPlayerMoves);
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
    
    // Reset playerMoves for the undone cells
    const newPlayerMoves = playerMoves.map((row, i) => 
      row.map((player, j) => 
        previousGrid[i][j] === null ? null : player
      )
    );

    // Update current state
    setGrid(previousGrid);
    setPlayerMoves(newPlayerMoves);
    setCurrentPlayer(previousPlayer);

    // Remove the last state from history
    setMoveHistory(moveHistory.slice(0, -1));
    setPlayerHistory(playerHistory.slice(0, -1));
  };

  const handleQuitGame = () => {
    setGameStarted(false);
    setGrid(initialGrid);
    setPlayerMoves(Array(4).fill().map(() => Array(5).fill(null)));
    setCurrentPlayer('Player 1');
    setMoveHistory([]);
    setPlayerHistory([]);
  };

  return (
    <div className="relative">
      <div className={`grid-container ${!gameStarted 
        ? 'game-not-started' 
        : currentPlayer === 'Player 1' 
          ? 'player1-turn' 
          : 'player2-turn'}`}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-item ${cell !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
            >
              {cell && (
                <span 
                  className={`
                    ${autoFilledCells[rowIndex][colIndex] 
                      ? 'text-gray-400' 
                      : playerMoves[rowIndex][colIndex] === 'Player 1' 
                        ? 'text-pink-400' 
                        : 'text-blue-400'
                    }
                  `}
                >
                  {cell}
                </span>
              )}
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
          currentPlayer={currentPlayer}
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
