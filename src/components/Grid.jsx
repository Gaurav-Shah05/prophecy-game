import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Buttons from './Buttons';
import CellMenu from './CellMenu';
import ScoreDisplay from './ScoreDisplay';
import { RandomBot } from '../game/bot';
import { OptimalBot } from '../game/optimal-bot';   
import '../App.css';

const Grid = ({ gameMode = 'two-player', playerTurn = 'first', gameStarted, setGameStarted, currentPlayer, setCurrentPlayer }) => {
  const navigate = useNavigate();
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
  const [isGameOver, setIsGameOver] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState(null);
  const [bot] = useState(gameMode === 'single-player' ? new OptimalBot() : null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botWorker = new Worker(new URL('../game/botWorker.js', import.meta.url));

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

  // Helper function to check if a line is complete (all cells filled)
  const isLineComplete = (line) => {
    return line.every(cell => cell !== null);
  };

  // Calculate scores
  const calculateScores = (currentGrid, currentPlayerMoves) => {
    let score1 = 0;
    let score2 = 0;

    // Check rows
    for (let i = 0; i < currentGrid.length; i++) {
      const row = currentGrid[i];
      // Only calculate score if row is complete
      if (isLineComplete(row)) {
        const numberCount = row.filter(cell => !isNaN(cell) && cell !== 'X').length;
        
        // Check each prophecy in this row
        row.forEach((cell, j) => {
          if (!isNaN(cell) && cell !== 'X') {
            const prophecy = parseInt(cell);
            if (prophecy === numberCount) {
              if (currentPlayerMoves[i][j] === 'Player 1') {
                score1 += numberCount;
              } else if (currentPlayerMoves[i][j] === 'Player 2') {
                score2 += numberCount;
              }
            }
          }
        });
      }
    }

    // Check columns
    for (let j = 0; j < currentGrid[0].length; j++) {
      const column = currentGrid.map(row => row[j]);
      // Only calculate score if column is complete
      if (isLineComplete(column)) {
        const numberCount = column.filter(cell => !isNaN(cell) && cell !== 'X').length;
        
        // Check each prophecy in this column
        column.forEach((cell, i) => {
          if (!isNaN(cell) && cell !== 'X') {
            const prophecy = parseInt(cell);
            if (prophecy === numberCount) {
              if (currentPlayerMoves[i][j] === 'Player 1') {
                score1 += numberCount;
              } else if (currentPlayerMoves[i][j] === 'Player 2') {
                score2 += numberCount;
              }
            }
          }
        });
      }
    }

    return { score1, score2 };
  };

  // Update scores in real-time
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const { score1, score2 } = calculateScores(grid, playerMoves);
      setPlayer1Score(score1);
      setPlayer2Score(score2);
    }
  }, [grid, gameStarted]);

  // Bot move effect
  useEffect(() => {
    if (gameMode === 'single-player' && 
        gameStarted && 
        !isGameOver && 
        ((playerTurn === 'second' && currentPlayer === 'Player 1') ||
         (playerTurn === 'first' && currentPlayer === 'Player 2'))) {
      makeBotMove();
    }
  }, [currentPlayer, gameStarted, isGameOver]);

