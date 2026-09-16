let ships = [];
let wakes = [];

class Ship {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2, height);
    this.size = random(30, 60);
    this.speed = random(0.5, 1.5);
    this.angle = 0;
    this.trail = [];
    this.maxTrailLength = 50;
  }

  update() {
    this.x += this.speed;
    this.y += sin(this.x * 0.02) * 0.3;

    if (this.x > width + 100) {
      this.x = -100;
      this.y = random(height / 2, height);
    }

    this.trail.push({ x: this.x, y: this.y, alpha: 255 });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Ship body
    fill(139, 69, 19); // Brown
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size * 1.5, this.size / 2, 5);

    // Mast
    stroke(101, 67, 33);
    strokeWeight(2);
    line(0, -this.size / 2, 0, -this.size);

    // Sail
    fill(245, 245, 220);
    noStroke();
    triangle(-this.size / 2, -this.size, this.size / 2, -this.size, 0, -this.size * 1.8);

    // Details (wood texture)
    stroke(101, 67, 33);
    strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      line(-this.size / 2 + i * 5, -this.size / 2, -this.size / 2 + i * 5, this.size / 2);
    }

    pop();
  }

  displayWake() {
    for (let i = 0; i < this.trail.length - 1; i++) {
      let point = this.trail[i];
      let nextPoint = this.trail[i + 1];

      if (point && nextPoint) {
        let alpha = map(i, 0, this.trail.length, 0, 255);
        stroke(173, 216, 230, alpha);
        strokeWeight(map(i, 0, this.trail.length, 1, 3));
        line(point.x, point.y, nextPoint.x, nextPoint.y);
      }
    }
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(RGB);

  for (let i = 0; i < 5; i++) {
    ships.push(new Ship());
  }

  background(135, 206, 235); // Sky blue
}

function draw() {
  // Draw sea
  background(135, 206, 235);

  for (let ship of ships) {
    ship.update();
    ship.display();
    ship.displayWake();
  }

  // Add some waves
  stroke(173, 216, 230, 100);
  strokeWeight(1);
  for (let i = 0; i < 50; i++) {
    let x = (frameCount * 0.5 + i * 20) % width;
    let y = height / 2 + sin(frameCount * 0.02 + i) * 10;
    line(x, y, x + 30, y);
  }
}
