let particles = [];
let connections = [];
let time = 0;
const numParticles = 200;
const connectionDistance = 150;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.2, 0.8)),
      size: random(2, 8),
      hue: random(180, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.2) * 200;
  let camY = cos(time * 0.3) * 100;
  camera(0, 0, 600 + camY, 0, 0, 0, 0, 1, 0);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Boundary check with wrapping
    if (p.pos.mag() > 500) {
      p.pos.normalize().mult(500);
    }
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    sphere(p.size);
    pop();
    
    // Update connections
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = p.pos.dist(other.pos);
      
      if (d < connectionDistance) {
        connections.push({
          from: p.pos,
          to: other.pos,
          alpha: map(d, 0, connectionDistance, 1, 0),
          hue: (p.hue + other.hue) / 2 + sin(time * 2 + d * 0.01) * 30
        });
      }
    }
  }
  
  // Draw connections
  strokeWeight(1);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    stroke(c.hue, 80, 90, c.alpha * 0.5);
    line(c.from.x, c.from.y, c.from.z, c.to.x, c.to.y, c.to.z);
  }
  
  // Clear connections for next frame
  connections = [];
}
