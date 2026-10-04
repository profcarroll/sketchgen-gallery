let particles = [];
const numParticles = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(150, 350);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    
    particles.push({
      pos: createVector(x, y, 0),
      vel: createVector(0, 0, 0),
      acc: createVector(0, 0, 0),
      color: color(random(150, 255), random(150, 255), random(200, 255), 200),
      trail: [],
      trailLength: 60,
      orbitRadius: radius,
      orbitSpeed: random(0.001, 0.003),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 20);
  
  time += 0.01;
  
  beginShape(POINTS);
  for (let p of particles) {
    // Update orbital motion
    const orbitX = cos(p.orbitSpeed * time + p.phase) * p.orbitRadius;
    const orbitY = sin(p.orbitSpeed * time + p.phase) * p.orbitRadius;
    
    // Add gentle perturbations for complex paths
    const perturbationX = sin(time * 0.5 + p.pos.x * 0.01) * 2;
    const perturbationY = cos(time * 0.7 + p.pos.y * 0.01) * 2;
    
    p.vel.x = orbitX - p.pos.x + perturbationX;
    p.vel.y = orbitY - p.pos.y + perturbationY;
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Add to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }
    
    // Draw trail points with pulsing brightness
    for (let i = 0; i < p.trail.length; i++) {
      const pos = p.trail[i];
      const alpha = map(i, 0, p.trail.length, 0, 180);
      const pulse = sin(time * 3 + i * 0.2) * 40 + 100;
      
      stroke(red(p.color), green(p.color), blue(p.color), alpha * pulse / 100);
      vertex(pos.x, pos.y, pos.z);
    }
  }
  endShape();
  
  // Draw particles
  noStroke();
  for (let p of particles) {
    fill(p.color);
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    sphere(2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}
