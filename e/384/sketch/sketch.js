let grid = [];
let nextGrid = [];
let cols, rows;
let cellSize = 10;
let backgroundPulse = 0;
let glowMap = [];

function setup() {
  createCanvas(1200, 800);
  cols = width / cellSize;
  rows = height / cellSize;
  
  // Initialize grids
  grid = new Array(cols);
  nextGrid = new Array(cols);
  glowMap = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows).fill(0);
    nextGrid[i] = new Array(rows).fill(0);
    glowMap[i] = new Array(rows).fill(0);
  }

  // Seed initial state
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (random() > 0.9) {
        grid[i][j] = 1;
        glowMap[i][j] = 255;
      }
    }
  }
}

function draw() {
  backgroundPulse = (backgroundPulse + 0.02) % TWO_PI;
  let bg = map(sin(backgroundPulse), -1, 1, 30, 60);
  background(bg);

  // Update grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = countNeighbors(i, j);
      let current = grid[i][j];
      
      if (current === 1) {
        // Cell is alive
        if (neighbors < 2 || neighbors > 3) {
          nextGrid[i][j] = 0;
          // Flash when dying
          fill(255, 200, 0);
          noStroke();
          ellipse(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize - 2);
        } else {
          nextGrid[i][j] = 1;
          // Glow residual
          glowMap[i][j] = 255;
        }
      } else {
        // Cell is dead
        if (neighbors === 3) {
          nextGrid[i][j] = 1;
          // Glowing birth
          glowMap[i][j] = 255;
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

  // Draw cells with glow
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let alpha = map(glowMap[i][j], 0, 255, 0, 255);
        fill(255, 255, 255, alpha);
        noStroke();
        ellipse(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize - 2);
      }
      // Decay glow
      if (glowMap[i][j] > 0) {
        glowMap[i][j] -= 5;
      }
    }
  }

  // Draw connections between active cells
  stroke(100, 100, 150, 30);
  noFill();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        for (let di = -2; di <= 2; di++) {
          for (let dj = -2; dj <= 2; dj++) {
            if (di === 0 && dj === 0) continue;
            let ni = i + di;
            let nj = j + dj;
            if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
              if (grid[ni][nj] === 1) {
                line(i * cellSize + cellSize/2, j * cellSize + cellSize/2,
                     ni * cellSize + cellSize/2, nj * cellSize + cellSize/2);
              }
            }
          }
        }
      }
    }
  }
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
