let particles = [];
let grid = [];
let time = 0;
let gridResolution = 20;
let erosionStrength = 0.02;
let depositionStrength = 0.01;
let pointCloud;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize grid for spatial hashing
  let cols = ceil(width / gridResolution) + 1;
  let rows = ceil(height / gridResolution) + 1;
  grid = new Array(cols);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create initial particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      age: 0,
      maxAge: random(200, 500)
    });
  }
  
  // Create point cloud for efficient rendering
  pointCloud = createGraphics(width, height);
  pointCloud.noStroke();
}

function draw() {
  background(5, 10, 25);
  
  time += 0.01;
  
  // Clear grid
  let cols = grid.length;
  let rows = grid[0].length;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Erosion effect - move particles randomly
    let noiseX = noise(p.x * 0.002, p.y * 0.002, time) - 0.5;
    let noiseY = noise(p.x * 0.002, p.y * 0.002, time + 100) - 0.5;
    let noiseZ = noise(p.x * 0.002, p.y * 0.002, time + 200) - 0.5;
    
    p.x += noiseX * erosionStrength * 100;
    p.y += noiseY * erosionStrength * 100;
    p.z += noiseZ * erosionStrength * 100;
    
    // Deposition effect - particles can aggregate
    if (random() < depositionStrength) {
      let dx = random(-5, 5);
      let dy = random(-5, 5);
      p.x += dx;
      p.y += dy;
      p.size *= 1.05;
    }
    
    // Age particle
    p.age++;
    
    // Remove old particles
    if (p.age > p.maxAge) {
      particles.splice(i, 1);
      continue;
    }
    
    // Spatial hashing
    let gridX = floor((p.x + width/2) / gridResolution);
    let gridY = floor((p.y + height/2) / gridResolution);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      grid[gridX][gridY].push(p);
    }
  }
  
  // Draw all particles as a point cloud
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Color shifts based on time and position
    let hue = (time * 20 + p.x * 0.01 + p.y * 0.01) % 360;
    fill(hue, 80, 90, 200);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw connections between nearby particles
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
                  let dz = p1.z - p2.z;
                  let dist = sqrt(dx*dx + dy*dy + dz*dz);
                  
                  if (dist < 30 && connectionCount < 500) {
                    stroke(200, 200, 255, 50);
                    strokeWeight(0.5);
                    vertex(p1.x, p1.y, p1.z);
                    vertex(p2.x, p2.y, p2.z);
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
  
  // Add new particles occasionally
  if (random() < 0.05) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      age: 0,
      maxAge: random(200, 500)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
