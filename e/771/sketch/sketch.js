let cells = [];
let bgPulse = 0;
const CELL_COUNT = 500;
const MAX_CONNECTIONS = 200;
const GRID_SIZE = 40;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.speed = random(0.5, 2);
    this.angle = random(TWO_PI);
    this.life = 1;
    this.trail = [];
    this.trailLength = 10;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.angle += random(-0.5, 0.5);
    }
    
    this.angle += random(-0.02, 0.02);
    
    this.trail.push({x: this.x, y: this.y, life: 1});
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
  }

  draw() {
    noFill();
    stroke(255, 200);
    strokeWeight(this.size / 4);
    
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      const a = map(i, 0, this.trail.length, 0, 1);
      stroke(255, a * 100);
      vertex(p.x, p.y);
    }
    endShape();
    
    fill(255, 150);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  bgPulse += 0.01;
  const bg = map(sin(bgPulse), -1, 1, 20, 50);
  background(bg);

  // Update and draw cells
  for (let i = 0; i < cells.length; i++) {
    cells[i].update();
    cells[i].draw();
  }

  // Draw connections with spatial hashing
  const grid = {};
  const cellSize = width / GRID_SIZE;
  
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    const gridX = floor(c.x / cellSize);
    const gridY = floor(c.y / cellSize);
    
    if (!grid[`${gridX},${gridY}`]) {
      grid[`${gridX},${gridY}`] = [];
    }
    grid[`${gridX},${gridY}`].push(i);
  }

  // Connect cells within range
  let connections = 0;
  
  for (let i = 0; i < cells.length && connections < MAX_CONNECTIONS; i++) {
    const c1 = cells[i];
    const gridX = floor(c1.x / cellSize);
    const gridY = floor(c1.y / cellSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (!grid[`${gridX + dx},${gridY + dy}`]) continue;
        
        for (let j of grid[`${gridX + dx},${gridY + dy}`]) {
          if (i >= j || connections >= MAX_CONNECTIONS) continue;
          
          const c2 = cells[j];
          const d = dist(c1.x, c1.y, c2.x, c2.y);
          
          if (d < 150) {
            stroke(255, map(d, 0, 150, 100, 0));
            line(c1.x, c1.y, c2.x, c2.y);
            connections++;
          }
        }
      }
    }
  }
}
