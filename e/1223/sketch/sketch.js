let squares = [];
const rows = 20;
const cols = 20;
const squareSize = 20;
const spacing = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of squares with offset phases
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      squares.push({
        x: j * spacing + spacing / 2,
        y: i * spacing + spacing / 2,
        phase: (i + j) * 0.1, // Offset each square's cycle
        size: squareSize
      });
    }
  }
}

function draw() {
  background(0);
  
  // Draw each square with its own breathing opacity
  for (let i = 0; i < squares.length; i++) {
    const s = squares[i];
    const opacity = map(sin(frameCount * 0.01 + s.phase), -1, 1, 0.1, 0.8);
    
    fill(240, 50, 90, opacity);
    noStroke();
    rect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
