let shapes = [];
let grid = [];
let cols, rows;
let cellSize = 60;
let transitionPhase = 0; // 0: stable, 1: collapse, 2: reorganize
let transitionTimer = 0;
let colorPalette = [
  [40, 40, 40], [80, 80, 80], [120, 120, 120],
  [200, 100, 100], [100, 200, 100], [100, 100, 200]
];
let currentPalette = [];
let targetPalette = [];

class Shape {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 0: square, 1: triangle, 2: hexagon
    this.size = random(20, 40);
    this.angle = random(TWO_PI);
    this.speed = random(0.01, 0.03);
    this.color = color(random(colorPalette));
    this.originalX = x;
    this.originalY = y;
    this.distortion = 0;
    this.targetSize = this.size;
    this.targetAngle = this.angle;
  }

  update() {
    if (transitionPhase === 1) {
      // Collapse phase
      this.distortion += 0.05;
      this.size = lerp(this.size, this.size * random(0.8, 1.2), 0.02);
      this.angle += random(-0.1, 0.1);
    } else if (transitionPhase === 2) {
      // Reorganize phase
      this.distortion = lerp(this.distortion, 0, 0.01);
      this.size = lerp(this.size, this.targetSize, 0.02);
      this.angle = lerp(this.angle, this.targetAngle, 0.02);
    } else {
      // Stable phase
      this.angle += this.speed;
      this.size = lerp(this.size, this.targetSize, 0.01);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + this.distortion * 2);

    noStroke();
    fill(this.color);
    
    if (this.type === 0) {
      // Square
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
    } else if (this.type === 1) {
      // Triangle
      triangle(0, -this.size/2, 
               -this.size/2, this.size/2,
               this.size/2, this.size/2);
    } else {
      // Hexagon
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI * i / 6;
        let x = cos(angle) * this.size/2;
        let y = sin(angle) * this.size/2;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(600, 600);
  cols = width / cellSize;
  rows = height / cellSize;
  
  // Initialize grid
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize + cellSize/2;
      let y = j * cellSize + cellSize/2;
      
      if (random() > 0.3) {
        let type = floor(random(3));
        grid[i][j] = new Shape(x, y, type);
      } else {
        grid[i][j] = null;
      }
    }
  }
  
  // Set initial palette
  currentPalette = [...colorPalette];
  targetPalette = [...colorPalette];
}

function draw() {
  background(20);
  
  if (frameCount > 100 && transitionPhase === 0) {
    transitionPhase = 1;
    transitionTimer = frameCount;
    
    // Set new palette for collapse
    targetPalette = [
      [255, 50, 50], [50, 255, 50], [50, 50, 255],
      [255, 255, 50], [255, 50, 255], [50, 255, 255]
    ];
  } else if (frameCount > transitionTimer + 100 && transitionPhase === 1) {
    transitionPhase = 2;
    
    // Set new palette for reorganization
    targetPalette = [
      [40, 40, 40], [80, 80, 80], [120, 120, 120],
      [200, 100, 100], [100, 200, 100], [100, 100, 200]
    ];
    
    // Reset shapes to new positions and angles
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j]) {
          grid[i][j].targetSize = random(20, 40);
          grid[i][j].targetAngle = random(TWO_PI);
          grid[i][j].originalX = i * cellSize + cellSize/2;
          grid[i][j].originalY = j * cellSize + cellSize/2;
        }
      }
    }
  }
  
  // Animate color transition
  if (transitionPhase === 1 || transitionPhase === 2) {
    for (let i = 0; i < currentPalette.length; i++) {
      currentPalette[i][0] = lerp(currentPalette[i][0], targetPalette[i][0], 0.01);
      currentPalette[i][1] = lerp(currentPalette[i][1], targetPalette[i][1], 0.01);
      currentPalette[i][2] = lerp(currentPalette[i][2], targetPalette[i][2], 0.01);
    }
  } else {
    // Gradually return to initial palette
    for (let i = 0; i < currentPalette.length; i++) {
      currentPalette[i][0] = lerp(currentPalette[i][0], colorPalette[i][0], 0.005);
      currentPalette[i][1] = lerp(currentPalette[i][1], colorPalette[i][1], 0.005);
      currentPalette[i][2] = lerp(currentPalette[i][2], colorPalette[i][2], 0.005);
    }
  }
  
  // Update and display shapes
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j]) {
        grid[i][j].update();
        grid[i][j].color = color(
          currentPalette[floor(random(currentPalette.length))][0],
          currentPalette[floor(random(currentPalette.length))][1],
          currentPalette[floor(random(currentPalette.length))][2]
        );
        grid[i][j].display();
      }
    }
  }
  
  // Occasionally change palette during transition
  if (transitionPhase === 1 && frameCount % 5 === 0) {
    let idx = floor(random(colorPalette.length));
    currentPalette[idx] = [
      random(255),
      random(255),
      random(255)
    ];
  }
  
  // Stop the animation after a while to prevent infinite loop
  if (frameCount > 300) {
    noLoop();
  }
}
