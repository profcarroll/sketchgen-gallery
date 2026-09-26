let orbs = [];
const orbCount = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create orbs with random properties
  for (let i = 0; i < orbCount; i++) {
    orbs.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      hue: random(360),
      saturation: random(40, 80),
      brightness: random(50, 90),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      pulseSpeed: random(0.01, 0.02),
      pulsePhase: random(TWO_PI),
      originalSize: random(5, 20),
      group: floor(random(5)) // Group for cohesion
    });
  }
}

function draw() {
  background(220, 5, 5); // Deep space background
  
  // Update and display orbs
  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    
    // Group-based movement cohesion
    for (let j = 0; j < orbs.length; j++) {
      if (i !== j && orbs[j].group === orb.group) {
        let dx = orbs[j].x - orb.x;
        let dy = orbs[j].y - orb.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          // Move towards group center
          orb.speedX += dx * 0.0001;
          orb.speedY += dy * 0.0001;
        }
      }
    }
    
    // Apply movement and wrap around edges
    orb.x += orb.speedX;
    orb.y += orb.speedY;
    
    if (orb.x < -50) orb.x = width + 50;
    if (orb.x > width + 50) orb.x = -50;
    if (orb.y < -50) orb.y = height + 50;
    if (orb.y > height + 50) orb.y = -50;
    
    // Pulsing effect
    let pulse = sin(frameCount * orb.pulseSpeed + orb.pulsePhase) * 0.5 + 0.5;
    let currentSize = orb.originalSize * (1 + pulse * 0.3);
    
    // Draw the orb
    noStroke();
    fill(orb.hue, orb.saturation, orb.brightness, 0.7);
    ellipse(orb.x, orb.y, currentSize);
    
    // Add glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(orb.hue, orb.saturation, orb.brightness);
    ellipse(orb.x, orb.y, currentSize * 1.2);
    drawingContext.shadowBlur = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
