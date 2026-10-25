let creatures = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create drifting bioluminescent creatures
  for (let i = 0; i < 8; i++) {
    creatures.push({
      x: random(width),
      y: random(height),
      size: random(40, 120),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      hue: random(180, 260),
      pulsePhase: random(TWO_PI),
      swayPhase: random(TWO_PI)
    });
  }
  
  // Create background particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      hue: random(180, 260),
      brightness: random(30, 70),
      speed: random(0.1, 0.5),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  time += 0.005;
  
  // Update and draw particles
  for (let p of particles) {
    p.phase += 0.02;
    
    let pulse = sin(p.phase) * 0.3 + 0.7;
    let bright = p.brightness * pulse;
    
    fill(p.hue, 100, bright, 0.5);
    ellipse(p.x, p.y, p.size * pulse);
    
    // Slow drift
    p.x += cos(time * p.speed) * 0.2;
    p.y += sin(time * p.speed) * 0.2;
    
    // Wrap around edges
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;
  }
  
  // Update and draw creatures
  for (let c of creatures) {
    c.pulsePhase += 0.02;
    c.swayPhase += 0.01;
    
    let pulse = sin(c.pulsePhase) * 0.3 + 0.7;
    let bright = 80 + pulse * 20;
    
    // Drift
    c.x += cos(c.angle) * c.speed * 0.5;
    c.y += sin(c.angle) * c.speed * 0.5;
    
    // Gentle sway
    c.angle += sin(c.swayPhase) * 0.01;
    
    // Wrap around edges
    if (c.x < -c.size) c.x = width + c.size;
    if (c.x > width + c.size) c.x = -c.size;
    if (c.y < -c.size) c.y = height + c.size;
    if (c.y > height + c.size) c.y = -c.size;
    
    // Draw main body with glow
    fill(c.hue, 100, bright, 0.6);
    drawUndulatingShape(c.x, c.y, c.size, pulse);
    
    // Inner core
    fill(c.hue, 100, 95, 0.8);
    ellipse(c.x, c.y, c.size * 0.3 * pulse);
  }
}

function drawUndulatingShape(x, y, size, pulse) {
  let points = 12;
  beginShape();
  for (let i = 0; i < points; i++) {
    let angle = map(i, 0, points, 0, TWO_PI);
    let radius = size * 0.5 + sin(time + angle * 3) * size * 0.1 * pulse;
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