// Clean up worker when component unmounts
  useEffect(() => {
    return () => {
      botWorker.terminate();
    };
  }, []);

  const makeBotMove = async () => {
    if (!bot) return;
    
    setIsBotThinking(true);
    
    // Add a small delay to make the bot's move feel more natural
    await new Promise(resolve => setTimeout(resolve, 500));
  
    try {
      const botMove = bot.makeMove(grid, getUnavailableNumbers);
      
      if (botMove) {
        handleMenuSelect(botMove.value, botMove.row, botMove.col);
      }
    } catch (error) {
      console.error('Error in bot move:', error);
    } finally {
      setIsBotThinking(false);
    }
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

  // Check if the grid is full
  const checkGameOver = (currentGrid) => {
    const isFull = currentGrid.every(row => 
      row.every(cell => cell !== null)
    );
    
    if (isFull) {
      const { score1, score2 } = calculateScores(currentGrid, playerMoves);
      setPlayer1Score(score1);
      setPlayer2Score(score2);
      
      // Determine winner
      if (score1 > score2) {
        setWinner('Player 1');
      } else if (score2 > score1) {
        setWinner('Player 2');
      } else {
        setWinner('tie');
      }
      
      setIsGameOver(true);
    }
  };

  const handleCellClick = (rowIndex, colIndex, event) => {
    if (!gameStarted || 
        grid[rowIndex][colIndex] !== null || 
        isBotThinking || 
        (gameMode === 'single-player' && 
         ((playerTurn === 'second' && currentPlayer === 'Player 1') ||
          (playerTurn === 'first' && currentPlayer === 'Player 2')))) {
      return;
    }
    
    const cellRect = event.currentTarget.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const menuHeight = 200;
    
    const spaceBelow = windowHeight - cellRect.bottom;
    const showAbove = spaceBelow < menuHeight;
    
    setMenuPosition({
      top: showAbove ? (cellRect.top + 'px') : (cellRect.bottom + 'px'),
      left: cellRect.right + 'px',
      showAbove: showAbove
    });
    setSelectedCell({ rowIndex, colIndex });
  };

  const handleMenuSelect = (value, forcedRow = null, forcedCol = null) => {
    const rowIndex = forcedRow !== null ? forcedRow : selectedCell.rowIndex;
    const colIndex = forcedCol !== null ? forcedCol : selectedCell.colIndex;

    setMoveHistory([...moveHistory, {
      grid: grid.map(row => [...row]),
      playerMoves: playerMoves.map(row => [...row]),
      player1Score,
      player2Score
    }]);
    setPlayerHistory([...playerHistory, currentPlayer]);

    // Update the selected cell
    let newGrid = grid.map(row => [...row]);
    let newPlayerMoves = playerMoves.map(row => [...row]);
    let newAutoFilled = autoFilledCells.map(row => [...row]);
    
    // Store which player made this move and mark as not auto-filled
    newGrid[rowIndex][colIndex] = value;
    newPlayerMoves[rowIndex][colIndex] = currentPlayer;
    newAutoFilled[rowIndex][colIndex] = false;

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

    checkGameOver(newGrid);
  };

  const handleMenuClose = () => {
    setMenuPosition(null);
    setSelectedCell(null);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    // If playing second in single-player mode, trigger bot's first move
    if (gameMode === 'single-player' && playerTurn === 'second') {
      setCurrentPlayer('Player 1');
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0 || 
        (gameMode === 'single-player' && isBotThinking)) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const previousPlayer = playerHistory[playerHistory.length - 1];
    
    setGrid(lastMove.grid);
    setPlayerMoves(lastMove.playerMoves);
    setPlayer1Score(lastMove.player1Score);
    setPlayer2Score(lastMove.player2Score);
    setCurrentPlayer(previousPlayer);

    // Remove the last state from history
    setMoveHistory(moveHistory.slice(0, -1));
    setPlayerHistory(playerHistory.slice(0, -1));
  };

  const handleQuitGame = () => {
    navigate('/');
  };
  
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

  return (
    <div className="relative">
      <ScoreDisplay
        isGameOver={isGameOver}
        player1Score={player1Score}
        player2Score={player2Score}
        gameStarted={gameStarted}
        winner={winner}
      />
      
      {isBotThinking && (
        <div className="text-center text-gray-400 mt-2 mb-4">
          Bot is thinking...
        </div>
      )}

      {(!isGameOver || !gameStarted) && (
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
      )}
      
      {menuPosition && selectedCell && (
        <CellMenu
          position={menuPosition}
          onSelect={handleMenuSelect}
          onClose={handleMenuClose}
          unavailableNumbers={getUnavailableNumbers(selectedCell.rowIndex, selectedCell.colIndex, grid)}
          currentPlayer={currentPlayer}
        />
      )}
      
      <div className="flex justify-center gap-4 mt-4">
        {!gameStarted ? (
          <Buttons text="Start Game" onClick={handleStartGame} />
        ) : (
          <>
            {!isGameOver && (
              <Buttons 
                text="Undo" 
                onClick={handleUndo}
                otherClass={moveHistory.length === 0 || 
                  (gameMode === 'single-player' && isBotThinking) 
                  ? 'opacity-50 cursor-not-allowed' : ''}
              />
            )}
            <Buttons text={isGameOver ? "New Game" : "Quit Game"} onClick={handleQuitGame} />
          </>
        )}
      </div>
    </div>
  );
};

export default Grid;