let particles = [];
let connections = [];
const particleCount = 300;
const connectionDistance = 120;
const hueRange = 60; // cyan to violet range
let time = 0;
let crystalStructures = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);

  // Create crystal structures
  for (let i = 0; i < 8; i++) {
    crystalStructures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(30, 60),
      rotation: random(TWO_PI),
      spin: random(-0.01, 0.01)
    });
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(hueRange),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Update and display crystal structures
  for (let crystal of crystalStructures) {
    crystal.rotation += crystal.spin;
    
    push();
    translate(crystal.x, crystal.y, crystal.z);
    rotateX(crystal.rotation);
    rotateY(crystal.rotation * 0.7);
    rotateZ(crystal.rotation * 1.3);
    
    // Draw crystal structure using multiple shapes
    fill(20, 80, 90); // Dark crystal color
    noStroke();
    
    // Main crystal shape
    push();
    scale(crystal.size / 10);
    sphere(10, 6, 4);
    pop();
    
    // Crystal spikes
    for (let i = 0; i < 8; i++) {
      push();
      rotateZ(i * TWO_PI / 8);
      translate(0, crystal.size * 0.8, 0);
      scale(1, crystal.size * 0.3, 1);
      box(2, 10, 2);
      pop();
    }
    
    pop();
  }

  // Update and display particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Bounce off edges
    if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
    if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
    if (p.z < -300 || p.z > 300) p.vz *= -1;

    // Color modulation with time
    p.hue += sin(time + i * 0.02) * 0.5;
    
    // Vertex
    fill(p.hue, 80, 90);
    noStroke();
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Connections (capped per frame)
  connections = [];
  const maxConnections = 150;
  let count = 0;

  // Spatial hash for efficient connection checking
  const grid = {};
  const cellSize = connectionDistance / 2;
  
  for (let i = 0; i < particles.length && count < maxConnections; i++) {
    let p1 = particles[i];
    let key = `${Math.floor(p1.x / cellSize)},${Math.floor(p1.y / cellSize)}`;
    
    if (!grid[key]) grid[key] = [];
    grid[key].push(i);
  }

  for (let i = 0; i < particles.length && count < maxConnections; i++) {
    let p1 = particles[i];
    let key = `${Math.floor(p1.x / cellSize)},${Math.floor(p1.y / cellSize)}`;
    
    // Check neighbors in current and adjacent cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let neighborKey = `${parseInt(key.split(',')[0]) + dx},${parseInt(key.split(',')[1]) + dy}`;
        
        if (grid[neighborKey]) {
          for (let j of grid[neighborKey]) {
            if (i >= j) continue; // Avoid duplicate connections
            
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dz = p1.z - p2.z;
            let distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < connectionDistance * connectionDistance && count < maxConnections) {
              connections.push({p1, p2});
              count++;
            }
          }
        }
      }
    }
  }

  // Draw connections
  strokeWeight(0.3);
  for (let c of connections) {
    let hue = (c.p1.hue + c.p2.hue) / 2;
    stroke(hue, 70, 80, 60);
    line(c.p1.x, c.p1.y, c.p1.z, c.p2.x, c.p2.y, c.p2.z);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
