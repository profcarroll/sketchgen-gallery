let orbs = [];
const orbCount = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create orbs with random properties
  for (let i = 0; i < orbCount; i++) {
    orbs.push({
      x: random(width),
      y: random(height),
      size: random(3, 8),
      hue: random(360),
      saturation: random(50, 90),
      brightness: random(60, 100),
      speedX: 0,
      speedY: 0,
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI),
      originalSize: random(3, 8),
      trail: []
    });
  }
}

function draw() {
  background(220, 5, 5, 0.05);
  
  // Update and display orbs
  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    
    // Calculate current force from center
    let dx = orb.x - width/2;
    let dy = orb.y - height/2;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
      // Radial force away from center
      let angle = atan2(dy, dx);
      let radialForce = 0.0005 * (1 - distance / max(width, height));
      
      orb.speedX += cos(angle) * radialForce;
      orb.speedY += sin(angle) * radialForce;
    }
    
    // Add some swirling motion
    let swirlForce = 0.0002;
    orb.speedX += -dy * swirlForce;
    orb.speedY += dx * swirlForce;
    
    // Dampen velocity
    orb.speedX *= 0.97;
    orb.speedY *= 0.97;
    
    // Update position
    orb.x += orb.speedX;
    orb.y += orb.speedY;
    
    // Wrap around edges
    if (orb.x < -50) orb.x = width + 50;
    if (orb.x > width + 50) orb.x = -50;
    if (orb.y < -50) orb.y = height + 50;
    if (orb.y > height + 50) orb.y = -50;
    
    // Add current position to trail
    orb.trail.push({x: orb.x, y: orb.y});
    
    // Limit trail length
    if (orb.trail.length > 30) {
      orb.trail.shift();
    }
    
    // Draw the trail
    noFill();
    stroke(orb.hue, orb.saturation, orb.brightness, 0.1);
    strokeWeight(0.5);
    beginShape();
    for (let pos of orb.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Pulsing effect
    let pulse = sin(frameCount * orb.pulseSpeed + orb.pulsePhase) * 0.5 + 0.5;
    let currentSize = orb.originalSize * (1 + pulse * 0.2);
    
    // Draw the orb with glow
    noStroke();
    fill(orb.hue, orb.saturation, orb.brightness, 0.8);
    ellipse(orb.x, orb.y, currentSize);
    
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(orb.hue, orb.saturation, orb.brightness);
    ellipse(orb.x, orb.y, currentSize * 1.5);
    drawingContext.shadowBlur = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
