let orbs = [];
const orbCount = 300;
let mouseRadius = 0;
let mouseStrength = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create orbs with random properties
  for (let i = 0; i < orbCount; i++) {
    orbs.push({
      x: random(width),
      y: random(height),
      size: random(5, 30),
      hue: random(360),
      saturation: random(40, 80),
      brightness: random(50, 90),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI),
      originalSize: random(5, 30)
    });
  }
}

function draw() {
  background(220, 5, 5); // Deep space background
  
  // Mouse interaction
  if (mouseRadius > 0) {
    mouseRadius -= 2;
    mouseStrength = max(0, mouseStrength - 0.02);
  }
  
  // Update and display orbs
  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    
    // Apply mouse interaction
    let dx = mouseX - orb.x;
    let dy = mouseY - orb.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < mouseRadius) {
      let force = (mouseRadius - distance) / mouseRadius;
      orb.speedX += dx * force * 0.001 * mouseStrength;
      orb.speedY += dy * force * 0.001 * mouseStrength;
      
      // Brighten orb on mouse proximity
      orb.brightness = min(100, orb.brightness + 20 * force);
    } else {
      // Return to normal brightness
      orb.brightness = lerp(orb.brightness, orb.brightness, 0.95);
    }
    
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

function mousePressed() {
  // Start mouse interaction
  mouseRadius = 150;
  mouseStrength = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
