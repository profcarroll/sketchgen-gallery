let gears = [];
let springs = [];
let backgroundTexture;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let offsetX = 0;
let offsetY = 0;

class Gear {
  constructor(x, y, radius, teeth) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.teeth = teeth;
    this.angle = random(TWO_PI);
    this.color = color(180, 160, 120, 200); // oxidized brass
  }

  display() {
    push();
    translate(this.x + offsetX, this.y + offsetY);
    
    stroke(120, 100, 60);
    strokeWeight(1.5);
    noFill();
    
    // Gear outline
    circle(0, 0, this.radius * 2);
    
    // Gear teeth
    let toothAngle = TWO_PI / this.teeth;
    for (let i = 0; i < this.teeth; i++) {
      let angle = i * toothAngle + this.angle;
      let x1 = cos(angle) * (this.radius - 5);
      let y1 = sin(angle) * (this.radius - 5);
      let x2 = cos(angle) * (this.radius + 10);
      let y2 = sin(angle) * (this.radius + 10);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
}

class Spring {
  constructor(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color(160, 140, 100, 180); // verdigris
  }

  display() {
    push();
    translate(this.x + offsetX, this.y + offsetY);
    
    stroke(100, 90, 60);
    strokeWeight(1);
    noFill();
    
    let segments = 15;
    let step = this.length / segments;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = this.length;
    
    beginShape();
    vertex(startX, startY);
    for (let i = 0; i < segments; i++) {
      let x = map(i, 0, segments, startX, endX);
      let y = map(i, 0, segments, startY, endY);
      if (i % 2 === 0) {
        y += random(-3, 3);
      }
      vertex(x, y);
    }
    endShape();
    
    pop();
  }
}

function setup() {
  createCanvas(800, 600);
  
  // Create background texture
  backgroundTexture = createGraphics(width, height);
  backgroundTexture.background(245, 245, 240);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    backgroundTexture.noStroke();
    backgroundTexture.fill(230, 230, 225);
    backgroundTexture.ellipse(x, y, size, size);
  }
  
  // Create gears
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(20, 60);
    let teeth = int(random(12, 24));
    gears.push(new Gear(x, y, radius, teeth));
  }
  
  // Create springs
  for (let i = 0; i < 25; i++) {
    let x = random(width);
    let y = random(height);
    let length = random(30, 100);
    springs.push(new Spring(x, y, length));
  }
  
  noLoop();
}

function draw() {
  image(backgroundTexture, 0, 0);
  
  // Draw gears
  for (let gear of gears) {
    gear.display();
  }
  
  // Draw springs
  for (let spring of springs) {
    spring.display();
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;
    
    offsetX += dx;
    offsetY += dy;
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
}
