let particles = [];
let connections = [];
let time = 0;
let grid = [];

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.1, 0.5));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 200), 255, 200);
    this.pulse = random(TWO_PI);
  }

  update() {
    this.pos.add(this.vel);
    this.pulse += 0.05;
    
    // Bounce off boundaries
    if (this.pos.x > 300 || this.pos.x < -300) this.vel.x *= -1;
    if (this.pos.y > 300 || this.pos.y < -300) this.vel.y *= -1;
    if (this.pos.z > 300 || this.pos.z < -300) this.vel.z *= -1;
    
    // Slowly drift
    this.vel.mult(0.99);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size + sin(this.pulse) * 2);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  
  // Create particles
  for (let i = 0; i < 300; i++) {
    let x = random(-300, 300);
    let y = random(-300, 300);
    let z = random(-300, 300);
    particles.push(new Particle(x, y, z));
  }
  
  // Initialize grid for spatial hashing
  for (let i = 0; i < 20; i++) {
    grid[i] = [];
    for (let j = 0; j < 20; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(10, 5, 20);
  
  // Camera movement
  time += 0.003;
  let camX = sin(time * 0.3) * 500;
  let camY = cos(time * 0.2) * 200;
  let camZ = cos(time * 0.4) * 500;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Spatial hashing for connections
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      grid[i][j] = [];
    }
  }
  
  for (let p of particles) {
    let gridX = floor((p.pos.x + 300) / 30);
    let gridY = floor((p.pos.y + 300) / 30);
    if (gridX >= 0 && gridX < 20 && gridY >= 0 && gridY < 20) {
      grid[gridX][gridY].push(p);
    }
  }
  
  // Draw connections
  beginShape(LINES);
  stroke(100, 150, 255, 80);
  strokeWeight(0.5);
  
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (grid[i][j].length > 0) {
        let neighbors = [];
        
        // Check adjacent cells
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            let ni = i + di;
            let nj = j + dj;
            if (ni >= 0 && ni < 20 && nj >= 0 && nj < 20) {
              neighbors.push(...grid[ni][nj]);
            }
          }
        }
        
        // Connect to nearby particles
        for (let p of grid[i][j]) {
          for (let other of neighbors) {
            let d = p.pos.dist(other.pos);
            if (d < 100 && d > 5) {
              vertex(p.pos.x, p.pos.y, p.pos.z);
              vertex(other.pos.x, other.pos.y, other.pos.z);
            }
          }
        }
      }
    }
  }
  
  endShape();
  
  // Add some structural molecules
  drawMolecule(0, 0, 0, 150, 8);
  drawMolecule(200, -150, 100, 100, 6);
  drawMolecule(-150, 200, -100, 120, 5);
}

function drawMolecule(x, y, z, size, numAtoms) {
  push();
  translate(x, y, z);
  
  let atoms = [];
  
  // Create a ring structure
  for (let i = 0; i < numAtoms; i++) {
    let angle = TWO_PI * i / numAtoms;
    let px = cos(angle) * size;
    let py = sin(angle) * size;
    let pz = sin(time * 0.5 + i) * 20;
    
    atoms.push(createVector(px, py, pz));
    
    // Draw atom
    push();
    translate(px, py, pz);
    noStroke();
    fill(200, 255, 255);
    sphere(6 + sin(time + i) * 2);
    pop();
  }
  
  // Draw bonds
  beginShape(LINES);
  stroke(180, 200, 255, 150);
  strokeWeight(1.5);
  
  for (let i = 0; i < atoms.length; i++) {
    let a1 = atoms[i];
    let a2 = atoms[(i + 1) % atoms.length];
    
    vertex(a1.x, a1.y, a1.z);
    vertex(a2.x, a2.y, a2.z);
  }
  
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
