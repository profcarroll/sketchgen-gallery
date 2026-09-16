let particles = [];
const numParticles = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(10, 30),
      hue: random(200, 260), // blue range
      alpha: random(0.5, 1),
      trail: [],
      trailLength: 30,
      colorShift: 0,
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  // Subtle fade effect for trails
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  for (let p of particles) {
    // Update position
    p.pos.add(p.vel);
    
    // Wrap around edges
    if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.x > width) p.pos.x = 0;
    if (p.pos.y < 0) p.pos.y = height;
    if (p.pos.y > height) p.pos.y = 0;
    
    // Add to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }
    
    // Pulsing effect
    p.pulse += p.pulseSpeed;
    const pulseSize = sin(p.pulse) * 0.5 + 0.5;
    
    // Color shifting
    p.colorShift = (sin(time * 0.2 + p.pos.x * 0.01) + 1) * 0.5;
    
    // Draw trail
    noFill();
    beginShape();
    for (let i = 0; i < p.trail.length; i++) {
      const alpha = map(i, 0, p.trail.length, 0, p.alpha);
      const size = map(i, 0, p.trail.length, 0, p.size * pulseSize);
      
      stroke(
        (p.hue + 120 * p.colorShift) % 360,
        80,
        90,
        alpha * 0.5
      );
      
      vertex(p.trail[i].x, p.trail[i].y);
    }
    endShape();
    
    // Draw core particle
    const coreHue = (p.hue + 120 * p.colorShift) % 360;
    fill(coreHue, 80, 90, p.alpha);
    noStroke();
    
    const coreSize = p.size * pulseSize;
    ellipse(p.pos.x, p.pos.y, coreSize, coreSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
