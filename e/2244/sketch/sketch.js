let patterns = [];
let gridSize = 30;
let maxPatterns = 800;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize spatial grid for patterns
  let cols = ceil(width / gridSize) + 1;
  let rows = ceil(height / gridSize) + 1;
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create initial patterns
  for (let i = 0; i < maxPatterns; i++) {
    patterns.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      age: 0,
      maxAge: random(300, 600),
      isForming: random() > 0.5,
      colorOffset: random(360),
      pulseOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(25, 15, 35);
  let time = millis() * 0.0005;
  
  // Clear grid
  let cols = grid.length;
  let rows = grid[0].length;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw patterns
  for (let i = patterns.length - 1; i >= 0; i--) {
    let p = patterns[i];
    
    // Age the pattern
    p.age++;
    
    // Apply pulse effect
    let pulse = sin(time + p.pulseOffset) * 0.5 + 0.5;
    let size = p.size + pulse * 3;
    
    // Random drift and deformation
    let dx = noise(p.x * 0.01, p.y * 0.01, time * 0.2) - 0.5;
    let dy = noise(p.x * 0.01, p.y * 0.01, time * 0.2 + 1000) - 0.5;
    p.x += dx * 0.5;
    p.y += dy * 0.5;
    
    // Keep within canvas
    if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
      patterns.splice(i, 1);
      continue;
    }
    
    // Update spatial grid
    let gridX = floor(p.x / gridSize);
    let gridY = floor(p.y / gridSize);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      grid[gridX][gridY].push(p);
    }
    
    // Draw pattern
    push();
    translate(p.x, p.y);
    
    if (p.isForming) {
      // Forming pattern - cardboard-like texture
      let hue = (time * 30 + p.colorOffset) % 360;
      fill(hue, 50, 70, 180);
      
      // Draw corrugated cardboard effect with multiple layers
      for (let j = 0; j < 3; j++) {
        let layerSize = size * (1 - j * 0.2);
        let distortion = noise(p.x * 0.02, p.y * 0.02, time * 0.5 + j * 100) - 0.5;
        let layerOffset = distortion * 3;
        
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.2) {
          let r = layerSize + sin(a * 3 + time * 2 + j) * 2;
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y + layerOffset);
        }
        endShape(CLOSE);
      }
    } else {
      // Dissolving pattern - fibrous material effect
      fill(255, 255, 255, 80);
      
      // Draw fibrous texture with lines
      for (let j = 0; j < 8; j++) {
        let angle = time * 0.5 + j * TWO_PI / 8;
        let length = size * 0.5;
        let x1 = cos(angle) * length;
        let y1 = sin(angle) * length;
        let x2 = cos(angle) * (length + random(5, 10));
        let y2 = sin(angle) * (length + random(5, 10));
        
        stroke(255, 255, 255, 100);
        strokeWeight(0.5);
        line(x1, y1, x2, y2);
      }
    }
    
    pop();
    
    // Remove old patterns
    if (p.age > p.maxAge) {
      patterns.splice(i, 1);
    }
  }
  
  // Draw connections between nearby patterns
  let connectionCount = 0;
  beginShape(LINES);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].length > 0) {
        for (let k = 0; k < grid[i][j].length; k++) {
          let p1 = grid[i][j][k];
          
          // Check neighbors in adjacent cells
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              let ni = i + di;
              let nj = j + dj;
              
              if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
                for (let l = 0; l < grid[ni][nj].length; l++) {
                  let p2 = grid[ni][nj][l];
                  
                  // Calculate distance
                  let dx = p1.x - p2.x;
                  let dy = p1.y - p2.y;
                  let dist = sqrt(dx*dx + dy*dy);
                  
                  if (dist < gridSize * 2.5 && connectionCount < 300) {
                    stroke(200, 200, 255, 60);
                    strokeWeight(0.8);
                    vertex(p1.x, p1.y);
                    vertex(p2.x, p2.y);
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
  
  // Add new patterns occasionally
  if (random() < 0.01 && patterns.length < maxPatterns) {
    patterns.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      age: 0,
      maxAge: random(300, 600),
      isForming: random() > 0.5,
      colorOffset: random(360),
      pulseOffset: random(TWO_PI)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
