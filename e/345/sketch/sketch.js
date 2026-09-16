let particles = [];
let gridSize = 20;
let grid = [];
let mouseRadius = 100;
let scatterPoints = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.glow = random(0.5, 1.5);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size * this.glow);
  }
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = [];
    }
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Grid-based neighbor search
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = [];
    }
  }

  for (let p of particles) {
    let gridX = floor(p.x / gridSize) * gridSize;
    let gridY = floor(p.y / gridSize) * gridSize;
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      grid[gridX][gridY].push(p);
    }
  }

  // Draw connections between nearby particles
  stroke(255, 50);
  noFill();
  beginShape();
  for (let p of particles) {
    let gridX = floor(p.x / gridSize) * gridSize;
    let gridY = floor(p.y / gridSize) * gridSize;

    for (let x = -gridSize; x <= gridSize; x += gridSize) {
      for (let y = -gridSize; y <= gridSize; y += gridSize) {
        let checkX = gridX + x;
        let checkY = gridY + y;
        if (checkX >= 0 && checkX < width && checkY >= 0 && checkY < height) {
          for (let other of grid[checkX][checkY]) {
            let d = dist(p.x, p.y, other.x, other.y);
            if (d < 50 && d > 0) {
              line(p.x, p.y, other.x, other.y);
            }
          }
        }
      }
    }
  }
  endShape();

  // Scatter effect on mouse drag
  if (mouseIsPressed && mouseX !== pmouseX || mouseY !== pmouseY) {
    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;
    for (let i = 0; i < 5; i++) {
      scatterPoints.push({
        x: mouseX + random(-20, 20),
        y: mouseY + random(-20, 20),
        size: random(1, 4),
        life: 30,
        color: color(random(200, 255), random(100, 200), random(200, 255), 200)
      });
    }
  }

  // Update and display scatter points
  for (let i = scatterPoints.length - 1; i >= 0; i--) {
    let p = scatterPoints[i];
    p.x += random(-3, 3);
    p.y += random(-3, 3);
    p.life--;
    if (p.life <= 0) {
      scatterPoints.splice(i, 1);
      continue;
    }

    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size * p.life / 30);
  }
}
