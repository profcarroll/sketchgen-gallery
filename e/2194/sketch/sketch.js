let hexagons = [];
let pulseTime = 0;
let grid = [];
let gridSize = 60;
let maxHexagons = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize spatial grid for hexagons
  let cols = ceil(width / gridSize) + 1;
  let rows = ceil(height / gridSize) + 1;
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create hexagonal lattice
  for (let x = -width/2; x < width/2; x += gridSize) {
    for (let y = -height/2; y < height/2; y += gridSize * 0.866) {
      if (random() > 0.3) { // Sparse lattice
        hexagons.push({
          x: x,
          y: y,
          z: 0,
          baseSize: random(15, 25),
          currentSize: random(15, 25),
          age: 0,
          maxAge: random(300, 600),
          isBroken: false,
          pulseOffset: random(TWO_PI)
        });
      }
    }
  }
  
  // Ensure we don't exceed maximum hexagons
  if (hexagons.length > maxHexagons) {
    hexagons = hexagons.slice(0, maxHexagons);
  }
}

function draw() {
  background(10, 5, 20);
  pulseTime += 0.03;
  
  // Clear grid
  let cols = grid.length;
  let rows = grid[0].length;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw hexagons
  for (let i = hexagons.length - 1; i >= 0; i--) {
    let h = hexagons[i];
    
    // Age the hexagon
    h.age++;
    
    // Apply pulse effect
    let pulse = sin(pulseTime + h.pulseOffset) * 0.5 + 0.5;
    h.currentSize = h.baseSize + pulse * 8;
    
    // Random deformation
    let deformation = noise(h.x * 0.01, h.y * 0.01, pulseTime * 0.5) - 0.5;
    h.z = deformation * 20;
    
    // Check for structural failure
    if (h.age > h.maxAge && !h.isBroken) {
      h.isBroken = true;
      // Create a small explosion effect
      let explosion = {
        x: h.x,
        y: h.y,
        z: h.z,
        size: 0,
        maxsize: random(30, 60),
        age: 0,
        maxAge: 30
      };
      // Add to a separate effect array if needed, but here we just let it go
    }
    
    // Update spatial grid
    let gridX = floor((h.x + width/2) / gridSize);
    let gridY = floor((h.y + height/2) / gridSize);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      grid[gridX][gridY].push(h);
    }
    
    // Draw hexagon
    push();
    translate(h.x, h.y, h.z);
    rotateZ(pulseTime * 0.2);
    
    if (!h.isBroken) {
      // Glow effect
      let hue = (pulseTime * 30 + h.x * 0.01 + h.y * 0.01) % 360;
      fill(hue, 80, 90, 200);
      
      // Draw hexagon with current size
      drawHexagon(h.currentSize);
    } else {
      // Crystallize effect
      fill(255, 255, 255, 100);
      drawHexagon(h.currentSize * 0.8);
    }
    
    pop();
    
    // Remove broken hexagons after some time
    if (h.isBroken && h.age > h.maxAge + 60) {
      hexagons.splice(i, 1);
      continue;
    }
  }
  
  // Draw connections between nearby hexagons
  let connectionCount = 0;
  beginShape(LINES);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].length > 0) {
        for (let k = 0; k < grid[i][j].length; k++) {
          let h1 = grid[i][j][k];
          
          // Check neighbors in adjacent cells
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              let ni = i + di;
              let nj = j + dj;
              
              if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
                for (let l = 0; l < grid[ni][nj].length; l++) {
                  let h2 = grid[ni][nj][l];
                  
                  // Calculate distance
                  let dx = h1.x - h2.x;
                  let dy = h1.y - h2.y;
                  let dist = sqrt(dx*dx + dy*dy);
                  
                  if (dist < gridSize * 2 && connectionCount < 500) {
                    stroke(200, 200, 255, 50);
                    strokeWeight(0.5);
                    vertex(h1.x, h1.y, h1.z);
                    vertex(h2.x, h2.y, h2.z);
                    connectionCount++;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  endShape();
  
  // Add new hexagons occasionally
  if (random() < 0.005 && hexagons.length < maxHexagons) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    hexagons.push({
      x: x,
      y: y,
      z: 0,
      baseSize: random(15, 25),
      currentSize: random(15, 25),
      age: 0,
      maxAge: random(300, 600),
      isBroken: false,
      pulseOffset: random(TWO_PI)
    });
  }
}

function drawHexagon(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = size * cos(angle);
    let y = size * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
