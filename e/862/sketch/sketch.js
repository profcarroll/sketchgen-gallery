let grid = [];
let pulseTime = 0;
let pulseDuration = 60;

function setup() {
  createCanvas(800, 600);
  noFill();
  strokeWeight(1);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a dense grid of points
  let gridSize = 20;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x: x, y: y});
    }
  }
}

function draw() {
  background(0);
  
  // Update pulse
  pulseTime = (pulseTime + 1) % (pulseDuration * 2);
  
  let pulseRadius = map(pulseTime, 0, pulseDuration * 2, 0, width * 1.5);
  let pulseAlpha = map(pulseTime, pulseDuration, pulseDuration * 2, 0.3, 0);
  
  // Draw main lattice
  for (let i = 0; i < grid.length; i++) {
    let p = grid[i];
    
    // Base rotation based on position and time
    let rot = (p.x + p.y) * 0.01 + frameCount * 0.005;
    
    // Offset based on sine wave for organic motion
    let offsetX = sin(p.x * 0.02 + frameCount * 0.02) * 5;
    let offsetY = cos(p.y * 0.02 + frameCount * 0.02) * 5;
    
    push();
    translate(p.x + offsetX, p.y + offsetY);
    rotate(rot);
    
    // Draw angular shapes
    stroke((frameCount * 2 + i) % 360, 80, 90, 0.7);
    
    // Triangle pattern
    triangle(-5, -5, 5, -5, 0, 10);
    
    // Additional lines for complexity
    line(-8, 0, 8, 0);
    line(0, -8, 0, 8);
    
    pop();
  }
  
  // Draw pulse effect
  if (pulseTime < pulseDuration) {
    stroke(240, 80, 90, pulseAlpha);
    noFill();
    ellipse(width/2, height/2, pulseRadius * 2);
  }
}
