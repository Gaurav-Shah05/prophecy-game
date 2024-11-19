export class RandomBot {
    makeMove(grid, getUnavailableNumbers) {
      const availableCells = [];
      const possibleMoves = new Map();
  
      // Find all available cells and their possible moves
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          if (grid[i][j] === null) {
            const cellUnavailable = getUnavailableNumbers(i, j, grid);
            const possibleValues = ['1', '2', '3', '4', '5', 'X'].filter(
              value => !cellUnavailable.has(value)
            );
            
            if (possibleValues.length > 0) {
              availableCells.push([i, j]);
              possibleMoves.set(`${i}-${j}`, possibleValues);
            }
          }
        }
      }
  
      if (availableCells.length === 0) return null;
  
      // Choose a random cell
      const randomCellIndex = Math.floor(Math.random() * availableCells.length);
      const [row, col] = availableCells[randomCellIndex];
      
      // Choose a random valid move for that cell
      const possibleValues = possibleMoves.get(`${row}-${col}`);
      const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
  
      return { row, col, value: randomValue };
    }
  }