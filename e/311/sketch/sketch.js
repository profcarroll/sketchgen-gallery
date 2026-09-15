let shapes = [];
let rippleCenter = { x: 0, y: 0 };
let isRippling = false;
let rippleRadius = 0;
let maxRippleRadius = 150;

class PixelShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(4, 8);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.originalX = x;
    this.originalY = y;
  }

  update() {
    if (isRippling) {
      let dx = this.x - rippleCenter.x;
      let dy = this.y - rippleCenter.y;
      let distance = sqrt(dx * dx + dy * dy);

      if (distance < rippleRadius) {
        let angle = atan2(dy, dx);
        let force = map(rippleRadius - distance, 0, rippleRadius, 0.5, 0);
        this.vx += cos(angle) * force;
        this.vy += sin(angle) * force;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // Apply some friction
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 255);

  // Create initial pixel shapes
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    shapes.push(new PixelShape(x, y));
  }
}

function draw() {
  background(0, 0, 10);

  // Update and display shapes
  for (let shape of shapes) {
    shape.update();
    shape.display();
  }

  // Handle ripple effect
  if (isRippling) {
    rippleRadius += 5;
    if (rippleRadius > maxRippleRadius) {
      isRippling = false;
      rippleRadius = 0;
    }
  }

  // Draw ripple if active
  if (isRippling && rippleRadius > 0) {
    noFill();
    stroke(255, 100);
    strokeWeight(2);
    ellipse(rippleCenter.x, rippleCenter.y, rippleRadius * 2);
  }
}

function mousePressed() {
  isRippling = true;
  rippleCenter.x = mouseX;
  rippleCenter.y = mouseY;
  rippleRadius = 0;
}
