let grid = [];
let cellSize = 20;
let cols, rows;
let pulsePhase = 0;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalColor = color(100, 150, 200);
    this.currentColor = this.originalColor;
    this.pulseOffset = random(TWO_PI);
    this.shadow = null;
    this.shadowTime = 0;
  }

  update() {
    // Base pulsation
    let pulse = sin(pulsePhase + this.pulseOffset) * 0.3 + 0.7;
    let targetColor = lerpColor(this.originalColor, color(255), pulse);
    
    if (this.shadow) {
      // Apply shadow effect
      let shadowFactor = map(this.shadowTime, 0, 100, 0, 1, true);
      this.currentColor = lerpColor(targetColor, this.shadow, shadowFactor);
      this.shadowTime--;
    } else {
      this.currentColor = targetColor;
    }
  }

  display() {
    fill(this.currentColor);
    stroke(255, 100);
    rect(this.x, this.y, cellSize, cellSize);
  }

  addShadow(color) {
    this.shadow = color;
    this.shadowTime = 100;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);

  for (let j = 0; j < rows; j++) {
    grid[j] = [];
    for (let i = 0; i < cols; i++) {
      let x = i * cellSize;
      let y = j * cellSize;
      grid[j][i] = new Cell(x, y);
    }
  }

  frameRate(30);
}

function draw() {
  background(20);
  pulsePhase += 0.05;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid[j][i].update();
      grid[j][i].display();
    }
  }
}

function mousePressed() {
  let col = floor(mouseX / cellSize);
  let row = floor(mouseY / cellSize);

  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    // Create wave effect
    let waveColor = color(255, 100, 100, 150);
    let maxRadius = max(cols, rows) * cellSize;
    
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let distance = dist(col, row, i, j) * cellSize;
        if (distance < maxRadius && distance > maxRadius - 50) {
          grid[j][i].addShadow(waveColor);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
}
