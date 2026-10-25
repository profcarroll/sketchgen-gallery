let particles = [];
const particleCount = 1000;
const connectionDistance = 60;
const gridCellSize = 30;
let grid = [];
let foldTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      vz: random(-0.2, 0.2),
      hue: random(180, 240), // Cool blues and teals
      size: random(1, 2),
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
  
  // Update fold motion
  foldTime += 0.015;
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Add to history for trail
    p.history.push({x: p.x, y: p.y, z: p.z});
    if (p.history.length > 15) {
      p.history.shift();
    }
    
    // Boundary check and wraparound (with depth)
    if (p.x < -width/2) p.x = width/2;
    else if (p.x > width/2) p.x = -width/2;
    if (p.y < -height/2) p.y = height/2;
    else if (p.y > height/2) p.y = -height/2;
    if (p.z < -300) p.z = 300;
    else if (p.z > 300) p.z = -300;
    
    // Update grid cell
    let col = floor((p.x + width/2) / gridCellSize);
    let row = floor((p.y + height/2) / gridCellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(p);
    }
    
    // Apply folding forces - tension builds and causes wrinkling
    let foldForce = sin(foldTime + p.x * 0.004 + p.y * 0.002) * 0.15;
    p.vy += foldForce * 0.03;
    
    // Add some random jostling for realism
    p.vx += random(-0.003, 0.003);
    p.vy += random(-0.003, 0.003);
    p.vz += random(-0.003, 0.003);
    
    // Dampen velocity
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.vz *= 0.97;
  }
  
  // Draw trails and particles in batched shapes
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw connections with color blending
  strokeWeight(0.3);
  beginShape(LINES);
  let connections = 0;
  
  for (let i = 0; i < particles.length && connections < 250; i++) {
    if (connections >= 250) break;
    
    let p1 = particles[i];
    let col = floor((p1.x + width/2) / gridCellSize);
    let row = floor((p1.y + height/2) / gridCellSize);
    
    // Check nearby cells
    for (let dx = -1; dx <= 1 && connections < 250; dx++) {
      if (connections >= 250) break;
      for (let dy = -1; dy <= 1 && connections < 250; dy++) {
        if (connections >= 250) break;
        
        let ncol = col + dx;
        let nrow = row + dy;
        
        if (ncol >= 0 && ncol < cols && nrow >= 0 && nrow < rows) {
          for (let p2 of grid[ncol][nrow]) {
            if (connections >= 250) break;
            
            // Skip same particle
            if (p1 === p2) continue;
            
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dz = p1.z - p2.z;
            let distanceSq = dx * dx + dy * dy + dz * dz;
            let distance = sqrt(distanceSq);
            
            if (distance < connectionDistance && distance > 0) {
              connections++;
              let blend = (p1.hue + p2.hue) / 2;
              stroke(blend, 80, 90, 0.4);
              vertex(p1.x, p1.y, p1.z);
              vertex(p2.x, p2.y, p2.z);
            }
          }
        }
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
