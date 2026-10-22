let roots = [];
const gridCols = 20;
const gridRows = 20;
const cellSize = 30;
let time = 0;

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.segments = [];
    this.maxSegments = 100;
    this.growthSpeed = random(0.005, 0.02);
    this.pulseSpeed = random(0.01, 0.03);
    this.angle = random(TWO_PI);
    this.color = color(0, 200, 150, 180);
  }

  update() {
    time += this.growthSpeed;
    
    // Move root in a slow, organic direction
    const speed = 0.3;
    this.x += cos(this.angle) * speed;
    this.y += sin(this.angle) * speed;
    
    // Occasionally change direction slightly
    if (random() < 0.02) {
      this.angle += random(-0.5, 0.5);
    }
    
    // Add new segment
    if (this.segments.length < this.maxSegments) {
      this.segments.push({x: this.x, y: this.y});
    } else {
      this.segments.shift();
      this.segments.push({x: this.x, y: this.y});
    }
  }

  display() {
    push();
    
    // Pulsing effect
    const pulse = sin(time * this.pulseSpeed) * 0.3 + 0.7;
    
    noFill();
    stroke(this.color);
    strokeWeight(2 * pulse);
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      const alpha = map(i, 0, this.segments.length, 0, 255);
      stroke(red(this.color), green(this.color), blue(this.color), alpha * pulse);
      vertex(segment.x, segment.y);
    }
    endShape();
    
    pop();
  }
}

function setup() {
  createCanvas(gridCols * cellSize, gridRows * cellSize);
  
  // Initialize roots
  for (let i = 0; i < 20; i++) {
    const x = random(width);
    const y = random(height);
    roots.push(new Root(x, y));
  }
}

function draw() {
  background(10, 20, 30);
  
  // Draw knitted wool texture
  drawTexture();
  
  // Update and display roots
  for (let root of roots) {
    root.update();
    root.display();
  }
}

function drawTexture() {
  // Draw subtle grid pattern to simulate knitted wool
  stroke(255, 255, 255, 10);
  strokeWeight(0.5);
  
  for (let x = 0; x < width; x += cellSize / 4) {
    line(x, 0, x, height);
  }
  
  for (let y = 0; y < height; y += cellSize / 4) {
    line(0, y, width, y);
  }
}
