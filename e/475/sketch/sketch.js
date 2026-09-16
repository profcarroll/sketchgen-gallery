let microbes = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 1500;
const CONNECTION_DISTANCE = 80;
const COLOR_PALETTE = [
  [100, 80, 120],   // mauve
  [70, 60, 90],     // darker mauve
  [150, 140, 160],  // gray
  [120, 110, 130],  // lighter gray
  [200, 200, 210]   // silver
];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(RGB);
  noStroke();
  
  // Initialize microbes
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    microbes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 6),
      color: random(COLOR_PALETTE),
      age: 0
    });
  }
  
  // Initialize grid
  for (let i = 0; i < width / GRID_SIZE + 1; i++) {
    grid[i] = [];
    for (let j = 0; j < height / GRID_SIZE + 1; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(20, 15, 30);
  
  time += 0.01;
  
  // Update and display microbes
  for (let i = 0; i < microbes.length; i++) {
    let m = microbes[i];
    
    // Update position with some noise
    m.x += m.vx + sin(time + i * 0.02) * 0.2;
    m.y += m.vy + cos(time + i * 0.02) * 0.2;
    
    // Boundary check and wrap
    if (m.x < 0) m.x = width;
    if (m.x > width) m.x = 0;
    if (m.y < 0) m.y = height;
    if (m.y > height) m.y = 0;
    
    // Update age
    m.age += 0.1;
    
    // Draw particle
    fill(m.color[0], m.color[1], m.color[2], 180);
    ellipse(m.x, m.y, m.size + sin(time + m.age) * 1.5);
    
    // Update grid
    let gridX = floor(m.x / GRID_SIZE);
    let gridY = floor(m.y / GRID_SIZE);
    if (gridX < grid.length && gridY < grid[0].length) {
      grid[gridX][gridY].push(i);
    }
  }
  
  // Draw connections
  for (let i = 0; i < microbes.length; i++) {
    let m1 = microbes[i];
    let gridX = floor(m1.x / GRID_SIZE);
    let gridY = floor(m1.y / GRID_SIZE);
    
    stroke(200, 200, 210, 60);
    strokeWeight(0.5);
    noFill();
    
    // Check neighbors in grid
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        let nx = gridX + x;
        let ny = gridY + y;
        if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
          for (let j of grid[nx][ny]) {
            if (i !== j) {
              let m2 = microbes[j];
              let dx = m1.x - m2.x;
              let dy = m1.y - m2.y;
              let d = sqrt(dx * dx + dy * dy);
              
              if (d < CONNECTION_DISTANCE) {
                line(m1.x, m1.y, m2.x, m2.y);
              }
            }
          }
        }
      }
    }
  }
  
  // Clear grid for next frame
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = [];
    }
  }
}
