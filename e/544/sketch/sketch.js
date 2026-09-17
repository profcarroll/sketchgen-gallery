let particles = [];
let connections = [];
const particleCount = 150;
const connectionDistance = 120;
const gravityStrength = 0.05;
const repulsionStrength = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(8, 20),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(70, 100),
      alpha: random(0.6, 1)
    });
  }
}

function draw() {
  background(0);
  
  // Center of mass for gravity effect
  let center = createVector(0, 0, 0);
  for (let p of particles) {
    center.add(p.pos);
  }
  center.div(particles.length);
  
  // Update and apply forces to particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply gravity towards center of mass
    let force = p5.Vector.sub(center, p.pos);
    force.normalize();
    force.mult(gravityStrength);
    p.vel.add(force);
    
    // Apply repulsion from other particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let other = particles[j];
        let dist = p5.Vector.dist(p.pos, other.pos);
        
        if (dist < 60 && dist > 0) {
          let force = p5.Vector.sub(p.pos, other.pos);
          force.normalize();
          force.mult(repulsionStrength / (dist * dist));
          p.vel.add(force);
        }
      }
    }
    
    // Update position
    p.pos.add(p.vel);
    
    // Slow down velocity
    p.vel.mult(0.95);
  }
  
  // Build connections between close particles
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dist = p5.Vector.dist(particles[i].pos, particles[j].pos);
      
      if (dist < connectionDistance) {
        connections.push({
          p1: particles[i],
          p2: particles[j],
          alpha: map(dist, 0, connectionDistance, 0.8, 0)
        });
        
        // Cap the number of connections to avoid performance issues
        if (connections.length > 1000) break;
      }
    }
    if (connections.length > 1000) break;
  }
  
  // Draw connections
  beginShape(LINES);
  for (let c of connections) {
    stroke(c.p1.hue, c.p1.saturation, c.p1.brightness, c.alpha);
    vertex(c.p1.pos.x, c.p1.pos.y, c.p1.pos.z);
    stroke(c.p2.hue, c.p2.saturation, c.p2.brightness, c.alpha);
    vertex(c.p2.pos.x, c.p2.pos.y, c.p2.pos.z);
  }
  endShape();
  
  // Draw particles
  for (let p of particles) {
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    
    noStroke();
    fill(p.hue, p.saturation, p.brightness, p.alpha);
    
    sphere(p.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
