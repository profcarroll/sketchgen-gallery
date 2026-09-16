let streams = [];
let particles = [];
let trails = [];

class Stream {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.z = random(100);
    this.size = random(50, 200);
    this.speed = random(0.2, 0.8);
    this.alpha = random(30, 80);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), this.alpha);
  }

  update() {
    this.y += this.speed;
    if (this.y > height + 100) {
      this.y = -100;
      this.x = random(width);
    }
    this.z += 0.01;
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.size + sin(this.z) * 30, this.size + cos(this.z) * 30);
    pop();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.life = random(50, 150);
    this.alpha = random(100, 200);
    this.color = color(random(200, 255), random(200, 255), random(255), this.alpha);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    if (this.life <= 0) {
      return false;
    }
    return true;
  }

  display() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    pop();
  }
}

class Trail {
  constructor(x, y) {
    this.points = [];
    this.maxPoints = 20;
    this.addPoint(x, y);
  }

  addPoint(x, y) {
    this.points.push({x, y});
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  display() {
    if (this.points.length < 2) return;

    push();
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let alpha = map(i, 0, this.points.length - 1, 0, 100);
      stroke(255, alpha);
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  for (let i = 0; i < 100; i++) {
    streams.push(new Stream());
  }

  noLoop();
  setTimeout(() => {
    loop();
  }, 100);
}

function draw() {
  background(0, 10); // Semi-transparent background to fade trails

  for (let i = 0; i < streams.length; i++) {
    streams[i].update();
    streams[i].display();
  }

  if (random() < 0.3) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].display();
    }
  }

  if (random() < 0.5) {
    let x = random(width);
    let y = random(height);
    trails.push(new Trail(x, y));
  }

  for (let i = trails.length - 1; i >= 0; i--) {
    if (trails[i].points.length > 0) {
      trails[i].addPoint(random(width), random(height));
      trails[i].display();
    } else {
      trails.splice(i, 1);
    }
  }

  // Occasionally create a new structure
  if (random() < 0.05) {
    let x = random(width);
    let y = random(height);
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(x + random(-50, 50), y + random(-50, 50)));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
