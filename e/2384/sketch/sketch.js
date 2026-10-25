let grid;
let cellSize = 40;
let numCellsX, numCellsY;
let structures = [];
let bioluminescentLines = [];
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
        type: random(['scaffold', 'column', 'beam', 'arch']),
        depth: random(0.3, 1)
      };
    }
  }
  
  // Generate scaffold structures
  generateStructures();
  
  // Create bioluminescent lines
  for (let i = 0; i < 200; i++) {
    bioluminescentLines.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.02, 0.05),
      opacity: random(100, 200),
      hue: random(180, 270), // Blue to violet hues
      phase: random(TWO_PI),
      segments: floor(random(3, 8)),
      angle: random(TWO_PI)
    });
  }
  
  // Draw the initial scene
  draw();
}

function draw() {
  background(15, 10, 30);
  
  time += 0.01;
  
  // Draw scaffold structures
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      let cell = grid[y][x];
      
      push();
      translate(cell.x, cell.y);
      
      drawStructure(cell.type, cell.depth);
      
      pop();
    }
  }
  
  // Draw bioluminescent lines
  for (let line of bioluminescentLines) {
    let pulse = sin(time + line.phase) * 0.5 + 0.5;
    let alpha = line.opacity * pulse;
    
    stroke(line.hue, 80, 70, alpha);
    noFill();
    strokeWeight(1);
    
    beginShape();
    for (let i = 0; i < line.segments; i++) {
      let angle = line.angle + map(i, 0, line.segments, 0, TWO_PI);
      let x = cos(angle) * line.size;
      let y = sin(angle) * line.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Animate the lines
    line.angle += line.speed;
  }
  
  // Draw decorative elements
  strokeWeight(1);
  stroke(100, 50, 150); // Deep purple
  noFill();
  rect(0, 0, width, height);
  
  stroke(200, 100, 150); // Lighter pink
  rect(cellSize/2, cellSize/2, width - cellSize, height - cellSize);
}

function generateStructures() {
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      // Create a symmetric structure by using coordinates
      let symmetry = (x + y) % 4;
      
      if (symmetry === 0) {
        grid[y][x].type = 'scaffold';
      } else if (symmetry === 1) {
        grid[y][x].type = 'column';
      } else if (symmetry === 2) {
        grid[y][x].type = 'beam';
      } else {
        grid[y][x].type = 'arch';
      }
    }
  }
  
  // Add more complex interweaving by adjusting certain cells
  for (let y = 0; y < numCellsY; y++) {
    for (let x = 0; x < numCellsX; x++) {
      if ((x + y) % 5 === 0 && random() > 0.7) {
        grid[y][x].type = 'arch';
      }
    }
  }
}

function drawStructure(type, depth) {
  strokeWeight(1);
  
  // Use a palette of mineral tones
  let colors = [
    color(30, 40, 80),   // Deep ocean blue
    color(20, 60, 50),   // Emerald green
    color(40, 20, 30),   // Ruby red
    color(50, 30, 90),   // Violet
    color(80, 60, 100),  // Plum
    color(20, 40, 60)    // Ocean blue
  ];
  
  let c = random(colors);
  stroke(c);
  noFill();
  
  switch (type) {
    case 'scaffold':
      // Draw a scaffold structure with rich colors
      rect(-cellSize * depth * 0.5, -cellSize * depth * 0.5, cellSize * depth, cellSize * depth);
      
      // Add connecting beams
      line(-cellSize * depth * 0.5, 0, cellSize * depth * 0.5, 0);
      line(0, -cellSize * depth * 0.5, 0, cellSize * depth * 0.5);
      
      break;
      
    case 'column':
      // Draw a column structure with rich colors
      rect(-cellSize * depth * 0.3, -cellSize * depth * 0.5, cellSize * depth * 0.6, cellSize * depth);
      
      // Add decorative top
      ellipse(0, -cellSize * depth * 0.5, cellSize * depth * 0.4, cellSize * depth * 0.4);
      
      break;
      
    case 'beam':
      // Draw a beam structure with rich colors
      rect(-cellSize * depth * 0.5, -cellSize * depth * 0.2, cellSize * depth, cellSize * depth * 0.4);
      
      // Add decorative ends
      ellipse(-cellSize * depth * 0.5, 0, cellSize * depth * 0.3, cellSize * depth * 0.3);
      ellipse(cellSize * depth * 0.5, 0, cellSize * depth * 0.3, cellSize * depth * 0.3);
      
      break;
      
    case 'arch':
      // Draw an arch structure with rich colors
      beginShape();
      for (let i = 0; i < 12; i++) {
        let angle = map(i, 0, 12, PI, TWO_PI);
        let x = cos(angle) * cellSize * depth * 0.5;
        let y = sin(angle) * cellSize * depth * 0.3;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Add decorative supports
      line(-cellSize * depth * 0.5, 0, -cellSize * depth * 0.5, -cellSize * depth * 0.3);
      line(cellSize * depth * 0.5, 0, cellSize * depth * 0.5, -cellSize * depth * 0.3);
      
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
        type: random(['scaffold', 'column', 'beam', 'arch']),
        depth: random(0.3, 1)
      };
    }
  }
  
  // Regenerate the structures
  generateStructures();
}
