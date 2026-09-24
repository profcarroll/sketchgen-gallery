let grid = [];
let nextGrid = [];
const cols = 60;
const rows = 45;
const cellSize = 12;
let isRunning = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeGrid();
  noLoop();
}

function draw() {
  background(10);
  
  // Draw current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        fill(255, 150, 150);
      } else if (grid[i][j] === 2) {
        fill(100, 255, 255);
      } else {
        fill(30);
      }
      noStroke();
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  if (isRunning) {
    updateGrid();
    redraw(); // Continuously redraw for animation effect
  }
}

function initializeGrid() {
  grid = [];
  nextGrid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      // Random initial state with more dormant cells
      let rand = Math.random();
      if (rand > 0.85) {
        grid[i][j] = 1;  // Active
      } else if (rand > 0.7) {
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
      
      // State transition rules
      if (grid[i][j] === 1) {  // Active → Dormant or Transition
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0;   // Dormant
        } else {
          nextGrid[i][j] = 2;   // Transitioning
        }
      } else if (grid[i][j] === 2) {  // Transitioning → Active or Dormant
        if (Math.random() > 0.5) {
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

function mousePressed() {
  if (!isRunning) {
    isRunning = true;
    loop();
  }
  
  // Set initial conditions at click location
  let mx = Math.floor(mouseX / cellSize);
  let my = Math.floor(mouseY / cellSize);
  
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      if (Math.abs(i) + Math.abs(j) > 4) continue;
      
      let ix = (mx + i + cols) % cols;
      let iy = (my + j + rows) % rows;
      
      // Set to active state
      grid[ix][iy] = 1;
    }
  }
  
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeGrid();
  redraw();
}
