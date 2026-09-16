let shapes = [];
let isIdle = true;
let clickTime = 0;
let explosionRadius = 0;
let explosionSpeed = 0;

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 60);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 180);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
    this.pulse = 0;
    this.pulseSpeed = random(0.01, 0.03);
    this.originalSize = this.size;
  }

  update() {
    if (isIdle) {
      this.pulse += this.pulseSpeed;
      this.size = this.originalSize + sin(this.pulse) * 5;
      this.angle += this.rotationSpeed;
    } else {
      // During explosion, shapes fly outward
      let dx = random(-1, 1);
      let dy = random(-1, 1);
      this.x += dx * 3;
      this.y += dy * 3;
      this.size *= 0.98;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    if (isIdle) {
      ellipse(0, 0, this.size);
    } else {
      // Draw jagged explosion shape
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let radius = this.size * (1 + sin(frameCount * 0.1 + i) * 0.5);
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    pop();
  }
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 20; i++) {
    shapes.push(new Shape(random(width), random(height)));
  }
}

function draw() {
  background(20, 30, 40);

  if (!isIdle) {
    explosionRadius += explosionSpeed;
    explosionSpeed *= 0.95;

    if (explosionRadius > 100 || explosionSpeed < 0.1) {
      isIdle = true;
      explosionRadius = 0;
      for (let shape of shapes) {
        shape.x = random(width);
        shape.y = random(height);
        shape.size = random(20, 60);
      }
    }
  }

  for (let shape of shapes) {
    shape.update();
    shape.display();
  }
}

function mousePressed() {
  if (isIdle) {
    isIdle = false;
    explosionRadius = 1;
    explosionSpeed = 5;
    clickTime = millis();
  }
}
