const board = document.getElementById('tic-tac-toe');
const resetButton = document.getElementById('reset');
const themeToggleButton = document.getElementById('theme-toggle');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const turnIndicator = document.getElementById('turn-indicator');
const playerXNameInput = document.getElementById('player-x-name');
const playerONameInput = document.getElementById('player-o-name');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const historyList = document.getElementById('history-list');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = { X: 0, O: 0 };
let history = [];
let historyIndex = -1;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = Array.from(board.children).indexOf(clickedCell);

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add('selected');

  if (checkWin()) {
    turnIndicator.textContent = `${currentPlayer === 'X' ? playerXNameInput.value || 'Player X' : playerONameInput.value || 'Player O'} Wins!`;
    scores[currentPlayer]++;
    updateScores();
    gameActive = false;
    addHistory('Win');
    return;
  }

  if (!gameState.includes('')) {
    turnIndicator.textContent = "It's a Draw!";
    gameActive = false;
    addHistory('Draw');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
  return winningConditions.some(condition => 
    condition.every(index => gameState[index] === currentPlayer)
  );
}

function resetGame() {
  gameState.fill('');
  currentPlayer = 'X';
  gameActive = true;
  turnIndicator.textContent = `Player X's turn`;
  Array.from(board.children).forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('selected');
  });
  addHistory('Reset');
}

function updateScores() {
  scoreX.textContent = `${playerXNameInput.value || 'Player X'}: ${scores.X}`;
  scoreO.textContent = `${playerONameInput.value || 'Player O'}: ${scores.O}`;
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  Array.from(board.children).forEach(cell => cell.classList.toggle('dark-mode'));
  resetButton.classList.toggle('dark-mode');
  themeToggleButton.classList.toggle('dark-mode');
  undoButton.classList.toggle('dark-mode');
  redoButton.classList.toggle('dark-mode');
}

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.classList.add('tic-tac-toe-cell');
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function addHistory(action) {
  const historyEntry = document.createElement('li');
  historyEntry.textContent = `Move ${history.length + 1}: ${action}`;
  historyList.appendChild(historyEntry);
  history.push([...gameState]);
  historyIndex++;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    gameState = history[historyIndex];
    updateBoard();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    gameState = history[historyIndex];
    updateBoard();
  }
}

function updateBoard() {
  Array.from(board.children).forEach((cell, index) => {
    cell.textContent = gameState[index];
    cell.classList.toggle('selected', gameState[index] !== '');
  });
  currentPlayer = gameState.includes('') ? (gameState.filter(cell => cell === 'X').length > gameState.filter(cell => cell === 'O').length ? 'O' : 'X') : currentPlayer;
  gameActive = !gameState.includes('');
  turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
}

createBoard();
resetButton.addEventListener('click', resetGame);
themeToggleButton.addEventListener('click', toggleTheme);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
