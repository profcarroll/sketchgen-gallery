let grid;
let nextGrid;
let resolution = 10;
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  grid = createGrid(cols, rows);
  nextGrid = createGrid(cols, rows);
}

function draw() {
  background(0);
  updateGrid();
  displayGrid();
}

function createGrid(cols, rows) {
  let g = [];
  for (let i = 0; i < cols; i++) {
    g[i] = [];
    for (let j = 0; j < rows; j++) {
      g[i][j] = floor(random(2));
    }
  }
  return g;
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
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  return sum;
}

function displayGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        fill(255);
        noStroke();
        rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  grid = createGrid(cols, rows);
  nextGrid = createGrid(cols, rows);
}
