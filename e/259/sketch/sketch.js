let grid = [];
let cols, rows;
let cellSize = 20;
let time = 0;

function setup() {
  createCanvas(600, 600);
  cols = width / cellSize;
  rows = height / cellSize;
  noStroke();
  
  // Initialize grid with random states
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        state: Math.random() > 0.7 ? 1 : 0,
        next: 0,
        connections: []
      };
    }
  }
}

function draw() {
  // Gradually darken background
  fill(0, 0, 0, 2);
  rect(0, 0, width, height);
  
  time++;
  
  // Update cells and their connections
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      
      // Apply life-like rules
      let neighbors = countNeighbors(i, j);
      if (cell.state === 1) {
        if (neighbors < 2 || neighbors > 3) {
          cell.next = 0;
        } else {
          cell.next = 1;
        }
      } else {
        if (neighbors === 3) {
          cell.next = 1;
        } else {
          cell.next = 0;
        }
      }
      
      // Update connections
      cell.connections = [];
      for (let di = -2; di <= 2; di++) {
        for (let dj = -2; dj <= 2; dj++) {
          let ni = i + di;
          let nj = j + dj;
          if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
            let neighbor = grid[ni][nj];
            if (neighbor.state === 1 && (di !== 0 || dj !== 0)) {
              cell.connections.push({x: ni, y: nj});
            }
          }
        }
      }
    }
  }
  
  // Apply updates
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].state = grid[i][j].next;
    }
  }
  
  // Draw everything
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      
      // Draw connections
      stroke(255, 100);
      strokeWeight(0.5);
      for (let conn of cell.connections) {
        line(i * cellSize + cellSize/2, j * cellSize + cellSize/2,
             conn.x * cellSize + cellSize/2, conn.y * cellSize + cellSize/2);
      }
      
      // Draw cell
      noStroke();
      if (cell.state === 1) {
        fill(255, 200, 100);
      } else {
        fill(50, 50, 80);
      }
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function countNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      let ni = x + i;
      let nj = y + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
        count += grid[ni][nj].state;
      }
    }
  }
  return count;
}
