let orbs = [];
const orbCount = 150;
let currents = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create orbs with random properties
  for (let i = 0; i < orbCount; i++) {
    orbs.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      hue: random(360),
      saturation: random(40, 80),
      brightness: random(50, 90),
      speedX: 0,
      speedY: 0,
      pulseSpeed: random(0.01, 0.02),
      pulsePhase: random(TWO_PI),
      originalSize: random(5, 15),
      group: floor(random(5))
    });
  }
  
  // Create currents (spiral fields)
  for (let i = 0; i < 8; i++) {
    currents.push({
      angleOffset: random(TWO_PI),
      speed: random(0.002, 0.005),
      radius: random(100, 300),
      centerX: width / 2,
      centerY: height / 2,
      strength: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(220, 5, 5, 0.05);
  
  // Update and display orbs
  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    
    // Calculate current force from spiral fields
    let fx = 0;
    let fy = 0;
    
    for (let c of currents) {
      let dx = orb.x - c.centerX;
      let dy = orb.y - c.centerY;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < c.radius * 2) {
        // Spiral force
        let angle = atan2(dy, dx);
        let spiralAngle = angle + frameCount * c.speed + c.angleOffset;
        
        // Radial component
        let radialForce = (c.radius - distance) / c.radius * c.strength * 0.1;
        
        // Tangential component (creates spiraling effect)
        let tangentialForce = sin(spiralAngle) * c.strength * 0.05;
        
        fx += cos(spiralAngle) * radialForce + sin(angle) * tangentialForce;
        fy += sin(spiralAngle) * radialForce - cos(angle) * tangentialForce;
      }
    }
    
    // Apply force to velocity
    orb.speedX += fx;
    orb.speedY += fy;
    
    // Dampen velocity
    orb.speedX *= 0.98;
    orb.speedY *= 0.98;
    
    // Update position
    orb.x += orb.speedX;
    orb.y += orb.speedY;
    
    // Wrap around edges
    if (orb.x < -50) orb.x = width + 50;
    if (orb.x > width + 50) orb.x = -50;
    if (orb.y < -50) orb.y = height + 50;
    if (orb.y > height + 50) orb.y = -50;
    
    // Pulsing effect
    let pulse = sin(frameCount * orb.pulseSpeed + orb.pulsePhase) * 0.5 + 0.5;
    let currentSize = orb.originalSize * (1 + pulse * 0.3);
    
    // Draw the orb with glow
    noStroke();
    fill(orb.hue, orb.saturation, orb.brightness, 0.7);
    ellipse(orb.x, orb.y, currentSize);
    
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(orb.hue, orb.saturation, orb.brightness);
    ellipse(orb.x, orb.y, currentSize * 1.2);
    drawingContext.shadowBlur = 0;
  }
  
  // Draw currents as visible spiral fields
  noFill();
  stroke(200, 30, 80, 0.2);
  strokeWeight(1);
  for (let c of currents) {
    beginShape();
    for (let a = 0; a < TWO_PI * 4; a += 0.1) {
      let angle = a + frameCount * c.speed + c.angleOffset;
      let radius = c.radius * (1 - a / (TWO_PI * 4));
      let x = c.centerX + cos(angle) * radius;
      let y = c.centerY + sin(angle) * radius;
      vertex(x, y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
