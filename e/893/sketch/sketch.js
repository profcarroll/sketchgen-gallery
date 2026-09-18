let pixels = [];
let gridSize = 20;
let grid = [];
let centerX, centerY;
let time = 0;

class Pixel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.targetX = x;
    this.targetY = y;
    this.speed = random(0.02, 0.05);
    this.pulse = 0;
    this.pulseSpeed = random(0.02, 0.05);
  }

  update() {
    // Move toward target
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    this.x += dx * this.speed;
    this.y += dy * this.speed;

    // Add some randomness to movement
    this.vx += random(-0.05, 0.05);
    this.vy += random(-0.05, 0.05);
    this.vx *= 0.95;
    this.vy *= 0.95;

    this.x += this.vx;
    this.y += this.vy;

    // Pulsing effect
    this.pulse += this.pulseSpeed;
    this.size = 2 + sin(this.pulse) * 3;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);
  noStroke();
  
  // Create pixel grid
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      pixels.push(new Pixel(x + random(gridSize), y + random(gridSize)));
    }
  }

  centerX = width / 2;
  centerY = height / 2;

  // Initialize grid for spatial hashing
  let gridW = ceil(width / gridSize);
  let gridH = ceil(height / gridSize);
  grid = new Array(gridW * gridH).fill().map(() => []);
  
  for (let i = 0; i < pixels.length; i++) {
    let p = pixels[i];
    let gridX = floor(p.x / gridSize);
    let gridY = floor(p.y / gridSize);
    if (gridX >= 0 && gridX < gridW && gridY >= 0 && gridY < gridH) {
      grid[gridX + gridY * gridW].push(i);
    }
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Update and display pixels
  for (let i = 0; i < pixels.length; i++) {
    let p = pixels[i];
    
    // Calculate distance to mouse
    let d = dist(p.x, p.y, mouseX, mouseY);
    
    if (d < 150) {
      // Scatter away from mouse
      let angle = atan2(p.y - mouseY, p.x - mouseX);
      p.targetX += cos(angle) * 3;
      p.targetY += sin(angle) * 3;
      
      // Add glow effect
      fill(255, 255, 255, 100);
      ellipse(p.x, p.y, p.size + 5);
    } else {
      // Return to original position with slight drift
      let dx = p.originalX - p.x;
      let dy = p.originalY - p.y;
      p.targetX += dx * 0.005;
      p.targetY += dy * 0.005;
    }
    
    p.update();
    p.display();
  }

  // Draw temporary lattices
  if (mouseX > 0 && mouseY > 0) {
    let latticeSize = 30;
    for (let x = 0; x < width; x += latticeSize) {
      for (let y = 0; y < height; y += latticeSize) {
        let dx = abs(x - mouseX);
        let dy = abs(y - mouseY);
        if (dx < 100 && dy < 100) {
          let strength = map(max(dx, dy), 0, 100, 1, 0);
          
          // Draw lattice lines
          stroke(255, 255, 255, 50 * strength);
          line(x, y, x + latticeSize, y);
          line(x, y, x, y + latticeSize);
          line(x + latticeSize, y, x + latticeSize, y + latticeSize);
          line(x, y + latticeSize, x + latticeSize, y + latticeSize);
        }
      }
    }
  }

  // Occasionally create a powerful echo
  if (frameCount % 300 === 0) {
    let centerX = width / 2;
    let centerY = height / 2;
    for (let i = 0; i < pixels.length; i++) {
      let p = pixels[i];
      let dx = p.x - centerX;
      let dy = p.y - centerY;
      let distToCenter = sqrt(dx * dx + dy * dy);
      
      if (distToCenter < 200) {
        let angle = atan2(dy, dx);
        p.targetX = centerX + cos(angle) * 300;
        p.targetY = centerY + sin(angle) * 300;
      }
    }
  }
}
