let grid = [];
let squareSize = 20;
let spacing = 25;
let cols, rows;
let pulseColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / spacing);
  rows = Math.ceil(height / spacing);
  
  // Initialize grid with positions and breathing states
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        x: i * spacing,
        y: j * spacing,
        breath: random(0, TWO_PI),
        size: squareSize
      };
    }
  }
  
  colorMode(HSB, 360, 100, 100, 1);
  background(20); // near-black background
}

function draw() {
  background(20);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let s = grid[i][j];
      
      // Update breathing animation
      s.breath += 0.02;
      let breathSize = sin(s.breath) * 2;
      
      // Apply color based on position and time
      let hue = (i + j) % 30 + frameCount * 0.5;
      fill(hue, 80, 90);
      
      noStroke();
      rect(s.x, s.y, s.size + breathSize, s.size + breathSize, 3);
    }
  }
}

function mousePressed() {
  // Trigger pulse from center
  let centerX = width / 2;
  let centerY = height / 2;
  pulseColor = color(random(20, 40), 100, 100); // Random warm hue
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let s = grid[i][j];
      
      // Calculate distance to center
      let d = dist(s.x, s.y, centerX, centerY);
      
      // Animate pulse over time
      setTimeout(() => {
        if (d < 500) {
          grid[i][j].pulse = d;
        }
      }, d * 2); // Delay based on distance
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / spacing);
  rows = Math.ceil(height / spacing);
}
