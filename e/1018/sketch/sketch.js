let planes = [];
let gridMode = false;
let gridStartTime = 0;
let gridDuration = 2000; // 2 seconds
let numPlanes = 150;

class Plane {
  constructor() {
    this.reset();
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(50, 150);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.wobble = random(TWO_PI);
    this.wobbleSpeed = random(0.01, 0.03);
  }

  update() {
    if (gridMode) {
      // Move towards grid positions
      const gridSize = 80;
      let targetX = floor(this.x / gridSize) * gridSize + gridSize/2;
      let targetY = floor(this.y / gridSize) * gridSize + gridSize/2;

      this.x += (targetX - this.x) * 0.05;
      this.y += (targetY - this.y) * 0.05;
    } else {
      // Normal fluid movement
      this.x += this.vx;
      this.y += this.vy;
      this.wobble += this.wobbleSpeed;

      // Boundary check
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    // Gentle size fluctuation
    this.size += sin(this.wobble) * 0.5;
  }

  display() {
    noStroke();
    fill(this.color);
    
    if (gridMode) {
      // Draw hexagon grid shape
      push();
      translate(this.x, this.y);
      rotate(this.wobble);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = cos(angle) * this.size/2;
        let y = sin(angle) * this.size/2;
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    } else {
      // Draw amorphous glowing plane
      ellipse(this.x, this.y, this.size, this.size * 0.6);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numPlanes; i++) {
    planes.push(new Plane());
  }
  frameRate(30);
}

function draw() {
  background(10);

  // Check if we should switch to grid mode
  if (!gridMode && millis() > 5000) {
    gridMode = true;
    gridStartTime = millis();
  }

  // Check if we should switch back to fluid mode
  if (gridMode && millis() > gridStartTime + gridDuration) {
    gridMode = false;
  }

  for (let plane of planes) {
    plane.update();
    plane.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
