let squares = [];
const rows = 20;
const cols = 20;
const size = 20;
const spacing = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of squares
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      squares.push({
        x: j * spacing - (cols * spacing) / 2 + width / 2,
        y: i * spacing - (rows * spacing) / 2 + height / 2,
        baseSize: size,
        scale: 1,
        opacity: 0.5
      });
    }
  }
}

function draw() {
  background(0, 0, 10);
  
  // Use a consistent time for all squares
  const t = millis() / 2000;
  
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    
    // Breathing motion: scale and opacity cycle together
    const pulse = sin(t + i * 0.1) * 0.5 + 0.5;
    square.scale = 0.8 + pulse * 0.4;
    square.opacity = 0.3 + pulse * 0.4;
    
    push();
    translate(square.x, square.y);
    scale(square.scale);
    
    // Draw pale square
    noStroke();
    fill(200, 50, 90, square.opacity);
    rect(-square.baseSize/2, -square.baseSize/2, square.baseSize, square.baseSize);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
