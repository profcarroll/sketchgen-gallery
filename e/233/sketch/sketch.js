let squares = [];
const gridSize = 20;
const squareSize = 10;
const spacing = 15;
let waveTime = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of squares
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      squares.push({
        x: x,
        y: y,
        size: squareSize,
        baseSize: squareSize,
        pulse: 0,
        breathing: random(1),
        hue: (x + y) % 360
      });
    }
  }
}

function draw() {
  background(10, 10, 10);
  
  waveTime += 0.05;
  
  for (let i = 0; i < squares.length; i++) {
    let s = squares[i];
    
    // Breathing animation
    s.breathing += 0.02;
    let breath = sin(s.breathing) * 0.3;
    s.size = s.baseSize + breath;
    
    // Apply pulse effect if active
    if (s.pulse > 0) {
      s.pulse -= 0.05;
      s.size = s.baseSize + sin(s.pulse * 10) * 2;
    }
    
    fill(s.hue, 70, 90);
    noStroke();
    rect(s.x - s.size/2, s.y - s.size/2, s.size, s.size, 2);
  }
}

function mousePressed() {
  let mouseX = pmouseX;
  let mouseY = pmouseY;
  
  for (let i = 0; i < squares.length; i++) {
    let s = squares[i];
    let d = dist(mouseX, mouseY, s.x, s.y);
    
    if (d < 100) {
      s.pulse = 1;
    }
  }
}
