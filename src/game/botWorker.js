// botWorker.js
import {OptimalBot} from './optimal-bot';

const bot = new OptimalBot();

self.onmessage = function(e) {
  const { grid, getUnavailableNumbers } = e.data;
  
  try {
    const move = bot.makeMove(grid, getUnavailableNumbers);
    self.postMessage({ type: 'move', move });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};

// Helper function to serialize grid state
function serializeGrid(grid) {
  return grid.map(row => row.map(cell => cell || '_').join('')).join('|');
}