let rods = [];
let time = 0;
let grid;

function setup() {
  createCanvas(600, 600, WEBGL);
  // Initialize a spatial grid for efficient neighbor search
  grid = new SpatialGrid(600, 600, 600, 30);
  // Create many rods
  for (let i = 0; i < 500; i++) {
    rods.push(new Rod(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200)));
  }
}

function draw() {
  background(0);
  // Rotate the scene slowly
  rotateY(time * 0.001);
  rotateX(sin(time * 0.001) * 0.2);
  
  // Update and display rods
  for (let rod of rods) {
    rod.update();
  }
  
  // Clear grid before updating
  grid.clear();
  
  // Insert all rods into the grid
  for (let rod of rods) {
    grid.insert(rod);
  }
  
  // Find neighbors and draw bonds
  let bondCount = 0;
  const maxBonds = 500;
  for (let rod of rods) {
    if (bondCount >= maxBonds) break;
    let neighbors = grid.query(rod, 80);
    for (let other of neighbors) {
      if (bondCount >= maxBonds) break;
      if (other !== rod && dist(rod.x, rod.y, rod.z, other.x, other.y, other.z) < 80) {
        // Draw the bond only if we haven't hit our cap
        stroke(255, 100);
        noFill();
        line(rod.x, rod.y, rod.z, other.x, other.y, other.z);
        bondCount++;
      }
    }
  }
  
  // Display all rods
  for (let rod of rods) {
    rod.display();
  }
  
  time++;
}

class Rod {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = random(TWO_PI);
    this.length = random(10, 30);
    this.width = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.targetY = y;
    this.speed = random(0.01, 0.03);
  }

  update() {
    // Float gently up and down
    this.angle += this.speed;
    this.y += sin(this.angle) * 0.5;
    
    // Slight horizontal drift
    this.x += sin(this.angle * 0.5) * 0.2;
    this.z += cos(this.angle * 0.3) * 0.2;
    
    // Slowly rotate around its axis
    this.angle += 0.01;
    
    // Adjust targetY to simulate floating
    this.targetY += (this.y - this.targetY) * 0.05;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.angle);
    
    // Apply a color filter based on time and position
    let c = color(
      red(this.color) + sin(time * 0.01 + this.x * 0.01) * 50,
      green(this.color) + cos(time * 0.01 + this.y * 0.01) * 50,
      blue(this.color) + sin(time * 0.01 + this.z * 0.01) * 50
    );
    
    fill(c);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.length);
    pop();
  }
}

class SpatialGrid {
  constructor(w, h, d, cellSize) {
    this.w = w;
    this.h = h;
    this.d = d;
    this.cellSize = cellSize;
    this.grid = {};
  }

  clear() {
    this.grid = {};
  }

  insert(rod) {
    let x = floor((rod.x + this.w/2) / this.cellSize);
    let y = floor((rod.y + this.h/2) / this.cellSize);
    let z = floor((rod.z + this.d/2) / this.cellSize);
    let key = `${x},${y},${z}`;
    if (!this.grid[key]) {
      this.grid[key] = [];
    }
    this.grid[key].push(rod);
  }

  query(rod, radius) {
    let neighbors = [];
    let x = floor((rod.x + this.w/2) / this.cellSize);
    let y = floor((rod.y + this.h/2) / this.cellSize);
    let z = floor((rod.z + this.d/2) / this.cellSize);
    let r = ceil(radius / this.cellSize);
    
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          let key = `${x + dx},${y + dy},${z + dz}`;
          if (this.grid[key]) {
            for (let other of this.grid[key]) {
              neighbors.push(other);
            }
          }
        }
      }
    }
    
    return neighbors;
  }
}
