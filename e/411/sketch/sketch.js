let squares = [];
let waveRadius = 0;
let waveSpeed = 2;
let waveActive = false;
let gridSpacing = 30;
let cols, rows;

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseSize = 12;
    this.pulse = 0;
    this.pulseSpeed = random(0.02, 0.05);
    this.color = color(255, 100, 0);
    this.flash = 0;
    this.flashColor = color(255, 200, 0);
  }

  update() {
    this.pulse += this.pulseSpeed;
    if (this.flash > 0) {
      this.flash -= 0.05;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // Flash effect
    if (this.flash > 0) {
      fill(this.flashColor);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, this.baseSize + this.flash * 10, this.baseSize + this.flash * 10);
    }
    
    // Base pulsing
    let pulseSize = this.baseSize + sin(this.pulse) * 3;
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, pulseSize, pulseSize);
    
    pop();
  }

  checkWaveImpact(x, y, radius) {
    let d = dist(this.x, this.y, x, y);
    if (d < radius && d > radius - 15) {
      this.flash = 1;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / gridSpacing);
  rows = floor(height / gridSpacing);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      squares.push(new Square(x * gridSpacing + gridSpacing/2, y * gridSpacing + gridSpacing/2));
    }
  }
}

function draw() {
  background(10, 10, 25);
  
  // Update and display all squares
  for (let square of squares) {
    square.update();
    square.display();
  }
  
  // Update wave if active
  if (waveActive) {
    waveRadius += waveSpeed;
    if (waveRadius > max(width, height)) {
      waveActive = false;
      waveRadius = 0;
    } else {
      // Check for wave impact on squares
      for (let square of squares) {
        square.checkWaveImpact(mouseX, mouseY, waveRadius);
      }
    }
  }
}

function mousePressed() {
  waveActive = true;
  waveRadius = 0;
}
