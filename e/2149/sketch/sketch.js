let conduits = [];
let particles = [];
let grid = [];
let gridSize = 40;
let mouseInfluence = 0;
let lightPoints = [];
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create factory structure
  for (let i = 0; i < 20; i++) {
    conduits.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(20, 80),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      color: color(random(10, 30), 70, 60, 0.7)
    });
  }
  
  // Create particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-300, 300)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(1, 3),
      color: color(random(180, 240), 80, 90, 0.8)
    });
  }
  
  // Initialize grid for spatial hashing
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
  
  // Create light points for connections
  for (let i = 0; i < 150; i++) {
    lightPoints.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(0.5, 2)
    });
  }
  
  // Precompute connections for performance
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[i].pos.y) < 50) {
        connections.push([i, j]);
        if (connections.length > 2000) break;
      }
    }
    if (connections.length > 2000) break;
  }
}

function draw() {
  background(10, 15, 25);
  ambientLight(30);
  pointLight(255, 255, 255, mouseX - width/2, mouseY - height/2, 0);
  
  // Update grid
  for (let cell of grid) {
    cell.length = 0;
  }
  
  // Update and display particles
  let particleCount = 0;
  for (let p of particles) {
    p.pos.add(p.vel);
    
    // Toroidal wrapping
    if (p.pos.x > width/2) p.pos.x = -width/2;
    if (p.pos.x < -width/2) p.pos.x = width/2;
    if (p.pos.y > height/2) p.pos.y = -height/2;
    if (p.pos.y < -height/2) p.pos.y = height/2;
    
    // Mouse influence
    let d = dist(p.pos.x, p.pos.y, mouseX - width/2, mouseY - height/2);
    if (d < 150) {
      let force = createVector(mouseX - width/2 - p.pos.x, mouseY - height/2 - p.pos.y);
      force.normalize();
      force.mult(0.1);
      p.vel.add(force);
    }
    
    // Apply grid
    let col = floor((p.pos.x + width/2) / gridSize);
    let row = floor((p.pos.y + height/2) / gridSize);
    if (col >= 0 && col < ceil(width / gridSize) && row >= 0 && row < ceil(height / gridSize)) {
      let index = col + row * ceil(width / gridSize);
      if (index >= 0 && index < grid.length) {
        grid[index].push(p);
      }
    }
    
    particleCount++;
    if (particleCount > 500) break; // Safety cap
  }
  
  // Display conduits
  for (let c of conduits) {
    push();
    translate(c.x, c.y, c.z);
    rotateZ(c.angle);
    
    // Draw conduit structure
    stroke(c.color);
    noFill();
    strokeWeight(1.5);
    
    beginShape();
    for (let i = 0; i < c.segments; i++) {
      let angle = map(i, 0, c.segments - 1, 0, TWO_PI * 2);
      let x = sin(angle) * c.size;
      let y = cos(angle) * c.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Pulsing effect
    let pulse = sin(frameCount * 0.02 + c.x * 0.01) * 0.3 + 0.7;
    fill(c.color);
    noStroke();
    sphere(c.size * pulse * 0.3);
    
    pop();
  }
  
  // Connect nearby particles using precomputed connections
  stroke(200, 80, 90, 0.1);
  noFill();
  beginShape(LINES);
  
  for (let i = 0; i < min(connections.length, 500); i++) {
    let [idx1, idx2] = connections[i];
    let p1 = particles[idx1];
    let p2 = particles[idx2];
    vertex(p1.pos.x, p1.pos.y, p1.pos.z);
    vertex(p2.pos.x, p2.pos.y, p2.pos.z);
  }
  endShape();
  
  // Draw light points
  noStroke();
  for (let lp of lightPoints) {
    let d = dist(lp.x, lp.y, mouseX - width/2, mouseY - height/2);
    let intensity = map(d, 0, 300, 1, 0);
    
    fill(180, 90, 95, intensity * 0.5);
    push();
    translate(lp.x, lp.y, lp.z);
    sphere(lp.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
