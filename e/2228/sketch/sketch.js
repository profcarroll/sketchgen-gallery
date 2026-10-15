let grid;
let cellSize = 30;
let numCellsX, numCellsY;
let patterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
  // Calculate grid dimensions
  numCellsX = ceil(width / cellSize);
  numCellsY = ceil(height / cellSize);
  
  // Create the grid structure
  grid = [];
  for (let y = 0; y < numCellsY; y++) {
    grid[y] = [];
    for (let x = 0; x < numCellsX; x++) {
      grid[y][x] = {
        x: x * cellSize,
        y: y * cellSize,
        pattern: random(['crystal', 'cross', 'loop', 'branch', 'interlace'])
      };
    }
  }
  
  // Generate the patterns
  generatePatterns();
}

function draw() {
  background(20, 15, 30);
  
  // Draw the textile pattern
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      let cell = grid[y][x];
      
      push();
      translate(cell.x, cell.y);
      
      // Draw a textile pattern
      drawPattern(cell.pattern);
      
      pop();
    }
  }
  
  // Draw decorative bands
  strokeWeight(3);
  stroke(100, 50, 150); // Deep purple
  noFill();
  rect(0, 0, width, height);
  
  // Inner decorative band
  stroke(200, 100, 150); // Lighter pink
  rect(cellSize, cellSize, width - cellSize * 2, height - cellSize * 2);
}

function generatePatterns() {
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      // Create a symmetric pattern by using coordinates
      let symmetry = (x + y) % 5;
      
      if (symmetry === 0) {
        grid[y][x].pattern = 'crystal';
      } else if (symmetry === 1) {
        grid[y][x].pattern = 'cross';
      } else if (symmetry === 2) {
        grid[y][x].pattern = 'loop';
      } else if (symmetry === 3) {
        grid[y][x].pattern = 'branch';
      } else {
        grid[y][x].pattern = 'interlace';
      }
    }
  }
  
  // Add more complex interweaving by adjusting certain cells
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      if ((x + y) % 4 === 0 && random() > 0.6) {
        grid[y][x].pattern = 'interlace';
      }
    }
  }
}

function drawPattern(patternType) {
  strokeWeight(1);
  
  // Use a palette of jewel tones
  let colors = [
    color(25, 30, 100),   // Deep sapphire
    color(30, 80, 40),    // Emerald green
    color(120, 20, 30),   // Ruby red
    color(60, 40, 90),    // Violet
    color(150, 70, 100),  // Plum
    color(20, 60, 80)     // Ocean blue
  ];
  
  let c = random(colors);
  stroke(c);
  noFill();
  
  switch (patternType) {
    case 'crystal':
      // Draw a geometric crystal shape with rich colors
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = map(i, 0, 6, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.3;
        let y = sin(angle) * cellSize * 0.3;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Inner crystal structure
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = map(i, 0, 6, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.15;
        let y = sin(angle) * cellSize * 0.15;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw connecting lines
      for (let i = 0; i < 6; i++) {
        let angle = map(i, 0, 6, 0, TWO_PI);
        let x1 = cos(angle) * cellSize * 0.3;
        let y1 = sin(angle) * cellSize * 0.3;
        let x2 = cos(angle) * cellSize * 0.15;
        let y2 = sin(angle) * cellSize * 0.15;
        line(x1, y1, x2, y2);
      }
      
      break;
      
    case 'cross':
      // Draw a cross shape with rich color
      line(-cellSize * 0.3, 0, cellSize * 0.3, 0);
      line(0, -cellSize * 0.3, 0, cellSize * 0.3);
      
      // Inner square
      rectMode(CENTER);
      rect(0, 0, cellSize * 0.2, cellSize * 0.2);
      
      break;
      
    case 'loop':
      // Draw a loop with geometric precision
      beginShape();
      for (let i = 0; i < 12; i++) {
        let angle = map(i, 0, 12, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.3;
        let y = sin(angle) * cellSize * 0.3;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Inner loop
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.15;
        let y = sin(angle) * cellSize * 0.15;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      break;
      
    case 'interlace':
      // Draw an interlaced pattern with rich colors
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.25;
        let y = sin(angle) * cellSize * 0.25;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw a smaller cross inside
      line(-cellSize * 0.15, 0, cellSize * 0.15, 0);
      line(0, -cellSize * 0.15, 0, cellSize * 0.15);
      
      break;
      
    case 'branch':
      // Draw a branching pattern with rich colors
      for (let i = 0; i < 4; i++) {
        let angle = map(i, 0, 4, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.3;
        let y = sin(angle) * cellSize * 0.3;
        line(0, 0, x, y);
      }
      
      // Draw smaller branches
      for (let i = 0; i < 4; i++) {
        let angle = map(i, 0, 4, 0, TWO_PI);
        let x1 = cos(angle) * cellSize * 0.3;
        let y1 = sin(angle) * cellSize * 0.3;
        let x2 = cos(angle) * cellSize * 0.15;
        let y2 = sin(angle) * cellSize * 0.15;
        line(x1, y1, x2, y2);
      }
      
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate grid dimensions
  numCellsX = ceil(width / cellSize);
  numCellsY = ceil(height / cellSize);
  
  // Reinitialize the grid
  grid = [];
  for (let y = 0; y < numCellsY; y++) {
    grid[y] = [];
    for (let x = 0; x < numCellsX; x++) {
      grid[y][x] = {
        x: x * cellSize,
        y: y * cellSize,
        pattern: random(['crystal', 'cross', 'loop', 'branch', 'interlace'])
      };
    }
  }
  
  // Regenerate the pattern
  generatePatterns();
}
