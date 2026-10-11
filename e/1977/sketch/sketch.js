let particles = [];
let centerX, centerY;
let zoom = 100;
let zoomTarget = 100;
let zoomSpeed = 0.02;
let time = 0;
let lines = [];
let finalPanelLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Create initial particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: centerX,
      y: centerY,
      size: random(1, 5),
      speed: random(2, 8),
      angle: random(TWO_PI),
      hue: random(360),
      life: 1,
      maxLife: random(50, 150)
    });
  }
  
  // Precompute some lines for the final panel
  for (let i = 0; i < 200; i++) {
    finalPanelLines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      hue: random(360)
    });
  }
}

function draw() {
  background(0);
  
  // Update zoom
  zoom += (zoomTarget - zoom) * zoomSpeed;
  
  // Draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Update life
    p.life -= 1 / p.maxLife;
    
    // Apply zoom effect
    let dx = p.x - centerX;
    let dy = p.y - centerY;
    let distFromCenter = sqrt(dx * dx + dy * dy);
    let scale = zoom / (distFromCenter + zoom);
    
    // Draw particle
    fill(p.hue, 80, 100, p.life);
    ellipse(p.x, p.y, p.size * scale);
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  // Add new particles occasionally
  if (random() < 0.3 && particles.length < 1000) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        size: random(1, 5),
        speed: random(2, 8),
        angle: random(TWO_PI),
        hue: random(360),
        life: 1,
        maxLife: random(50, 150)
      });
    }
  }
  
  // Gradually zoom out
  zoomTarget -= 0.5;
  
  // Draw the final panel when zoom is low enough
  if (zoomTarget < -200) {
    for (let i = 0; i < finalPanelLines.length; i++) {
      let l = finalPanelLines[i];
      stroke(l.hue, 80, 100, 0.7);
      line(l.x1, l.y1, l.x2, l.y2);
    }
    
    // Draw some colored circles to enhance the panel look
    for (let i = 0; i < 30; i++) {
      let x = random(width);
      let y = random(height);
      let size = random(10, 50);
      fill(random(360), 80, 100, 0.5);
      ellipse(x, y, size);
    }
  }
  
  time++;
}
