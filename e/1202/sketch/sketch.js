let particles = [];
let lattices = [];
let tensionLines = [];
let time = 0;
const numParticles = 150;
const numLattices = 8;
const maxTension = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: p5.Vector.random2D().mult(random(100, width/2 - 100)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(2, 8),
      hue: random(360),
      trail: []
    });
  }
  
  // Initialize lattices
  for (let i = 0; i < numLattices; i++) {
    lattices.push({
      center: p5.Vector.random2D().mult(random(50, width/3)),
      radius: random(50, 150),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      segments: floor(random(6, 12))
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.01;
  
  // Update and display particles
  for (let p of particles) {
    // Move particle
    p.pos.add(p.vel);
    
    // Bounce off hexagon boundary
    let hexRadius = min(width, height) * 0.4;
    let distToCenter = p5.Vector.dist(p.pos, createVector(0, 0));
    if (distToCenter > hexRadius - p.size) {
      let normal = p.pos.copy().normalize();
      p.vel.reflect(normal);
      p.pos = normal.mult(hexRadius - p.size);
    }
    
    // Add to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > 10) {
      p.trail.shift();
    }
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, 0);
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    sphere(p.size);
    pop();
    
    // Draw trail
    if (p.trail.length > 1) {
      beginShape();
      for (let i = 0; i < p.trail.length; i++) {
        let alpha = map(i, 0, p.trail.length - 1, 0, 0.5);
        fill(p.hue, 80, 90, alpha);
        vertex(p.trail[i].x, p.trail[i].y, 0);
      }
      endShape();
    }
  }
  
  // Update and display lattices
  for (let lattice of lattices) {
    lattice.rotation += lattice.speed;
    
    push();
    translate(lattice.center.x, lattice.center.y, 0);
    rotateZ(lattice.rotation);
    
    stroke(200, 50, 90, 0.6);
    noFill();
    
    // Draw lattice segments
    for (let i = 0; i < lattice.segments; i++) {
      let angle = TWO_PI * i / lattice.segments;
      let x1 = cos(angle) * lattice.radius;
      let y1 = sin(angle) * lattice.radius;
      let x2 = cos(angle + PI) * lattice.radius;
      let y2 = sin(angle + PI) * lattice.radius;
      
      line(x1, y1, 0, x2, y2, 0);
    }
    
    // Draw connecting lines between lattice centers
    for (let other of lattices) {
      if (other !== lattice) {
        let dist = p5.Vector.dist(lattice.center, other.center);
        if (dist < maxTension) {
          stroke(200, 50, 90, map(dist, 0, maxTension, 0.8, 0));
          line(
            lattice.center.x, lattice.center.y, 0,
            other.center.x, other.center.y, 0
          );
        }
      }
    }
    
    pop();
  }
  
  // Draw force fields
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let dist = p5.Vector.dist(p1.pos, p2.pos);
      
      if (dist < 100) {
        let force = p5.Vector.sub(p1.pos, p2.pos).normalize().mult(map(dist, 0, 100, 0.5, 0));
        
        stroke(240, 80, 90, map(dist, 0, 100, 0.3, 0));
        line(p1.pos.x, p1.pos.y, 0, p2.pos.x, p2.pos.y, 0);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
