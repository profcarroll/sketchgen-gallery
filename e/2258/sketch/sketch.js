let particles = [];
let time = 0;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid for spatial hashing
  let gridSize = 50;
  let cols = ceil(width / gridSize) + 2;
  let rows = ceil(height / gridSize) + 2;
  grid = new Array(cols * rows).fill().map(() => []);
  
  // Create initial particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 4),
      speed: random(0.2, 1),
      angle: random(TWO_PI),
      hue: random(180, 240),
      life: random(0.5, 1)
    });
  }
}

function draw() {
  background(0);
  
  // Update time and create central force
  time += 0.005;
  
  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply central oscillating force (tectonic compression)
    let centerX = sin(time * 0.2) * 150;
    let centerY = cos(time * 0.3) * 150;
    
    let dx = centerX - p.x;
    let dy = centerY - p.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 1) {
      let force = map(distance, 0, width/2, 0.03, 0.002);
      p.x += dx * force;
      p.y += dy * force;
    }
    
    // Update position with oscillating motion
    p.angle += p.speed * 0.02;
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Apply noise-based movement for organic feel
    let noiseFactor = 0.003;
    p.x += noise(p.x * noiseFactor, p.y * noiseFactor, time) * 1.5;
    p.y += noise(p.x * noiseFactor + 1000, p.y * noiseFactor + 1000, time) * 1.5;
    
    // Keep particles within bounds
    if (p.x < -width/2 || p.x > width/2 || p.y < -height/2 || p.y > height/2) {
      p.x = random(-width/2, width/2);
      p.y = random(-height/2, height/2);
    }
    
    // Add to grid
    let col = floor((p.x + width/2) / 50);
    let row = floor((p.y + height/2) / 50);
    if (col >= 0 && col < ceil(width / 50) && 
        row >= 0 && row < ceil(height / 50)) {
      grid[col + row * ceil(width / 50)].push(p);
    }
  }
  
  // Draw particles as points
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(p.hue, 70, 90, p.life);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw connections between nearby particles
  stroke(240, 60, 80, 0.15);
  noFill();
  beginShape(LINES);
  
  let connections = 0;
  for (let i = 0; i < particles.length && connections < 300; i++) {
    let p1 = particles[i];
    
    // Check nearby cells in grid
    let col = floor((p1.x + width/2) / 50);
    let row = floor((p1.y + height/2) / 50);
    
    for (let dx = -1; dx <= 1 && connections < 300; dx++) {
      for (let dy = -1; dy <= 1 && connections < 300; dy++) {
        let cellCol = col + dx;
        let cellRow = row + dy;
        
        if (cellCol >= 0 && cellCol < ceil(width / 50) && 
            cellRow >= 0 && cellRow < ceil(height / 50)) {
          
          let cellIndex = cellCol + cellRow * ceil(width / 50);
          let cell = grid[cellIndex];
          
          for (let j = 0; j < cell.length && connections < 300; j++) {
            let p2 = cell[j];
            
            if (p1 !== p2) {
              let dx = p1.x - p2.x;
              let dy = p1.y - p2.y;
              let distance = sqrt(dx * dx + dy * dy);
              
              if (distance < 80) {
                vertex(p1.x, p1.y, p1.z);
                vertex(p2.x, p2.y, p2.z);
                connections++;
              }
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
