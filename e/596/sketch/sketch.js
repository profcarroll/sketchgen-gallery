let cracks = [];
let dustDevils = [];
let skyColor;
let earthColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Sky and earth colors
  skyColor = color(240, 230, 220); // Pale beige
  earthColor = color(139, 69, 19); // Terracotta

  // Create cracked earth texture
  for (let i = 0; i < 500; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.7), // Keep cracks mostly in the earth area
      w: random(20, 100),
      h: random(2, 10)
    });
  }

  // Create initial dust devils
  for (let i = 0; i < 5; i++) {
    createDustDevil();
  }
}

function draw() {
  // Draw sky
  background(skyColor);

  // Draw cracked earth
  noStroke();
  fill(earthColor);
  rect(0, height * 0.7, width, height * 0.3);

  // Draw cracks
  stroke(50); // Darker crack lines
  strokeWeight(1);
  for (let c of cracks) {
    line(c.x, c.y, c.x + c.w, c.y + c.h);
  }

  // Update and draw dust devils
  for (let i = dustDevils.length - 1; i >= 0; i--) {
    let dd = dustDevils[i];
    dd.update();
    dd.display();

    // Remove if dead
    if (dd.isDead()) {
      dustDevils.splice(i, 1);
    }
  }

  // Occasionally add a new dust devil
  if (frameCount % 60 === 0 && dustDevils.length < 10) {
    createDustDevil();
  }
}

function createDustDevil() {
  dustDevils.push(new DustDevil(random(width), height * 0.7));
}

class DustDevil {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 20);
    this.speed = random(0.5, 2);
    this.angle = random(TWO_PI);
    this.lifespan = random(100, 300);
    this.alpha = 255;
    this.trail = [];
    this.maxTrailLength = 20;
  }

  update() {
    // Move in a spiral pattern
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.angle += 0.05;

    // Fade out over time
    this.lifespan--;
    this.alpha = map(this.lifespan, 0, 300, 0, 255);

    // Add to trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  display() {
    noFill();
    stroke(200, 180, 160, this.alpha);
    strokeWeight(this.size / 4);

    // Draw trail
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw main swirl
    noStroke();
    fill(200, 180, 160, this.alpha * 0.7);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan <= 0 || this.x < -50 || this.x > width + 50;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
