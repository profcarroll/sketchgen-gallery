let particles = [];
const numParticles = 15;
const orbitRadius = 150;
const orbitSpeed = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles in circular orbits
  for (let i = 0; i < numParticles; i++) {
    const angle = map(i, 0, numParticles, 0, TWO_PI);
    const x = width/2 + cos(angle) * orbitRadius;
    const y = height/2 + sin(angle) * orbitRadius;
    
    particles.push({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      hue: map(i, 0, numParticles, 0, 360),
      trail: []
    });
  }
}

function draw() {
  // Semi-transparent background to create fade effect
  background(0, 0, 0, 0.1);
  
  time += orbitSpeed;
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Update position in circular orbit
    const angle = time + map(i, 0, numParticles, 0, TWO_PI);
    p.x = width/2 + cos(angle) * orbitRadius;
    p.y = height/2 + sin(angle) * orbitRadius;
    
    // Add current position to trail
    p.trail.push({x: p.x, y: p.y});
    
    // Limit trail length
    if (p.trail.length > 50) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 80, 90, 0.7);
    strokeWeight(2);
    beginShape();
    for (let j = 0; j < p.trail.length; j++) {
      const point = p.trail[j];
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90, 1);
    ellipse(p.x, p.y, 12, 12);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
