let filaments = [];
let grid = [];
const GRID_SIZE = 20;
const SUBSTRATE_DEPTH = 100;
const MAX_FILAMENTS = 1500;
const GROWTH_RATE = 0.02;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid for spatial hashing
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }

  // Create initial filaments
  for (let i = 0; i < 50; i++) {
    filaments.push(new Filament());
  }
}

function draw() {
  background(240, 10, 95);
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 500);
  pointLight(255, 255, 255, 0, 300, 500);

  // Center the scene
  translate(-width/2, -height/2, 0);

  // Draw substrate
  drawSubstrate();

  // Update and draw filaments
  for (let i = filaments.length - 1; i >= 0; i--) {
    filaments[i].update();
    filaments[i].draw();
    
    if (filaments[i].isDead()) {
      filaments.splice(i, 1);
    }
  }

  // Add new filaments occasionally
  if (frameCount % 30 === 0 && filaments.length < MAX_FILAMENTS) {
    filaments.push(new Filament());
  }
}

class Filament {
  constructor() {
    this.points = [createVector(0, 0, 0)];
    this.growth = 0;
    this.maxGrowth = random(100, 200);
    this.color = color(random(180, 240), 70, 90);
    this.thickness = random(0.5, 3);
    this.age = 0;
  }

  update() {
    this.age++;
    
    if (this.growth < this.maxGrowth) {
      this.growth += GROWTH_RATE;

      // Add new point
      const lastPoint = this.points[this.points.length - 1];
      const angle = random(TWO_PI);
      const dx = cos(angle) * 2;
      const dy = sin(angle) * 2;
      const dz = random(-1, 1);

      const newPoint = createVector(
        lastPoint.x + dx,
        lastPoint.y + dy,
        lastPoint.z + dz
      );

      // Constrain to substrate depth
      if (newPoint.z < -SUBSTRATE_DEPTH) {
        newPoint.z = -SUBSTRATE_DEPTH;
      }

      this.points.push(newPoint);
      
      // Spatial hash
      const gridX = floor((newPoint.x + width/2) / (width / GRID_SIZE));
      const gridY = floor((newPoint.y + height/2) / (height / GRID_SIZE));
      
      if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
        grid[gridX][gridY].push(this);
      }
    }
  }

  draw() {
    push();
    
    stroke(this.color);
    strokeWeight(this.thickness);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      vertex(p.x, p.y, p.z);
    }
    endShape();
    
    pop();
  }

  isDead() {
    return this.age > 300 || this.growth >= this.maxGrowth;
  }
}

function drawSubstrate() {
  // Draw the substrate surface
  push();
  translate(0, 0, -SUBSTRATE_DEPTH);
  noStroke();
  fill(240, 5, 80);
  plane(width, height);
  pop();

  // Draw some depth with darker lines
  stroke(240, 10, 60);
  strokeWeight(0.5);
  for (let i = 0; i < width; i += 30) {
    line(i - width/2, -height/2, -SUBSTRATE_DEPTH, i - width/2, height/2, -SUBSTRATE_DEPTH);
  }
  for (let j = 0; j < height; j += 30) {
    line(-width/2, j - height/2, -SUBSTRATE_DEPTH, width/2, j - height/2, -SUBSTRATE_DEPTH);
  }
}
