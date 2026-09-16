let microbes = [];
let connections = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const CONNECTION_RADIUS = 80;
const MAX_CONNECTIONS_PER_FRAME = 300;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize microbes
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    microbes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-50, 50),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.3, 0.3),
      size: random(2, 8),
      hue: random(80, 140), // Sickly green to purple range
      saturation: random(60, 90),
      brightness: random(40, 90),
      age: 0,
      trail: []
    });
  }

  // Initialize grid for spatial hashing
  const cols = Math.ceil(width / GRID_SIZE);
  const rows = Math.ceil(height / GRID_SIZE);
  grid = new Array(cols * rows).fill(null).map(() => []);
}

function draw() {
  background(0, 0, 5); // Dark background with slight tint

  // Update and draw microbes
  updateAndDrawMicrobes();

  // Draw connections between nearby microbes
  drawConnections();
}

function updateAndDrawMicrobes() {
  const time = millis() * 0.001;

  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }

  // Update microbes and add to grid
  for (let i = 0; i < microbes.length; i++) {
    const m = microbes[i];
    
    // Apply movement
    m.x += m.vx;
    m.y += m.vy;
    m.z += m.vz;

    // Bounce off edges
    if (m.x < -width/2 || m.x > width/2) m.vx *= -1;
    if (m.y < -height/2 || m.y > height/2) m.vy *= -1;
    if (m.z < -50 || m.z > 50) m.vz *= -1;

    // Add to grid
    const col = Math.floor((m.x + width/2) / GRID_SIZE);
    const row = Math.floor((m.y + height/2) / GRID_SIZE);
    if (col >= 0 && col < width/GRID_SIZE && row >= 0 && row < height/GRID_SIZE) {
      grid[col + row * (width/GRID_SIZE)].push(i);
    }

    // Update age
    m.age += 0.01;
    
    // Trail effect
    m.trail.push({x: m.x, y: m.y, z: m.z});
    if (m.trail.length > 20) {
      m.trail.shift();
    }
  }

  // Draw microbes
  beginShape(POINTS);
  for (let i = 0; i < microbes.length; i++) {
    const m = microbes[i];
    fill(m.hue, m.saturation, m.brightness, 0.8);
    
    // Draw main particle
    vertex(m.x, m.y, m.z);
    
    // Draw trail
    for (let j = 0; j < m.trail.length; j++) {
      const t = m.trail[j];
      const alpha = map(j, 0, m.trail.length, 0.1, 0.8);
      fill(m.hue, m.saturation, m.brightness, alpha);
      vertex(t.x, t.y, t.z);
    }
  }
  endShape();
}

function drawConnections() {
  // Reset connections array
  connections = [];
  
  // Spatial hashing to find neighbors efficiently
  for (let i = 0; i < microbes.length; i++) {
    const m1 = microbes[i];
    
    // Get grid cell
    const col = Math.floor((m1.x + width/2) / GRID_SIZE);
    const row = Math.floor((m1.y + height/2) / GRID_SIZE);
    
    // Check neighbors in current and adjacent cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nc = col + dx;
        const nr = row + dy;
        
        if (nc >= 0 && nc < width/GRID_SIZE && nr >= 0 && nr < height/GRID_SIZE) {
          const cell = grid[nc + nr * (width/GRID_SIZE)];
          
          for (let j = 0; j < cell.length; j++) {
            const otherIndex = cell[j];
            
            if (otherIndex !== i) {
              const m2 = microbes[otherIndex];
              const dx = m1.x - m2.x;
              const dy = m1.y - m2.y;
              const dz = m1.z - m2.z;
              const distSq = dx*dx + dy*dy + dz*dz;
              
              if (distSq < CONNECTION_RADIUS * CONNECTION_RADIUS) {
                connections.push({m1, m2});
                
                // Cap number of connections to avoid overdraw
                if (connections.length >= MAX_CONNECTIONS_PER_FRAME) break;
              }
            }
          }
          
          if (connections.length >= MAX_CONNECTIONS_PER_FRAME) break;
        }
      }
      
      if (connections.length >= MAX_CONNECTIONS_PER_FRAME) break;
    }
    
    if (connections.length >= MAX_CONNECTIONS_PER_FRAME) break;
  }

  // Draw connections
  stroke(100, 50, 70, 0.4);
  strokeWeight(0.3);
  beginShape(LINES);
  
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    vertex(c.m1.x, c.m1.y, c.m1.z);
    vertex(c.m2.x, c.m2.y, c.m2.z);
  }
  
  endShape();
}
