let cells = [];
const gridSize = 20;
const cellSize = 20;
let time = 0;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = random(100, 200);
    this.birthTime = 0;
    this.glow = 0;
    this.isAlive = false;
    this.waveOffset = random(TWO_PI);
  }

  update() {
    if (this.isAlive) {
      this.life++;
      this.glow = map(this.life, 0, this.maxLife, 1, 0);
      if (this.life > this.maxLife) {
        this.isAlive = false;
        this.glow = 0;
      }
    } else {
      if (random() < 0.005) {
        this.isAlive = true;
        this.life = 0;
        this.birthTime = time;
      }
    }
  }

  display() {
    const wave = sin(time * 0.01 + this.waveOffset) * 0.5 + 0.5;
    const alpha = this.isAlive ? map(this.life, 0, this.maxLife, 200, 50) : 0;
    
    if (this.isAlive || this.glow > 0) {
      fill(100, 255, 200, alpha * wave);
      noStroke();
      ellipse(this.x, this.y, cellSize * (0.5 + this.glow * 0.5));
    }
    
    if (this.life < 10 && this.isAlive) {
      const pulse = map(this.life, 0, 10, 1, 0);
      fill(255, 255, 200, pulse * 100);
      noStroke();
      ellipse(this.x, this.y, cellSize * (1 + pulse));
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  const cols = width / gridSize;
  const rows = height / gridSize;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push(new Cell(x * gridSize + gridSize/2, y * gridSize + gridSize/2));
    }
  }
}

function draw() {
  background(0);
  time++;
  
  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}
