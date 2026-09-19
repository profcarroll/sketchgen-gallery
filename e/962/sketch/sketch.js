let particles = [];
let lattices = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with smooth globular splines
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(10, 30),
      hue: random(120, 300), // Cool emerald to warm amethyst
      age: 0,
      maxAge: random(100, 300)
    });
  }
  
  // Initialize lattices (crystalline structures)
  for (let i = 0; i < 50; i++) {
    lattices.push({
      pos: createVector(random(width), random(height)),
      size: random(20, 100),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05); // Semi-transparent background for trails
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Boundary check with hexagonal constraint
    if (!isInsideHexagon(p.pos)) {
      p.vel.mult(-1);
    }
    
    // Age and fade
    p.age++;
    if (p.age > p.maxAge) {
      p.age = 0;
      p.pos.set(random(width), random(height));
      p.hue += 20; // Shift color slightly
    }
    
    // Draw globular spline
    noStroke();
    fill(p.hue % 360, 80, 90, 0.7);
    ellipse(p.pos.x, p.pos.y, p.size + sin(time + p.age * 0.1) * 5);
    
    // Draw connecting lines to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      
      if (d < 80) {
        stroke(p.hue % 360, 70, 80, map(d, 0, 80, 0.1, 0.5));
        line(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      }
    }
  }
  
  // Update and display lattices
  for (let i = 0; i < lattices.length; i++) {
    let lattice = lattices[i];
    
    lattice.rotation += lattice.speed;
    
    push();
    translate(lattice.pos.x, lattice.pos.y);
    rotate(lattice.rotation);
    
    // Draw fractal network
    stroke(200, 80, 90, 0.8);
    strokeWeight(1);
    
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI / 6 * j;
      let x1 = cos(angle) * lattice.size * 0.5;
      let y1 = sin(angle) * lattice.size * 0.5;
      let x2 = cos(angle + PI/3) * lattice.size * 0.5;
      let y2 = sin(angle + PI/3) * lattice.size * 0.5;
      
      line(x1, y1, x2, y2);
    }
    
    // Draw shards
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI / 8 * j + time * 0.5;
      let length = lattice.size * 0.7;
      let x1 = cos(angle) * lattice.size * 0.3;
      let y1 = sin(angle) * lattice.size * 0.3;
      let x2 = x1 + cos(angle) * length;
      let y2 = y1 + sin(angle) * length;
      
      stroke(300, 90, 95, 0.8);
      strokeWeight(0.5);
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Apply tension lines from shards to particles
  for (let i = 0; i < lattices.length; i++) {
    let lattice = lattices[i];
    
    for (let j = 0; j < particles.length; j++) {
      let p = particles[j];
      let d = dist(lattice.pos.x, lattice.pos.y, p.pos.x, p.pos.y);
      
      if (d < 150) {
        stroke(300, 80, 90, map(d, 0, 150, 0.2, 0));
        strokeWeight(0.5);
        line(lattice.pos.x, lattice.pos.y, p.pos.x, p.pos.y);
        
        // Apply outward force
        let force = p5.Vector.sub(p.pos, lattice.pos);
        force.normalize();
        force.mult(0.02);
        p.vel.add(force);
      }
    }
  }
}

function isInsideHexagon(pos) {
  let cx = width / 2;
  let cy = height / 2;
  let radius = min(width, height) * 0.45;
  
  // Hexagon vertices
  let hex = [];
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i - PI/6;
    hex.push(createVector(cx + cos(angle) * radius, cy + sin(angle) * radius));
  }
  
  // Check if point is inside polygon
  let inside = false;
  for (let i = 0, j = hex.length - 1; i < hex.length; j = i++) {
    if (((hex[i].y > pos.y) !== (hex[j].y > pos.y)) &&
        (pos.x < (hex[j].x - hex[i].x) * (pos.y - hex[i].y) / (hex[j].y - hex[i].y) + hex[i].x)) {
      inside = !inside;
    }
  }
  
  return inside;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
