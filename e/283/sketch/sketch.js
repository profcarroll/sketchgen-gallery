let circles = [];
let trails = [];
let pulsePoints = [];

class CosmicCircle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(20, 100);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.alpha = random(30, 80);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), this.alpha);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < -this.r || this.x > width + this.r) this.speedX *= -1;
    if (this.y < -this.r || this.y > height + this.r) this.speedY *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class GlowingTrail {
  constructor() {
    this.points = [];
    this.maxPoints = 20;
    this.x = random(width);
    this.y = random(height);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.alpha = 150;
    this.color = color(255, 255, 255, this.alpha);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;

    // Add current position to trail
    this.points.push({ x: this.x, y: this.y });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create cosmic circles
  for (let i = 0; i < 15; i++) {
    circles.push(new CosmicCircle());
  }

  // Create glowing trails
  for (let i = 0; i < 5; i++) {
    trails.push(new GlowingTrail());
  }
}

function draw() {
  background(10, 10, 30);

  // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }

  // Update and display trails
  for (let trail of trails) {
    trail.update();
    trail.display();
  }

  // Check for intersections and create pulses
  for (let circle of circles) {
    for (let trail of trails) {
      for (let point of trail.points) {
        let d = dist(circle.x, circle.y, point.x, point.y);
        if (d < circle.r) {
          pulsePoints.push({
            x: point.x,
            y: point.y,
            size: 0,
            maxsize: random(10, 30),
            alpha: 255
          });
        }
      }
    }
  }

  // Update and display pulses
  for (let i = pulsePoints.length - 1; i >= 0; i--) {
    let p = pulsePoints[i];
    p.size += 0.8;
    p.alpha -= 3;
    
    if (p.alpha <= 0) {
      pulsePoints.splice(i, 1);
    } else {
      noStroke();
      fill(255, 255, 200, p.alpha);
      ellipse(p.x, p.y, p.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
