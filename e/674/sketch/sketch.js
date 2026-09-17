let particles = [];
const numParticles = 500;
const centerX = 400;
const centerY = 300;
const orbitRadius = 150;
const orbitSpeed = 0.005;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      angle: random(TWO_PI),
      speed: random(0.95, 1.05) * orbitSpeed,
      size: random(2, 6),
      hue: random(360),
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail fading

  for (let p of particles) {
    p.angle += p.speed;
    
    const x = centerX + cos(p.angle) * orbitRadius;
    const y = centerY + sin(p.angle) * orbitRadius;
    
    // Add current position to trail
    p.trail.push({x, y, alpha: 1});
    
    // Limit trail length
    if (p.trail.length > 20) {
      p.trail.shift();
    }
    
    // Draw trail
    for (let i = 0; i < p.trail.length; i++) {
      const point = p.trail[i];
      const alpha = point.alpha * (i / p.trail.length);
      fill(p.hue, 100, 100, alpha);
      ellipse(point.x, point.y, p.size);
    }
    
    // Draw particle
    fill(p.hue, 100, 100, 1);
    ellipse(x, y, p.size);
  }
}
