let shapes = [];
let steelSheets = [];
const gridCols = 15;
const gridRows = 15;
const cellSize = 40;
let time = 0;

class DissolvingShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 40);
    this.growth = 0;
    this.maxGrowth = random(1, 3);
    this.pulseSpeed = random(0.02, 0.05);
    this.color = color(0, 180, 120, 150);
    this.decay = 0;
    this.maxDecay = random(100, 200);
  }

  update() {
    time += 0.01;
    this.growth += 0.005;
    this.decay++;
    
    // Slowly dissolve
    if (this.decay > this.maxDecay) {
      this.growth = 0;
    }
  }

  display() {
    push();
    
    // Pulsing effect
    const pulse = sin(time * this.pulseSpeed) * 0.3 + 0.7;
    const alpha = map(this.decay, 0, this.maxDecay, 255, 0);
    
    noFill();
    stroke(red(this.color), green(this.color), blue(this.color), alpha * pulse);
    strokeWeight(1 * pulse);
    
    // Draw shape with organic motion
    beginShape();
    for (let i = 0; i < 8; i++) {
      const angle = map(i, 0, 8, 0, TWO_PI);
      const radius = this.size * (0.8 + sin(time + angle) * 0.2);
      const x = this.x + cos(angle) * radius;
      const y = this.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

class SteelSheet {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.w = random(30, 80);
    this.h = random(10, 30);
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.color = color(180, 60, 40, 150);
    this.life = random(100, 300);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.rotationSpeed;
    this.life--;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    push();
    
    translate(this.x, this.y);
    rotate(this.angle);
    
    noFill();
    stroke(this.color);
    strokeWeight(2);
    
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    
    // Add rivets
    fill(this.color);
    noStroke();
    for (let i = 0; i < 5; i++) {
      const x = random(-this.w/2 + 5, this.w/2 - 5);
      const y = random(-this.h/2 + 5, this.h/2 - 5);
      ellipse(x, y, 3, 3);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  
  // Initialize grid of dissolving shapes
  for (let x = 0; x < gridCols; x++) {
    for (let y = 0; y < gridRows; y++) {
      const px = x * cellSize + cellSize/2;
      const py = y * cellSize + cellSize/2;
      shapes.push(new DissolvingShape(px, py));
    }
  }
  
  // Initialize steel sheets
  for (let i = 0; i < 30; i++) {
    steelSheets.push(new SteelSheet());
  }
}

function draw() {
  background(10, 20, 30);
  
  // Draw subtle texture
  drawTexture();
  
  // Update and display dissolving shapes
  for (let shape of shapes) {
    shape.update();
    shape.display();
  }
  
  // Update and display steel sheets
  for (let sheet of steelSheets) {
    sheet.update();
    sheet.display();
  }
}

function drawTexture() {
  // Draw subtle grid pattern to simulate deep earth texture
  stroke(255, 255, 255, 10);
  strokeWeight(0.5);
  
  for (let x = 0; x < width; x += cellSize / 2) {
    line(x, 0, x, height);
  }
  
  for (let y = 0; y < height; y += cellSize / 2) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
