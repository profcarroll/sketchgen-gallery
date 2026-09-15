let grid;
let nextGrid;
let cellSize = 10;
let cols, rows;
let bgColor = 20;
let flashCells = [];

function setup() {
  createCanvas(400, 400);
  cols = width / cellSize;
  rows = height / cellSize;
  grid = createGrid();
  nextGrid = createGrid();
  initializeGrid();
}

function draw() {
  background(bgColor);
  updateGrid();
  renderGrid();
  updateFlashes();
  bgColor = constrain(bgColor + 0.01, 20, 50);
}

function createGrid() {
  return Array(rows).fill().map(() => Array(cols).fill(0));
}

function initializeGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (random() > 0.7) {
        grid[y][x] = 1;
      }
    }
  }
}

function updateGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[y][x] = 0;
          flashCells.push({x, y, age: 0});
        } else {
          nextGrid[y][x] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[y][x] = 1;
        } else {
          nextGrid[y][x] = 0;
        }
      }
    }
  }
  [grid, nextGrid] = [nextGrid, grid];
}

function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + cols) % cols;
      const ny = (y + dy + rows) % rows;
      count += grid[ny][nx];
    }
  }
  return count;
}

function renderGrid() {
  noStroke();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        fill(255, 200, 100);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function updateFlashes() {
  for (let i = flashCells.length - 1; i >= 0; i--) {
    const f = flashCells[i];
    f.age++;
    if (f.age > 5) {
      flashCells.splice(i, 1);
    } else {
      fill(255, 200, 100, 255 - f.age * 50);
      rect(f.x * cellSize, f.y * cellSize, cellSize, cellSize);
    }
  }
}
