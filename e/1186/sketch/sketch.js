let rings = [];
let centerX, centerY;
let figureEightPhase = 0;

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
  
  // Draw pulsing rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    let pulse = sin(frameCount * ring.speed) * 0.5 + 0.5;
    let radius = ring.radius * (1 + pulse * 0.3);
    
    stroke(255, 215, 0, ring.alpha); // Gold color
    noFill();
    ellipse(x, y, radius * 2, radius * 2);
    
    // Add green glow effect
    stroke(0, 255, 0, ring.alpha * 0.3);
    ellipse(x, y, radius * 2.5, radius * 2.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
