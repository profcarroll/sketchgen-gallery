let grid;
let cellSize = 40;
let numCellsX, numCellsY;
let time = 0;

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
        type: random(['floral', 'geometric']),
        depth: random(0.7, 1),
        rotation: random(TWO_PI)
      };
    }
  }
  
  // Generate patterns
  generatePatterns();
  
  // Draw the initial scene
  draw();
}

function draw() {
  background(25, 15, 40);
  
  time += 0.005;
  
  // Draw floral motifs and geometric patterns
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      let cell = grid[y][x];
      
      push();
      translate(cell.x, cell.y);
      rotate(cell.rotation);
      
      drawPattern(cell.type, cell.depth);
      
      pop();
    }
  }
  
  // Draw crescent border
  strokeWeight(2);
  noFill();
  stroke(120, 80, 100); // Tarnished brass
  
  let borderThickness = 30;
  let margin = borderThickness/2;
  
  // Outer border
  rect(margin, margin, width - borderThickness, height - borderThickness);
  
  // Inner border with crescents
  noStroke();
  fill(40, 30, 50); // Deep purple background for crescent area
  
  let crescentSize = 20;
  let spacing = 40;
  
  // Top border
  for (let x = margin; x < width - margin; x += spacing) {
    drawCrescent(x, margin + crescentSize/2, crescentSize);
  }
  
  // Bottom border
  for (let x = margin; x < width - margin; x += spacing) {
    drawCrescent(x, height - margin - crescentSize/2, crescentSize);
  }
  
  // Left border
  for (let y = margin; y < height - margin; y += spacing) {
    drawCrescent(margin + crescentSize/2, y, crescentSize);
  }
  
  // Right border
  for (let y = margin; y < height - margin; y += spacing) {
    drawCrescent(width - margin - crescentSize/2, y, crescentSize);
  }
}

function generatePatterns() {
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      // Create a symmetric pattern by using coordinates
      let symmetry = (x + y) % 6;
      
      if (symmetry === 0 || symmetry === 3) {
        grid[y][x].type = 'floral';
      } else {
        grid[y][x].type = 'geometric';
      }
    }
  }
  
  // Add more complex interweaving by adjusting certain cells
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      if ((x + y) % 7 === 0 && random() > 0.6) {
        grid[y][x].type = 'floral';
      }
    }
  }
  
  // Set rotations for symmetry
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      if ((x + y) % 4 === 0) {
        grid[y][x].rotation = PI/4;
      } else if ((x - y) % 4 === 0) {
        grid[y][x].rotation = -PI/4;
      } else {
        grid[y][x].rotation = 0;
      }
    }
  }
}

function drawPattern(type, depth) {
  strokeWeight(1);
  
  // Use a palette of jewel tones
  let colors = [
    color(30, 50, 80),   // Deep ocean blue
    color(20, 70, 60),   // Emerald green
    color(50, 20, 40),   // Ruby red
    color(60, 30, 100),  // Violet
    color(90, 70, 120),  // Plum
    color(20, 50, 70)    // Ocean blue
  ];
  
  let c = random(colors);
  stroke(c);
  noFill();
  
  switch (type) {
    case 'floral':
      // Draw a stylized floral motif with rich colors
      let pulse = sin(time * 2) * 0.3 + 0.7;
      let size = cellSize * depth * 0.4 * pulse;
      
      // Petals
      for (let i = 0; i < 6; i++) {
        push();
        rotate(i * TWO_PI / 6);
        ellipse(0, -size * 0.8, size * 0.5, size * 1.2);
        pop();
      }
      
      // Center
      ellipse(0, 0, size * 0.3, size * 0.3);
      
      break;
      
    case 'geometric':
      // Draw a geometric pattern with rich colors
      let shapeSize = cellSize * depth * 0.4;
      
      // Square with cross
      rect(-shapeSize, -shapeSize, shapeSize * 2, shapeSize * 2);
      
      line(-shapeSize, 0, shapeSize, 0);
      line(0, -shapeSize, 0, shapeSize);
      
      // Diagonal lines
      line(-shapeSize, -shapeSize, shapeSize, shapeSize);
      line(shapeSize, -shapeSize, -shapeSize, shapeSize);
      
      break;
  }
}

function drawCrescent(x, y, size) {
  push();
  translate(x, y);
  
  // Draw crescent shape
  noStroke();
  fill(40, 30, 50); // Deep purple background
  
  // Outer circle
  ellipse(0, 0, size, size);
  
  // Inner circle (white)
  fill(255);
  ellipse(size/4, 0, size/2, size/2);
  
  pop();
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
        type: random(['floral', 'geometric']),
        depth: random(0.7, 1),
        rotation: random(TWO_PI)
      };
    }
  }
  
  // Regenerate the patterns
  generatePatterns();
}
