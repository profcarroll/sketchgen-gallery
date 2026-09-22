let grid;
let cellSize = 40;
let numCellsX, numCellsY;

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
        // Initialize with a pattern that will be modified to create knots
        pattern: random(['knot', 'cross', 'loop'])
      };
    }
  }
  
  // Generate the woven knot pattern
  generateWovenPattern();
}

function draw() {
  background(20);
  
  // Draw the woven pattern
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      let cell = grid[y][x];
      
      push();
      translate(cell.x, cell.y);
      
      // Draw a knot or interlink pattern
      drawKnotPattern(cell.pattern);
      
      pop();
    }
  }
}

function generateWovenPattern() {
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      // Create a symmetric pattern by using coordinates
      let symmetry = (x + y) % 4;
      
      if (symmetry === 0) {
        grid[y][x].pattern = 'knot';
      } else if (symmetry === 1) {
        grid[y][x].pattern = 'cross';
      } else if (symmetry === 2) {
        grid[y][x].pattern = 'loop';
      } else {
        grid[y][x].pattern = 'knot';
      }
    }
  }
  
  // Add more complex interweaving by adjusting certain cells
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      if ((x + y) % 3 === 0 && random() > 0.7) {
        grid[y][x].pattern = 'interlace';
      }
    }
  }
}

function drawKnotPattern(patternType) {
  strokeWeight(2);
  
  // Use a palette of rich jewel tones
  let colors = [
    color(139, 0, 0),   // Dark red
    color(0, 100, 0),   // Dark green
    color(0, 0, 139),   // Dark blue
    color(128, 0, 128), // Purple
    color(255, 140, 0)  // Dark orange
  ];
  
  let c = random(colors);
  stroke(c);
  noFill();
  
  switch (patternType) {
    case 'knot':
      // Draw a simple knot shape
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.3;
        let y = sin(angle) * cellSize * 0.3;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Inner loop
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = map(i, 0, 6, 0, TWO_PI);
        let x = cos(angle) * cellSize * 0.15;
        let y = sin(angle) * cellSize * 0.15;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      break;
      
    case 'cross':
      // Draw a cross shape
      line(-cellSize * 0.3, 0, cellSize * 0.3, 0);
      line(0, -cellSize * 0.3, 0, cellSize * 0.3);
      
      // Inner square
      rectMode(CENTER);
      rect(0, 0, cellSize * 0.2, cellSize * 0.2);
      
      break;
      
    case 'loop':
      // Draw a loop
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
      // Draw an interlaced pattern
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
        pattern: random(['knot', 'cross', 'loop'])
      };
    }
  }
  
  // Regenerate the pattern
  generateWovenPattern();
}
