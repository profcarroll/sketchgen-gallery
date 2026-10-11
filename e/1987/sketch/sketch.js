let rings = [];
let centerX, centerY;
let figureEightPhase = 0;
let pulseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings with varying sizes and colors
  for (let i = 0; i < 15; i++) {
    rings.push({
      radius: 20 + i * 30,
      alpha: 200 - i * 10,
      speed: 0.02 + i * 0.005
    });
  }
  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(0);
  
  // Update center position in figure-eight pattern
  figureEightPhase += 0.01;
  let x = width/2 + cos(figureEightPhase) * (width/4);
  let y = height/2 + sin(figureEightPhase * 2) * (height/4);
  
  // Add pulsing effect to the center
  pulseOffset += 0.05;
  let centerPulse = sin(pulseOffset) * 0.3 + 0.7;
  
  // Draw pulsing rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    let pulse = sin(frameCount * ring.speed + pulseOffset) * 0.5 + 0.5;
    let radius = ring.radius * (1 + pulse * 0.3);
    
    // Gold ring
    stroke(255, 215, 0, ring.alpha); 
    noFill();
    ellipse(x, y, radius * 2, radius * 2);
    
    // Green glow effect
    stroke(0, 255, 0, ring.alpha * 0.3);
    ellipse(x, y, radius * 2.5, radius * 2.5);
    
    // Brighter core
    if (i === 0) {
      stroke(255, 255, 0, 200 * centerPulse);
      noFill();
      ellipse(x, y, radius * 1.2, radius * 1.2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
