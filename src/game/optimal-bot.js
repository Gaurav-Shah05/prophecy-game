export class OptimalBot {
    constructor() {
      this.maxDepth = 4; 
      this.evaluationCache = new Map(); 
      this.moveOrderCache = new Map();
    }
  
    makeMove(grid, getUnavailableNumbers) {
  
      if (this.evaluationCache.size > 1000) this.evaluationCache.clear();
      if (this.moveOrderCache.size > 1000) this.moveOrderCache.clear();
  
      const startTime = Date.now();
      const bestMove = this.findBestMove(grid, getUnavailableNumbers);
      console.log(`Move calculation took: ${Date.now() - startTime}ms`);
      return bestMove;
    }
  
    findBestMove(grid, getUnavailableNumbers) {
      let bestScore = -Infinity;
      let bestMove = null;
      
      const availableMoves = this.getQuickMoves(grid, getUnavailableNumbers);
      
      // Use a shorter depth for the first few moves when there are many possibilities
      const moveCount = this.countMoves(grid);
      const adaptiveDepth = moveCount > 15 ? 2 : this.maxDepth;
  
      // Early game simple heuristics for instant moves
      if (moveCount > 18) {
        const quickMove = this.getEarlyGameMove(grid, availableMoves);
        if (quickMove) return quickMove;
      }
  
      for (const move of availableMoves) {
        const newGrid = this.makeTemporaryMove(grid, move);
        const score = this.minimax(
          newGrid,
          adaptiveDepth - 1,
          false,
          getUnavailableNumbers,
          -Infinity,
          Infinity
        );
  
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
  
        // Early exit if we find a winning move
        if (score > 1000) break;
      }
  
      return bestMove || availableMoves[0]; // Fallback to first available move
    }
  
    minimax(grid, depth, isMaximizing, getUnavailableNumbers, alpha, beta) {
      const gridKey = this.gridToString(grid);
      
      // Check cache
      const cacheKey = `${gridKey}-${depth}-${isMaximizing}`;
      if (this.evaluationCache.has(cacheKey)) {
        return this.evaluationCache.get(cacheKey);
      }
  
      // Base cases
      if (depth === 0 || this.isGameOver(grid)) {
        const evaluation = this.evaluatePosition(grid);
        this.evaluationCache.set(cacheKey, evaluation);
        return evaluation;
      }
  
      const moves = this.getQuickMoves(grid, getUnavailableNumbers);
      
      let bestScore = isMaximizing ? -Infinity : Infinity;
      
      for (const move of moves) {
        const newGrid = this.makeTemporaryMove(grid, move);
        const score = this.minimax(
          newGrid,
          depth - 1,
          !isMaximizing,
          getUnavailableNumbers,
          alpha,
          beta
        );
  
        bestScore = isMaximizing 
          ? Math.max(bestScore, score)
          : Math.min(bestScore, score);
  
        if (isMaximizing) {
          alpha = Math.max(alpha, score);
        } else {
          beta = Math.min(beta, score);
        }
  
        // Aggressive pruning
        if (beta <= alpha) break;
      }
  
      this.evaluationCache.set(cacheKey, bestScore);
      return bestScore;
    }
  
    getQuickMoves(grid, getUnavailableNumbers) {
      const gridKey = this.gridToString(grid);
      if (this.moveOrderCache.has(gridKey)) {
        return this.moveOrderCache.get(gridKey);
      }
  
      const moves = [];
      const possibleValues = ['1', '2', '3', '4', '5', 'X'];
  
      // First pass: find all empty cells and their quick evaluation
      const cellEvals = [];
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          if (grid[row][col] === null) {
            const unavailable = getUnavailableNumbers(row, col, grid);
            const available = possibleValues.filter(value => !unavailable.has(value));
            
            // Quick cell evaluation
            const evalScore = this.quickEvaluateCell(grid, row, col);
            cellEvals.push({ row, col, score: evalScore, values: available });
          }
        }
      }
  
      // Sort cells by their evaluation score
      cellEvals.sort((a, b) => b.score - a.score);
  
      // Generate moves for the best cells first
      for (const cellEval of cellEvals) {
        for (const value of cellEval.values) {
          moves.push({ row: cellEval.row, col: cellEval.col, value });
        }
      }
  
      this.moveOrderCache.set(gridKey, moves);
      return moves;
    }
  
    quickEvaluateCell(grid, row, col) {
      let score = 0;
      
      // Prefer center positions
      const centerRowScore = Math.abs(1.5 - row);
      const centerColScore = Math.abs(2 - col);
      score -= (centerRowScore + centerColScore);
  
      // Count existing numbers in row and column
      const rowNumbers = grid[row].filter(cell => !isNaN(cell) && cell !== 'X').length;
      const colNumbers = grid.map(r => r[col]).filter(cell => !isNaN(cell) && cell !== 'X').length;
      
      // Prefer rows/columns with some numbers but not too many
      score += (2 - Math.abs(2 - rowNumbers)) * 2;
      score += (2 - Math.abs(2 - colNumbers)) * 2;
  
      return score;
    }
  
    getEarlyGameMove(grid, availableMoves) {
      // Simple early game strategy: play in center areas with numbers 2-4
      const centerMoves = availableMoves.filter(move => 
        (move.row === 1 || move.row === 2) && 
        (move.col === 1 || move.col === 2 || move.col === 3) &&
        move.value >= '2' && move.value <= '4'
      );
  
      if (centerMoves.length > 0) {
        return centerMoves[Math.floor(Math.random() * centerMoves.length)];
      }
      return null;
    }
  
    evaluatePosition(grid) {
      const gridKey = this.gridToString(grid);
      if (this.evaluationCache.has(gridKey)) {
        return this.evaluationCache.get(gridKey);
      }
  
      let score = 0;
      
      // Evaluate rows
      for (let i = 0; i < grid.length; i++) {
        score += this.evaluateLine(grid[i]) * 1.1; // Slight preference for row prophecies
      }
  
      // Evaluate columns
      for (let j = 0; j < grid[0].length; j++) {
        const column = grid.map(row => row[j]);
        score += this.evaluateLine(column);
      }
  
      this.evaluationCache.set(gridKey, score);
      return score;
    }
  
    evaluateLine(line) {
      const numbersCount = line.filter(cell => !isNaN(cell) && cell !== 'X').length;
      let score = 0;
  
      // Score for fulfilled prophecies
      line.forEach(cell => {
        if (!isNaN(cell) && cell !== 'X') {
          const prophecy = parseInt(cell);
          if (prophecy === numbersCount) {
            score += prophecy * 10;
          } else {
            // Partial credit for being close
            score -= Math.abs(prophecy - numbersCount);
          }
        }
      });
  
      return score;
    }
  
    gridToString(grid) {
      return grid.map(row => row.join(',')).join(';');
    }
  
    makeTemporaryMove(grid, move) {
      const newGrid = grid.map(row => [...row]);
      newGrid[move.row][move.col] = move.value;
      return newGrid;
    }
  
    isGameOver(grid) {
      return grid.every(row => row.every(cell => cell !== null));
    }
  
    countMoves(grid) {
      return grid.flat().filter(cell => cell !== null).length;
    }
  }