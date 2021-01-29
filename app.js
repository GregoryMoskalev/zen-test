const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let rows = 5;
let columns = 5;

function setFieldSize(callback) {
  readline.question('select x size (5):', (n) => {
    rows = Number(n) || rows;
    console.log(`x size is: ${rows}`);

    readline.question('select y size (5):', (n) => {
      columns = Number(n) || columns;
      console.log(`y size is: ${columns}`);
      callback();
    });
  });
}

function makeBoard() {
  const x = new Array(Number(rows));

  for (let i = 0; i < rows; i += 1) {
    x[i] = new Array(Number(columns));
    for (let j = 0; j < columns; j += 1) {
      x[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return x;
}

function neighborExist(x, y, board) {
  return x >= 0 && x < board.length && y >= 0 && y < board[0].length;
}

function checkNeighborIsAlive(x, y, board) {
  return neighborExist(x, y, board) ? board[x][y] : 0;
}

function countNeighbors(i, j, board) {
  return (
    checkNeighborIsAlive(i, j + 1, board) +
    checkNeighborIsAlive(i, j - 1, board) +
    checkNeighborIsAlive(i + 1, j + 1, board) +
    checkNeighborIsAlive(i + 1, j - 1, board) +
    checkNeighborIsAlive(i - 1, j + 1, board) +
    checkNeighborIsAlive(i - 1, j - 1, board) +
    checkNeighborIsAlive(i + 1, j, board) +
    checkNeighborIsAlive(i - 1, j, board)
  );
}

function turn(board) {
  const newBoard = new Array(Number(rows));
  for (let i = 0; i < board.length; i += 1) {
    newBoard[i] = new Array(Number(columns));
    for (let j = 0; j < board[0].length; j += 1) {
      const neighbors = countNeighbors(i, j, board);
      if (board[i][j]) {
        newBoard[i][j] = neighbors < 2 || neighbors > 3 ? 0 : 1;
      } else if (neighbors === 3) {
        newBoard[i][j] = 1;
      } else {
        newBoard[i][j] = 0;
      }
    }
  }
  console.clear();
  console.table(newBoard);
  setTimeout(() => turn(newBoard), 1000);
}

function live(b) {
  const board = Array.isArray(b) ? b : makeBoard();
  setTimeout(() => turn(board), 1000);
}

function init() {
  readline.question(
    'Place a link to js file with a two dimensional array of 0 and 1 or leave empty: ',
    (arr) => {
      try {
        const data = !arr ? '' : fs.readFileSync(arr);
        if (!data) {
          setFieldSize(live);
        } else {
          live(data);
        }
      } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
        init();
      }
    },
  );
}

init();
