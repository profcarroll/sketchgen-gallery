let grid;
let cellSize = 30;
let numCellsX, numCellsY;
let mineralPatterns = [];
let plantShapes = [];

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
        // Initialize with a pattern that will be modified to create mineral structures
        pattern: random(['crystal', 'cross', 'loop', 'branch'])
      };
    }
  }
  
  // Generate the mineral and plant patterns
  generateMineralPattern();
  generatePlantPatterns();
}

function draw() {
  background(245);
  
  // Draw the mineral crystal patterns
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      let cell = grid[y][x];
      
      push();
      translate(cell.x, cell.y);
      
      // Draw a crystal or mineral structure
      drawCrystalPattern(cell.pattern);
      
      pop();
    }
  }
  
  // Draw the plant elements
  for (let i = 0; i < plantShapes.length; i++) {
    let shape = plantShapes[i];
    push();
    translate(shape.x, shape.y);
    strokeWeight(1.5);
    noFill();
    
    // Draw a stylized plant shape
    drawPlantShape(shape.type, shape.size);
    
    pop();
  }
}

function generateMineralPattern() {
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      // Create a symmetric pattern by using coordinates
      let symmetry = (x + y) % 4;
      
      if (symmetry === 0) {
        grid[y][x].pattern = 'crystal';
      } else if (symmetry === 1) {
        grid[y][x].pattern = 'cross';
      } else if (symmetry === 2) {
        grid[y][x].pattern = 'loop';
      } else {
        grid[y][x].pattern = 'branch';
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

function drawCrystalPattern(patternType) {
  strokeWeight(1);
  
  // Use a palette of mineral tones
  let colors = [
    color(255, 255, 255), // White
    color(100, 100, 100), // Gray
    color(80, 80, 80),    // Dark gray
    color(139, 69, 19),   // Brown
    color(173, 216, 230)  // Light blue
  ];
  
  let c = random(colors);
  stroke(c);
  noFill();
  
  switch (patternType) {
    case 'crystal':
      // Draw a geometric crystal shape
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
      // Draw a cross shape
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
      // Draw an interlaced crystal pattern
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
      // Draw a branching crystal structure
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

function generatePlantPatterns() {
  // Generate plant shapes that interweave with the crystal patterns
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let type = random(['leaf', 'stamen', 'petal']);
    let size = random(10, 20);
    
    plantShapes.push({
      x: x,
      y: y,
      type: type,
      size: size
    });
  }
}

function drawPlantShape(type, size) {
  switch (type) {
    case 'leaf':
      // Draw a stylized leaf shape with smooth curves
      beginShape();
      for (let i = 0; i < 12; i++) {
        let angle = map(i, 0, 12, 0, TWO_PI);
        let x = cos(angle) * size * 0.5;
        let y = sin(angle) * size * 0.5;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Inner leaf shape
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * size * 0.2;
        let y = sin(angle) * size * 0.2;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      break;
      
    case 'stamen':
      // Draw a stamen shape
      line(0, -size * 0.5, 0, size * 0.5);
      
      // Draw small circular pollen spots
      for (let i = 0; i < 3; i++) {
        let angle = map(i, 0, 3, 0, TWO_PI);
        let x = cos(angle) * size * 0.3;
        let y = sin(angle) * size * 0.3;
        ellipse(x, y, size * 0.15, size * 0.15);
      }
      
      break;
      
    case 'petal':
      // Draw a petal shape with smooth curves
      beginShape();
      for (let i = 0; i < 12; i++) {
        let angle = map(i, 0, 12, 0, TWO_PI);
        let x = cos(angle) * size * 0.6;
        let y = sin(angle) * size * 0.6;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Inner petal shape
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * size * 0.3;
        let y = sin(angle) * size * 0.3;
        vertex(x, y);
      }
      endShape(CLOSE);
      
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
        pattern: random(['crystal', 'cross', 'loop', 'branch'])
      };
    }
  }
  
  // Regenerate the pattern
  generateMineralPattern();
  generatePlantPatterns();
}
