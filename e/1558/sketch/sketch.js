let grid = [];
let nextGrid = [];
const cols = 80;
const rows = 60;
const cellSize = 10;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeGrid();
}

function draw() {
  background(5, 5, 15);
  
  // Draw current grid with color transitions
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        // Active cells - warm colors that shift over time
        let hue = (time * 2 + i * 3 + j * 2) % 360;
        fill(hue, 80, 90);
      } else if (grid[i][j] === 2) {
        // Transitioning cells - cool colors
        let hue = (time * 1.5 + i * 2 + j * 3 + 120) % 360;
        fill(hue, 70, 85);
      } else {
        // Dormant cells - dark background
        fill(10);
      }
      noStroke();
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  updateGrid();
  time++;
}

function initializeGrid() {
  grid = [];
  nextGrid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      // More complex initial state
      let rand = Math.random();
      if (rand > 0.88) {
        grid[i][j] = 1;  // Active
      } else if (rand > 0.75) {
        grid[i][j] = 2;  // Transitioning
      } else {
        grid[i][j] = 0;  // Dormant
      }
      nextGrid[i][j] = 0;
    }
  }
}

function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      
      // State transition rules with more complex behavior
      if (grid[i][j] === 1) {  // Active → Dormant or Transition
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0;   // Dormant
        } else {
          nextGrid[i][j] = 2;   // Transitioning
        }
      } else if (grid[i][j] === 2) {  // Transitioning → Active or Dormant
        if (Math.random() > 0.6) {
          nextGrid[i][j] = 1;   // Active
        } else {
          nextGrid[i][j] = 0;   // Dormant
        }
      } else {  // Dormant → Active if exactly 3 neighbors
        if (neighbors === 3) {
          nextGrid[i][j] = 1;   // Active
        } else {
          nextGrid[i][j] = 0;   // Dormant
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
      
      let ix = (x + i + cols) % cols;
      let iy = (y + j + rows) % rows;
      
      if (grid[ix][iy] > 0) {  // Count active or transitioning cells
        count++;
      }
    }
  }
  return count;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeGrid();
}
