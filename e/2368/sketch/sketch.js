let particles = [];
let connections = [];
let time = 0;
const cellSize = 40;
const maxConnectionsPerParticle = 3;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    particles.push({ x, y, z, vx: 0, vy: 0, vz: 0 });
  }
  
  // Precompute connections with spatial hashing
  let grid = {};
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let gridKey = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
    
    if (!grid[gridKey]) grid[gridKey] = [];
    grid[gridKey].push(i);
  }
  
  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let gridKey = `${Math.floor(p1.x / cellSize)},${Math.floor(p1.y / cellSize)}`;
    
    // Check neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let neighborKey = `${parseInt(gridKey.split(',')[0]) + dx},${parseInt(gridKey.split(',')[1]) + dy}`;
        if (grid[neighborKey]) {
          for (let j of grid[neighborKey]) {
            if (i < j && connections.length < 800) { // Cap connections
              let p2 = particles[j];
              let d = dist(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
              if (d < 100) {
                connections.push({ i, j, d });
              }
            }
          }
        }
      }
    }
  }
  
  noStroke();
}

function draw() {
  background(20, 30, 15); // Deep forest base
  time += 0.005;
  
  // Update and display particles in batched POINTS shape
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply noise-based velocity
    let nx = noise(p.x * 0.002, p.y * 0.002, time) - 0.5;
    let ny = noise(p.y * 0.002, p.z * 0.002, time + 1000) - 0.5;
    let nz = noise(p.x * 0.002, p.z * 0.002, time + 2000) - 0.5;
    
    p.vx += nx * 0.1;
    p.vy += ny * 0.1;
    p.vz += nz * 0.1;
    
    // Dampen velocity
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.vz *= 0.95;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Keep particles within bounds (with wraparound)
    if (p.x > width/2) p.x = -width/2;
    if (p.x < -width/2) p.x = width/2;
    if (p.y > height/2) p.y = -height/2;
    if (p.y < -height/2) p.y = height/2;
    
    // Display particle
    let hue = (time * 15 + p.x * 0.03 + p.y * 0.02) % 360;
    fill(hue, 70, 90, 0.8);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw connections in batched LINES shape
  beginShape(LINES);
  for (let c of connections) {
    let p1 = particles[c.i];
    let p2 = particles[c.j];
    
    let alpha = map(c.d, 0, 100, 0.3, 0);
    stroke(40, 60, 85, alpha); // Earthy tone
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();
  
  // Add subtle fractal-like structure with earth tones
  for (let i = 0; i < 30; i++) {
    let x = noise(i + time * 0.1) * width - width/2;
    let y = noise(i + 100 + time * 0.15) * height - height/2;
    let z = noise(i + 200 + time * 0.05) * 100 - 50;
    
    fill(30, 40, 95, 0.1); // Deep earth tone
    push();
    translate(x, y, z);
    sphere(6 * (noise(i + time * 0.3) * 0.5 + 0.5));
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
