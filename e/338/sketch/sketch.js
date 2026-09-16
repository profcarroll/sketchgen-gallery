let grid;
let nextGrid;
let cols, rows;
let cellSize = 10;
let bgColor = 20;
let flashCells = [];
let glowCells = [];

function setup() {
  createCanvas(400, 400);
  cols = width / cellSize;
  rows = height / cellSize;
  grid = createGrid();
  nextGrid = createGrid();
  
  // Initialize some cells to start the simulation
  for (let i = 0; i < cols * rows * 0.3; i++) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    grid[x][y] = 1;
  }
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

function draw() {
  background(bgColor);
  
  // Darken background periodically
  if (frameCount % 100 === 0) {
    bgColor = max(5, bgColor - 5);
  }
  
  // Update grid
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let neighbors = countNeighbors(x, y);
      if (grid[x][y] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[x][y] = 0;
          flashCells.push({x, y, age: 0});
        } else {
          nextGrid[x][y] = 1;
        }
      } else {
        if (neighbors === 3) {
          nextGrid[x][y] = 1;
          glowCells.push({x, y, age: 0});
        }
      }
    }
  }
  
  // Swap grids
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
  
  // Draw cells
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid[x][y] === 1) {
        fill(255, 100, 100);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  
  // Draw flashing cells
  for (let i = flashCells.length - 1; i >= 0; i--) {
    let f = flashCells[i];
    f.age++;
    if (f.age > 5) {
      flashCells.splice(i, 1);
    } else {
      fill(255, 255, 0);
      rect(f.x * cellSize, f.y * cellSize, cellSize, cellSize);
    }
  }
  
  // Draw glowing cells
  for (let i = glowCells.length - 1; i >= 0; i--) {
    let g = glowCells[i];
    g.age++;
    if (g.age > 5) {
      glowCells.splice(i, 1);
    } else {
      fill(100, 255, 255, 100 - g.age * 20);
      rect(g.x * cellSize, g.y * cellSize, cellSize, cellSize);
    }
  }
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let nx = (x + i + cols) % cols;
      let ny = (y + j + rows) % rows;
      sum += grid[nx][ny];
    }
  }
  return sum;
}
