let particles = [];
const numParticles = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(50, 100),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000),
      noiseScale: random(0.002, 0.005)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position using Perlin noise for organic movement
    p.x += noise(p.noiseOffsetX) * p.speedX * 2;
    p.y += noise(p.noiseOffsetY) * p.speedY * 2;
    
    // Increment noise offsets for continuous motion
    p.noiseOffsetX += p.noiseScale;
    p.noiseOffsetY += p.noiseScale;
    
    // Update color properties with continuous shifts
    p.hue = (p.hue + 0.1) % 360;
    p.saturation = map(noise(p.noiseOffsetX * 2), 0, 1, 70, 100);
    p.brightness = map(noise(p.noiseOffsetY * 2), 0, 1, 50, 100);
    
    // Keep particles within canvas bounds
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;
    
    // Draw the glowing particle
    noStroke();
    fill(p.hue, p.saturation, p.brightness, 0.3);
    drawGlowingShape(p.x, p.y, p.size);
  }
}

function drawGlowingShape(x, y, size) {
  // Create a soft, organic shape using multiple ellipses
  for (let i = 0; i < 5; i++) {
    let s = size * (1 - i * 0.2);
    let alpha = map(i, 0, 4, 0.3, 0.05);
    fill(0, 0, 100, alpha);
    ellipse(x + random(-s/4, s/4), y + random(-s/4, s/4), s, s);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
