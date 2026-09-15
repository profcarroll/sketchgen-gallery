let grid;
let nextGrid;
let cols, rows;
let cellSize = 8;
let isRunning = true;

function setup() {
  createCanvas(1024, 1024);
  cols = width / cellSize;
  rows = height / cellSize;
  grid = createGrid();
  nextGrid = createGrid();
  initializeRandom();
}

function draw() {
  background(10);
  
  if (isRunning) {
    updateGrid();
  }
  
  displayGrid();
}

function createGrid() {
  let g = [];
  for (let i = 0; i < cols; i++) {
    g[i] = [];
    for (let j = 0; j < rows; j++) {
      g[i][j] = 0;
    }
  }
  return g;
}

function initializeRandom() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (random() > 0.7) {
        grid[i][j] = 1;
      }
    }
  }
}

function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      if (grid[i][j] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0;
        } else {
          nextGrid[i][j] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[i][j] = 1;
        } else {
          nextGrid[i][j] = 0;
        }
      }
    }
  }
  
  // Swap grids
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
}

function countNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let nx = (x + i + cols) % cols;
      let ny = (y + j + rows) % rows;
      count += grid[nx][ny];
    }
  }
  return count;
}

function displayGrid() {
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        fill(255, 100, 150);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      } else {
        fill(10);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = grid[x][y] === 1 ? 0 : 1;
  }
}

function keyPressed() {
  if (key === ' ') {
    isRunning = !isRunning;
  }
}
