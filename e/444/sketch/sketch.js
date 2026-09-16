let cells = [];
let grid = [];
const GRID_SIZE = 20;
const CELL_COUNT = 1000;
const PULSE_SPEED = 0.01;
let pulse = 0;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.generation = 0;
    this.color = color(255, 255, 255);
    this.luminosity = 0;
    this.maxLuminosity = random(100, 200);
    this.luminosityDecay = 0.02;
    this.lifeSpan = 100 + random(200);
  }

  update() {
    this.age++;
    if (this.age > this.lifeSpan) {
      return false;
    }

    // Simulate life rules
    let neighbors = getNeighbors(this.x, this.y);
    let liveNeighbors = neighbors.filter(n => n.age > 0).length;

    if (this.age === 0) { // Newly born
      this.luminosity = this.maxLuminosity;
      this.generation = 0;
    } else {
      this.generation++;
      this.luminosity = max(0, this.luminosity - this.luminosityDecay);
    }

    if (liveNeighbors < 2 || liveNeighbors > 3) {
      // Dies
      return false;
    } else if (liveNeighbors === 3 && this.age === 0) {
      // Born
      this.color = color(random(100, 255), random(100, 255), random(100, 255));
    }

    return true;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.luminosity);
    ellipse(this.x, this.y, 8, 8);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }

  // Initialize cells
  for (let i = 0; i < CELL_COUNT; i++) {
    let x = random(width);
    let y = random(height);
    let cell = new Cell(x, y);
    cells.push(cell);
    let gridX = floor(x / (width / GRID_SIZE));
    let gridY = floor(y / (height / GRID_SIZE));
    grid[gridX][gridY].push(cell);
  }
}

function draw() {
  pulse += PULSE_SPEED;
  let bg = map(sin(pulse), -1, 1, 20, 40);
  background(bg);

  // Update and display cells
  for (let i = cells.length - 1; i >= 0; i--) {
    let cell = cells[i];
    if (!cell.update()) {
      cells.splice(i, 1);
      // Remove from grid
      let gridX = floor(cell.x / (width / GRID_SIZE));
      let gridY = floor(cell.y / (height / GRID_SIZE));
      if (grid[gridX] && grid[gridX][gridY]) {
        let index = grid[gridX][gridY].indexOf(cell);
        if (index !== -1) grid[gridX][gridY].splice(index, 1);
      }
    } else {
      cell.display();
    }
  }

  // Birth new cells
  if (random() < 0.05 && cells.length < CELL_COUNT * 2) {
    let x = random(width);
    let y = random(height);
    let cell = new Cell(x, y);
    cells.push(cell);
    let gridX = floor(x / (width / GRID_SIZE));
    let gridY = floor(y / (height / GRID_SIZE));
    if (grid[gridX] && grid[gridY]) {
      grid[gridX][gridY].push(cell);
    }
  }

  // Draw connections between nearby cells
  stroke(255, 30);
  noFill();
  beginShape(LINES);

  for (let cell of cells) {
    let neighbors = getNeighbors(cell.x, cell.y);
    for (let n of neighbors) {
      if (dist(cell.x, cell.y, n.x, n.y) < 60) {
        vertex(cell.x, cell.y);
        vertex(n.x, n.y);
      }
    }
  }

  endShape();
}

function getNeighbors(x, y) {
  let neighbors = [];
  let gridX = floor(x / (width / GRID_SIZE));
  let gridY = floor(y / (height / GRID_SIZE));

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (gridX + i >= 0 && gridX + i < GRID_SIZE &&
          gridY + j >= 0 && gridY + j < GRID_SIZE) {
        neighbors = neighbors.concat(grid[gridX + i][gridY + j]);
      }
    }
  }

  return neighbors;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
