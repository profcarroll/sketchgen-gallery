let particles = [];
let time = 0;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Initialize grid for spatial hashing
  let gridSize = 50;
  let cols = Math.ceil(width / gridSize) + 2;
  let rows = Math.ceil(height / gridSize) + 2;
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }

  // Create particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(0.5, 2),
      speed: random(0.001, 0.005),
      hue: random(0.5, 0.8),
      sat: 0.9,
      bri: 0.8 + random(0.2),
      age: 0
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.05) * 300;
  let camY = cos(time * 0.03) * 200;
  let camZ = cos(time * 0.04) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }

  // Update and draw particles
  beginShape(POINTS);
  for (let p of particles) {
    // Update position with organic movement
    let noiseX = noise(p.x * 0.002, p.y * 0.002, time * 0.01) - 0.5;
    let noiseY = noise(p.x * 0.002 + 1000, p.y * 0.002 + 1000, time * 0.01) - 0.5;
    let noiseZ = noise(p.x * 0.002 + 2000, p.y * 0.002 + 2000, time * 0.01) - 0.5;

    p.x += noiseX * p.speed * 100;
    p.y += noiseY * p.speed * 100;
    p.z += noiseZ * p.speed * 100;

    // Keep within bounds
    if (p.x > width/2) p.x = -width/2;
    if (p.x < -width/2) p.x = width/2;
    if (p.y > height/2) p.y = -height/2;
    if (p.y < -height/2) p.y = height/2;

    // Spatial hashing
    let gridX = Math.floor((p.x + width/2) / 50);
    let gridY = Math.floor((p.y + height/2) / 50);
    if (gridX >= 0 && gridX < grid.length && gridY >= 0 && gridY < grid[0].length) {
      grid[gridX][gridY].push(p);
    }

    // Draw particle with glow effect
    fill(p.hue, p.sat, p.bri);
    noStroke();
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw connections between nearby particles
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let gridX = Math.floor((p1.x + width/2) / 50);
    let gridY = Math.floor((p1.y + height/2) / 50);

    // Check neighbors in the same and adjacent cells
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (gridX + x >= 0 && gridX + x < grid.length && gridY + y >= 0 && gridY + y < grid[0].length) {
          for (let p2 of grid[gridX + x][gridY + y]) {
            let d = dist(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            if (d < 80 && d > 5) {
              stroke(p1.hue, p1.sat, p1.bri * 0.7);
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
