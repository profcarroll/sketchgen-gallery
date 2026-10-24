let particles = [];
let rubberBands = [];
const numParticles = 1500;
const numBands = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(1, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      opacity: random(0.2, 0.6),
      life: random(100, 500)
    });
  }
  
  // Initialize rubber bands
  for (let i = 0; i < numBands; i++) {
    rubberBands.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      opacity: random(0.1, 0.3)
    });
  }
}

function draw() {
  // Semi-transparent background for motion trails
  background(0, 0, 0, 0.03);
  
  time += 0.5;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Gentle drift with organic movement
    p.x += p.speedX * 0.2;
    p.y += p.speedY * 0.2;
    
    // Slowly change hue over time
    p.hue = (p.hue + sin(time * 0.01 + i * 0.01) * 0.5) % 360;
    
    // Wrap around the canvas
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90, p.opacity);
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Draw rubber bands as translucent lines
  strokeWeight(0.5);
  for (let i = 0; i < rubberBands.length; i++) {
    const band = rubberBands[i];
    stroke(band.x1 % 360, 20, 80, band.opacity);
    line(band.x1, band.y1, band.x2, band.y2);
  }
  
  // Occasionally create new particles for dynamic effect
  if (frameCount % 10 === 0) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(1, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      opacity: random(0.2, 0.6),
      life: random(100, 500)
    });
    
    // Remove oldest particle to keep count stable
    if (particles.length > numParticles) {
      particles.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
