let particles = [];
let connections = [];
let time = 0;
let particleSystem;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    particles.push({ x, y, z, vx: 0, vy: 0, vz: 0 });
  }
  
  // Precompute connections with spatial hashing for performance
  let grid = {};
  const cellSize = 100;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let key = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
    
    if (!grid[key]) grid[key] = [];
    grid[key].push(i);
  }
  
  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let key = `${Math.floor(p1.x / cellSize)},${Math.floor(p1.y / cellSize)}`;
    
    // Check neighboring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let neighborKey = `${parseInt(key.split(',')[0]) + dx},${parseInt(key.split(',')[1]) + dy}`;
        if (grid[neighborKey]) {
          for (let j of grid[neighborKey]) {
            if (i < j) { // Avoid duplicate connections
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
  particleSystem = createGraphics(width, height);
}

function draw() {
  background(220, 10, 15); // Deep blue-gray base
  time += 0.005;
  
  // Update and display particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply noise-based velocity
    let nx = noise(p.x * 0.002, p.y * 0.002, time) - 0.5;
    let ny = noise(p.y * 0.002, p.z * 0.002, time) - 0.5;
    let nz = noise(p.x * 0.002, p.z * 0.002, time + 1000) - 0.5;
    
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
    let hue = (time * 20 + p.x * 0.1) % 360;
    fill(hue, 50, 80, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw connections
  beginShape(LINES);
  for (let c of connections) {
    let p1 = particles[c.i];
    let p2 = particles[c.j];
    
    let alpha = map(c.d, 0, 100, 0.3, 0);
    stroke(180, 30, 90, alpha);
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();
  
  // Add subtle fractal-like structure
  for (let i = 0; i < 30; i++) {
    let x = noise(i, time * 0.3) * width - width/2;
    let y = noise(i + 100, time * 0.4) * height - height/2;
    let z = noise(i + 200, time * 0.2) * 100 - 50;
    
    fill(180, 10, 95, 0.2);
    push();
    translate(x, y, z);
    sphere(30 * (noise(i + time) * 0.5 + 0.5));
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
