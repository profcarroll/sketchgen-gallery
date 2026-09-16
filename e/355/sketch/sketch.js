let grid = [];
let cellSize = 20;
let cols, rows;
let pulseRadius = 0;
let pulseSpeed = 2;
let pulseCenter = { x: 0, y: 0 };
let pulses = [];

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseSize = cellSize;
    this.pulseOffset = random(TWO_PI);
    this.pulseSpeed = random(0.02, 0.05);
    this.isAffected = false;
    this.affectedTime = 0;
  }

  update() {
    if (this.isAffected) {
      this.affectedTime++;
      if (this.affectedTime > 100) { // Reset after some time
        this.isAffected = false;
        this.affectedTime = 0;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    let size = this.baseSize;
    if (this.isAffected) {
      size += sin(this.affectedTime * 0.2) * 5;
    } else {
      size += sin(millis() * this.pulseSpeed + this.pulseOffset) * 3;
    }
    
    noStroke();
    fill(255, 100);
    rectMode(CENTER);
    rect(0, 0, size, size);
    pop();
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(RGB);
  
  cols = width / cellSize;
  rows = height / cellSize;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(new Cell(x * cellSize + cellSize/2, y * cellSize + cellSize/2));
    }
  }
}

function draw() {
  background(10);
  
  // Update and display cells
  for (let cell of grid) {
    cell.update();
    cell.display();
  }
  
  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let pulse = pulses[i];
    pulse.radius += pulseSpeed;
    
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    ellipse(pulse.x, pulse.y, pulse.radius * 2);
    
    // Check for affected cells
    for (let cell of grid) {
      let d = dist(cell.x, cell.y, pulse.x, pulse.y);
      if (d < pulse.radius && d > pulse.radius - 5) {
        cell.isAffected = true;
        cell.affectedTime = 0;
      }
    }
    
    // Remove pulse if it's too big
    if (pulse.radius > max(width, height)) {
      pulses.splice(i, 1);
    }
  }
}

function mousePressed() {
  pulses.push({
    x: mouseX,
    y: mouseY,
    radius: 0
  });
}
