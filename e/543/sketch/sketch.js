let particles = [];
const particleCount = 1000;
const mouseRadius = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 6),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(80, 100),
      alpha: random(0.5, 1),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  const mouse = { x: mouseX, y: mouseY };
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Mouse interaction
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouseRadius) {
      const force = map(distance, 0, mouseRadius, 2, 0);
      const angle = atan2(dy, dx);
      p.vx += cos(angle) * force * 0.1;
      p.vy += sin(angle) * force * 0.1;
    }
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Slow down over time
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Pulsing effect
    const pulse = sin(p.pulsePhase + frameCount * p.pulseSpeed) * 0.5 + 0.5;
    const size = p.size * (0.8 + pulse * 0.4);
    
    fill(p.hue, p.saturation, p.brightness, p.alpha);
    ellipse(p.x, p.y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
