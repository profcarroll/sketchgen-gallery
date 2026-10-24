let particles = [];
let centerX, centerY;
let time = 0;
let rhythm = 1;
let pulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Create initial particles in a dense core
  for (let i = 0; i < 800; i++) {
    let angle = random(TWO_PI);
    let dist = random(50);
    particles.push({
      x: centerX + cos(angle) * dist,
      y: centerY + sin(angle) * dist,
      size: random(2, 8),
      speed: random(1, 4),
      angle: angle,
      hue: random(360),
      life: 1,
      maxLife: random(100, 300),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Modulate rhythm with pulse
  let tempo = 0.02 * rhythm;
  time += tempo;
  pulse = sin(time * 5) * 0.5 + 0.5;
  
  // Draw particles with geometric patterns
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle in a spiraling pattern with decay
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Add geometric modulation to angle
    p.angle += sin(time * 0.5 + p.phase) * 0.05;
    
    // Update life with exponential decay
    p.life -= 1 / p.maxLife;
    
    // Apply geometric scaling based on distance and time
    let dx = p.x - centerX;
    let dy = p.y - centerY;
    let distFromCenter = sqrt(dx * dx + dy * dy);
    let scale = 1 - distFromCenter / max(width, height) * 0.8;
    scale = max(0, scale);
    
    // Create crystalline patterns with pulse
    let pattern = sin(time * 2 + p.phase) * 0.5 + 0.5;
    let size = p.size * (0.5 + pattern * 0.5) * scale;
    
    // Use segmented stained-glass colors
    let hue = (p.hue + time * 2) % 360;
    fill(hue, 80, 100, p.life);
    
    // Draw with geometric shapes based on distance from center
    if (distFromCenter < 200) {
      ellipse(p.x, p.y, size);
    } else {
      // Outer particles form geometric structures
      push();
      translate(p.x, p.y);
      rotate(time * 0.3 + distFromCenter * 0.01);
      rect(0, 0, size * 0.8, size * 0.8, 2);
      pop();
    }
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  // Add new particles occasionally to maintain density
  if (random() < 0.1 && particles.length < 1500) {
    for (let i = 0; i < 3; i++) {
      let angle = random(TWO_PI);
      let dist = random(20, 50);
      particles.push({
        x: centerX + cos(angle) * dist,
        y: centerY + sin(angle) * dist,
        size: random(2, 8),
        speed: random(1, 4),
        angle: angle,
        hue: random(360),
        life: 1,
        maxLife: random(100, 300),
        phase: random(TWO_PI)
      });
    }
  }
}

function mousePressed() {
  // Modulate rhythm on click
  if (rhythm > 1.5) {
    rhythm = 0.5;
  } else {
    rhythm = 2.0;
  }
}
