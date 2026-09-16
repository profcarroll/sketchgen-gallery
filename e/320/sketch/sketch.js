let grid = [];
let gridSize = 20;
let squareSize = 12;
let waveRadius = 0;
let waveSpeed = 2;
let waveCenter = { x: 0, y: 0 };
let waveActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize grid of squares
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({
        x: x,
        y: y,
        pulse: random(0, 1),
        pulseSpeed: random(0.005, 0.015),
        baseSize: squareSize
      });
    }
  }
}

function draw() {
  background(10);
  
  // Update and display squares
  for (let i = 0; i < grid.length; i++) {
    let s = grid[i];
    
    // Pulsate the square
    s.pulse += s.pulseSpeed;
    if (s.pulse > 1) s.pulse = 0;
    
    // Calculate size based on pulse
    let size = s.baseSize + sin(s.pulse * TWO_PI) * 2;
    
    // Check if wave is active and affects this square
    if (waveActive) {
      let d = dist(s.x, s.y, waveCenter.x, waveCenter.y);
      if (d < waveRadius && d > waveRadius - 20) {
        // Temporary disruption to pulse
        s.pulseSpeed = random(0.01, 0.03);
        s.pulse += random(-0.2, 0.2);
      } else if (d < waveRadius - 20) {
        // Reset pulse speed after wave passes
        s.pulseSpeed = random(0.005, 0.015);
      }
    }
    
    fill(200 + sin(s.pulse * TWO_PI) * 30);
    noStroke();
    rect(s.x - size/2, s.y - size/2, size, size);
  }
  
  // Update wave
  if (waveActive) {
    waveRadius += waveSpeed;
    if (waveRadius > max(width, height)) {
      waveActive = false;
    }
  }
}

function mousePressed() {
  waveCenter.x = mouseX;
  waveCenter.y = mouseY;
  waveRadius = 0;
  waveActive = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
