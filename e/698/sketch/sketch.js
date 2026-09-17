let forms = [];
let shadows = [];
let grid = [];

class LiquidForm {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 60);
    this.speed = random(0.5, 1.5);
    this.pulse = 0;
    this.hue = random(80, 160); // emerald to cyan range
    this.life = random(100, 300);
  }

  update() {
    this.y += this.speed;
    this.pulse += 0.05;
    this.life--;
    
    // Reset form when it goes off screen or expires
    if (this.y > height + 100 || this.life <= 0) {
      this.x = random(width);
      this.y = -50;
      this.life = random(100, 300);
    }
  }

  display() {
    let pulseSize = this.size * (1 + sin(this.pulse) * 0.3);
    let alpha = map(this.life, 0, 300, 0, 200);
    
    noStroke();
    fill(this.hue, 100, 90, alpha);
    ellipse(this.x, this.y, pulseSize, pulseSize * 0.8);
    
    // Add glow effect
    fill(this.hue, 100, 100, alpha * 0.3);
    ellipse(this.x, this.y, pulseSize * 1.5, pulseSize * 1.2);
  }
}

class Shadow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.alpha = random(30, 80);
    this.life = random(50, 150);
  }

  update() {
    this.y += 1;
    this.x += random(-0.5, 0.5);
    this.life--;
    
    if (this.y > height + 50 || this.life <= 0) {
      this.reset();
    }
  }

  reset() {
    this.x = random(width);
    this.y = -20;
    this.life = random(50, 150);
  }

  display() {
    noStroke();
    fill(0, 0, 0, this.alpha);
    ellipse(this.x, this.y, this.size, this.size * 0.6);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create liquid forms
  for (let i = 0; i < 50; i++) {
    forms.push(new LiquidForm(random(width), random(-200, -50)));
  }
  
  // Create shadows
  for (let i = 0; i < 100; i++) {
    shadows.push(new Shadow(random(width), random(height)));
  }
  
  // Create grid for spatial hashing
  let gridSize = 80;
  for (let x = 0; x < width; x += gridSize) {
    grid.push([]);
    for (let y = 0; y < height; y += gridSize) {
      grid[x / gridSize].push([]);
    }
  }
}

function draw() {
  background(0, 0, 5);
  
  // Update and display forms
  for (let form of forms) {
    form.update();
    form.display();
  }
  
  // Update and display shadows
  for (let shadow of shadows) {
    shadow.update();
    shadow.display();
  }
  
  // Draw crystalline network connections
  stroke(180, 50, 100, 0.2);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < forms.length - 1; i++) {
    let f1 = forms[i];
    let f2 = forms[i + 1];
    
    // Only draw if they're close enough
    let d = dist(f1.x, f1.y, f2.x, f2.y);
    if (d < 150) {
      vertex(f1.x, f1.y, 0);
      vertex(f2.x, f2.y, 0);
    }
  }
  endShape();
  
  // Draw ripple effect from center
  let time = millis() * 0.001;
  stroke(80, 100, 100, 0.1);
  noFill();
  
  for (let i = 0; i < 5; i++) {
    let r = (i * 30 + time * 20) % 300;
    ellipse(0, 0, r, r * 0.8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
