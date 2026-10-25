let grid;
let cellSize = 60;
let numCellsX, numCellsY;
let patterns = [];
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
        depth: random(0.7, 1)
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
      
      drawPattern(cell.type, cell.depth);
      
      pop();
    }
  }
  
  // Draw rhombus border
  strokeWeight(3);
  noFill();
  stroke(120, 80, 100); // Tarnished brass
  
  let borderThickness = 40;
  rect(borderThickness/2, borderThickness/2, width - borderThickness, height - borderThickness);
  
  // Draw stacked rhombus shapes
  for (let i = 0; i < 8; i++) {
    let offset = borderThickness + i * 10;
    let w = width - 2 * offset;
    let h = height - 2 * offset;
    
    push();
    translate(width/2, height/2);
    rotate(time * 0.1 + i * 0.3);
    drawRhombus(w, h);
    pop();
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

function drawRhombus(w, h) {
  beginShape();
  vertex(0, -h/2);
  vertex(w/2, 0);
  vertex(0, h/2);
  vertex(-w/2, 0);
  endShape(CLOSE);
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
        depth: random(0.7, 1)
      };
    }
  }
  
  // Regenerate the patterns
  generatePatterns();
}
