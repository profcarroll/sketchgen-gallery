let particles = [];
let time = 0;
const particleCount = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and properties
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      hue: random(240, 300), // Deep violet to midnight blue
      saturation: random(70, 100),
      brightness: random(50, 90),
      opacity: random(0.1, 0.8),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 20, 10); // Dark midnight blue base

  time += 0.01;

  // Draw nebulous structures using flowing lines
  beginShape();
  noFill();
  stroke(240, 80, 90, 0.05);
  
  for (let i = 0; i < particleCount; i++) {
    const p = particles[i];
    
    // Update position with subtle flow
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Add some noise for organic movement
    p.angle += noise(p.x * 0.01, p.y * 0.01, time) * 0.2 - 0.1;
    
    // Wrap around edges
    if (p.x < 0) p.x = width;
    else if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    else if (p.y > height) p.y = 0;
    
    // Pulsing opacity
    const pulse = sin(time * p.pulseSpeed + p.pulsePhase) * 0.5 + 0.5;
    p.opacity = 0.1 + pulse * 0.7;
    
    // Draw particles as flowing lines
    vertex(p.x, p.y);
  }
  endShape();

  // Draw intense glowing pinpoints in dense cores
  for (let i = 0; i < particleCount; i += 50) {
    const p = particles[i];
    
    // Create a more intense glow effect
    const glowSize = p.size * 3;
    const glowOpacity = p.opacity * 2;
    
    noStroke();
    fill(p.hue, p.saturation, p.brightness + 30, glowOpacity);
    ellipse(p.x, p.y, glowSize, glowSize);
    
    // Add subtle ripple effect
    const rippleSize = p.size * 1.5 + sin(time * 3 + i) * 2;
    fill(p.hue, p.saturation, p.brightness + 10, glowOpacity * 0.5);
    ellipse(p.x, p.y, rippleSize, rippleSize);
  }

  // Add colored reflections that respond to light sources
  for (let i = 0; i < particleCount; i += 100) {
    const p = particles[i];
    
    // Create a subtle reflection pattern based on the glowing pinpoints
    const reflectionHue = (p.hue + 30) % 360;
    fill(reflectionHue, p.saturation - 20, p.brightness + 10, p.opacity * 0.3);
    
    // Draw multiple layers of reflection
    for (let j = 0; j < 3; j++) {
      const offset = j * 5;
      ellipse(p.x + offset, p.y + offset, p.size * 2, p.size * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
