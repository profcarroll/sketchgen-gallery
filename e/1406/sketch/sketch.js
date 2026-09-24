let grid = [];
let paths = [];
let blockSize = 20;
let rows, cols;
let isClicked = false;
let glowIntensity = 0;
let pulseSpeed = 0.02;
let clickAreaRadius = 50;
let blockedSection = {x: 0, y: 0, width: 0, height: 0};

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = floor(height / blockSize);
  cols = floor(width / blockSize);

  // Create grid structure
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x: x * blockSize,
        y: y * blockSize,
        isBlocked: false
      };
    }
  }

  // Generate potential paths
  generatePaths();
}

function draw() {
  background(10, 10, 20);
  
  // Pulsing glow effect
  glowIntensity = sin(frameCount * pulseSpeed) * 0.3 + 0.7;
  
  // Draw grid
  stroke(100, 150, 255, 80);
  strokeWeight(1);
  noFill();
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!grid[y][x].isBlocked) {
        rect(grid[y][x].x, grid[y][x].y, blockSize, blockSize);
      }
    }
  }
  
  // Draw paths
  strokeWeight(2);
  for (let path of paths) {
    if (path.length > 1) {
      beginShape();
      noFill();
      stroke(255, 200, 100, 100 * glowIntensity);
      
      for (let i = 0; i < path.length; i++) {
        let p = path[i];
        vertex(p.x, p.y);
      }
      endShape();
    }
  }

  // Draw connecting lines from paths to grid points
  strokeWeight(1);
  for (let path of paths) {
    if (path.length > 1) {
      stroke(200, 150, 255, 80 * glowIntensity);
      for (let i = 0; i < path.length - 1; i++) {
        line(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
      }
    }
  }

  // Draw blocked sections if clicked
  if (isClicked) {
    strokeWeight(3);
    fill(255, 100, 100, 150);
    noStroke();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x].isBlocked) {
          rect(grid[y][x].x, grid[y][x].y, blockSize, blockSize);
        }
      }
    }
    
    // Brighten paths when clicked
    strokeWeight(3);
    for (let path of paths) {
      if (path.length > 1 && isPathInBlockedArea(path)) {
        stroke(255, 255, 200, 200);
        beginShape();
        noFill();
        for (let i = 0; i < path.length; i++) {
          let p = path[i];
          vertex(p.x, p.y);
        }
        endShape();
      }
    }
  }

  // Draw click area indicator
  stroke(255, 255, 255, 100);
  noFill();
  ellipse(width/2, height/2, clickAreaRadius * 2, clickAreaRadius * 2);
}

function generatePaths() {
  // Create some random paths
  for (let i = 0; i < 20; i++) {
    let path = [];
    let startX = floor(random(cols)) * blockSize + blockSize/2;
    let startY = floor(random(rows)) * blockSize + blockSize/2;
    
    path.push({x: startX, y: startY});
    
    // Create a path of 5-10 segments
    for (let j = 0; j < floor(random(5, 10)); j++) {
      let lastPoint = path[path.length - 1];
      let nextX = lastPoint.x + random(-blockSize*2, blockSize*2);
      let nextY = lastPoint.y + random(-blockSize*2, blockSize*2);
      
      // Keep within bounds
      nextX = constrain(nextX, 0, width);
      nextY = constrain(nextY, 0, height);
      
      path.push({x: nextX, y: nextY});
    }
    
    paths.push(path);
  }
}

function isPathInBlockedArea(path) {
  for (let point of path) {
    let gridX = floor(point.x / blockSize);
    let gridY = floor(point.y / blockSize);
    
    if (gridY >= 0 && gridY < rows && gridX >= 0 && gridX < cols) {
      if (grid[gridY][gridX].isBlocked) {
        return true;
      }
    }
  }
  return false;
}

function mousePressed() {
  // Only respond to clicks at the center of the canvas
  let centerX = width / 2;
  let centerY = height / 2;
  
  let d = dist(mouseX, mouseY, centerX, centerY);
  if (d < clickAreaRadius) { // Clicked within click area
    isClicked = true;
    
    // Lock in a random section of the puzzle
    let blockRows = floor(random(3, 7));
    let blockCols = floor(random(3, 7));
    let startX = floor(random(cols - blockCols));
    let startY = floor(random(rows - blockRows));
    
    blockedSection = {x: startX, y: startY, width: blockCols, height: blockRows};
    
    for (let y = 0; y < blockRows; y++) {
      for (let x = 0; x < blockCols; x++) {
        if (startY + y < rows && startX + x < cols) {
          grid[startY + y][startX + x].isBlocked = true;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rows = floor(height / blockSize);
  cols = floor(width / blockSize);
}
