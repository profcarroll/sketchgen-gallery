let cells = [];
let grid = [];
const cellCount = 1500;
const gridSize = 20;
const pulseSpeed = 0.001;
let pulsePhase = 0;
let connections = [];
let trailBuffer;

class Cell {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.3));
    this.size = random(0.5, 1.5);
    this.color = color(random(180, 255), 200, 255, 150);
    this.life = random(80, 150);
    this.maxLife = this.life;
    this.connected = [];
    this.glow = 0;
    this.trail = [];
    this.trailLength = 10;
  }

  update() {
    // Update position
    this.pos.add(this.vel);
    
    // Bounce off edges with some randomness
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Decay life
    this.life--;
    
    // Regenerate if dead
    if (this.life <= 0) {
      this.pos = createVector(random(width), random(height));
      this.vel = p5.Vector.random2D().mult(random(0.1, 0.3));
      this.size = random(0.5, 1.5);
      this.color = color(random(180, 255), 200, 255, 150);
      this.life = this.maxLife;
      this.connected = [];
      this.glow = 0;
      this.trail = [];
    }
    
    // Glow effect
    this.glow = map(this.life, 0, this.maxLife, 0, 1);
    
    // Update trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
  }

  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(0.3);
    for (let i = 0; i < this.trail.length - 1; i++) {
      let alpha = map(i, 0, this.trail.length - 1, 0, 150);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      line(this.trail[i].x, this.trail[i].y, this.trail[i+1].x, this.trail[i+1].y);
    }
    
    // Draw connections
    stroke(this.color);
    strokeWeight(0.2);
    noFill();
    
    for (let other of this.connected) {
      if (other && !other.isDead()) {
        line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      }
    }
    
    // Draw cell
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size + this.glow * 2);
  }

  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  trailBuffer = createGraphics(width, height);
  trailBuffer.background(0, 0, 0, 10);
  
  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = [];
    }
  }

  // Create cells
  for (let i = 0; i < cellCount; i++) {
    let x = random(width);
    let y = random(height);
    cells.push(new Cell(x, y));
    
    // Add to grid
    let gridX = floor(x / gridSize) * gridSize;
    let gridY = floor(y / gridSize) * gridSize;
    if (grid[gridX] && grid[gridX][gridY]) {
      grid[gridX][gridY].push(cells[i]);
    }
  }

  // Initialize connections
  for (let cell of cells) {
    connectToNearby(cell);
  }
}

function draw() {
  // Update pulse phase
  pulsePhase += pulseSpeed;
  
  // Calculate background color based on pulse
  let bgHue = (pulsePhase * 30) % 255;
  let bgSat = 10 + sin(pulsePhase) * 5;
  let bgBri = 2 + sin(pulsePhase * 0.2) * 3;
  
  background(bgHue, bgSat, bgBri);
  
  // Draw trail buffer
  image(trailBuffer, 0, 0);
  
  // Update and display cells
  for (let cell of cells) {
    cell.update();
    cell.display();
  }
  
  // Update connections periodically
  if (frameCount % 40 === 0) {
    for (let cell of cells) {
      cell.connected = [];
      connectToNearby(cell);
    }
  }
}

function connectToNearby(cell) {
  let nearby = [];
  let gridX = floor(cell.pos.x / gridSize) * gridSize;
  let gridY = floor(cell.pos.y / gridSize) * gridSize;
  
  // Check surrounding grid cells
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      let checkX = gridX + dx * gridSize;
      let checkY = gridY + dy * gridSize;
      
      if (grid[checkX] && grid[checkX][checkY]) {
        nearby.push(...grid[checkX][checkY]);
      }
    }
  }
  
  // Connect to nearby cells
  for (let other of nearby) {
    if (other !== cell && !cell.connected.includes(other)) {
      let d = dist(cell.pos.x, cell.pos.y, other.pos.x, other.pos.y);
      if (d < 50 && random() < 0.1) { // 10% chance to connect
        cell.connected.push(other);
      }
    }
  }
  
  // Limit connections to prevent overcrowding
  if (cell.connected.length > 4) {
    cell.connected.splice(4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
