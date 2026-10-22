let particles = [];
const particleCount = 150;
const connectionDistance = 80;
const attractionStrength = 0.03;
const repulsionStrength = 0.3;
const gridCellSize = 60;
let grid = [];
let triplePoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      hue: random(360),
      size: random(2, 4),
      history: []
    });
  }
  
  // Initialize grid
  let cols = ceil(width / gridCellSize);
  let rows = ceil(height / gridCellSize);
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 0, 0, 0.03);
  
  // Clear grid
  let cols = ceil(width / gridCellSize);
  let rows = ceil(height / gridCellSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;
    
    // Add to history for trail
    p.history.push({x: p.x, y: p.y});
    if (p.history.length > 10) {
      p.history.shift();
    }
    
    // Boundary check and wraparound
    if (p.x < 0) p.x = width;
    else if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    else if (p.y > height) p.y = 0;
    
    // Update grid cell
    let col = floor(p.x / gridCellSize);
    let row = floor(p.y / gridCellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(p);
    }
    
    // Draw trail
    stroke(p.hue, 80, 90, 0.5);
    strokeWeight(1);
    beginShape();
    for (let j = 0; j < p.history.length; j++) {
      vertex(p.history[j].x, p.history[j].y);
    }
    endShape();
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90);
    ellipse(p.x, p.y, p.size);
  }
  
  // Connect particles based on proximity using grid
  let connections = [];
  
  for (let i = 0; i < particles.length; i++) {
    if (connections.length >= 300) break;
    
    let p1 = particles[i];
    let col = floor(p1.x / gridCellSize);
    let row = floor(p1.y / gridCellSize);
    
    // Check nearby cells
    for (let dx = -1; dx <= 1; dx++) {
      if (connections.length >= 300) break;
      for (let dy = -1; dy <= 1; dy++) {
        if (connections.length >= 300) break;
        
        let ncol = col + dx;
        let nrow = row + dy;
        
        if (ncol >= 0 && ncol < cols && nrow >= 0 && nrow < rows) {
          for (let p2 of grid[ncol][nrow]) {
            if (connections.length >= 300) break;
            
            // Skip same particle
            if (p1 === p2) continue;
            
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distanceSq = dx * dx + dy * dy;
            let distance = sqrt(distanceSq);
            
            if (distance < connectionDistance && distance > 0) {
              connections.push({
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y,
                hue1: p1.hue,
                hue2: p2.hue
              });
            }
          }
        }
      }
    }
  }
  
  // Draw connections with color blending
  for (let conn of connections) {
    let blend = (conn.hue1 + conn.hue2) / 2;
    stroke(blend, 80, 90, 0.7);
    strokeWeight(0.5);
    line(conn.x1, conn.y1, conn.x2, conn.y2);
  }
  
  // Triple confluence detection and visualization
  triplePoints = [];
  
  for (let i = 0; i < particles.length && triplePoints.length < 20; i++) {
    if (triplePoints.length >= 20) break;
    
    let p1 = particles[i];
    let col = floor(p1.x / gridCellSize);
    let row = floor(p1.y / gridCellSize);
    let nearby = [];
    
    // Check nearby cells
    for (let dx = -1; dx <= 1; dx++) {
      if (triplePoints.length >= 20) break;
      for (let dy = -1; dy <= 1; dy++) {
        if (triplePoints.length >= 20) break;
        
        let ncol = col + dx;
        let nrow = row + dy;
        
        if (ncol >= 0 && ncol < cols && nrow >= 0 && nrow < rows) {
          for (let p2 of grid[ncol][nrow]) {
            if (p1 === p2) continue;
            
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
              nearby.push(p2);
            }
          }
        }
      }
    }
    
    // Look for triple confluence
    if (nearby.length >= 2) {
      for (let k = 0; k < nearby.length - 1 && triplePoints.length < 20; k++) {
        for (let l = k + 1; l < nearby.length && triplePoints.length < 20; l++) {
          let p2 = nearby[k];
          let p3 = nearby[l];
          
          // Check if the three particles form a stable triangle
          let dx1 = p1.x - p2.x;
          let dy1 = p1.y - p2.y;
          let dx2 = p1.x - p3.x;
          let dy2 = p1.y - p3.y;
          
          let dist1 = sqrt(dx1 * dx1 + dy1 * dy1);
          let dist2 = sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (abs(dist1 - dist2) < 5) {
            triplePoints.push({
              x: p1.x,
              y: p1.y,
              hue1: p1.hue,
              hue2: p2.hue,
              hue3: p3.hue
            });
            
            // Draw a small indicator at triple confluence point
            stroke(p1.hue, 80, 90, 0.8);
            strokeWeight(2);
            point(p1.x, p1.y);
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
