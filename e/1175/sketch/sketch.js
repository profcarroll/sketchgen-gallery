let heartPath = [];
let time = 0;
const strokeW = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Generate heartbeat path
  for (let i = 0; i < width; i += 2) {
    const y = height / 2 + sin(i * 0.05) * 30;
    heartPath.push({x: i, y: y});
  }
}

function draw() {
  background(0);
  
  // Draw glowing heartbeat line
  stroke(255, 255, 0); // Neon yellow
  strokeWeight(strokeW);
  noFill();
  
  // Add glow effect with multiple layers
  for (let i = 0; i < 3; i++) {
    drawingContext.shadowBlur = 10 + i * 5;
    drawingContext.shadowColor = color(255, 255, 0);
    beginShape();
    for (let j = 0; j < heartPath.length; j++) {
      const x = heartPath[j].x + time * 3;
      const y = heartPath[j].y + sin(x * 0.02) * 10;
      vertex(x % width, y);
    }
    endShape();
  }
  
  // Reset shadow
  drawingContext.shadowBlur = 0;
  
  // Update path for animation
  time += 1;
}
