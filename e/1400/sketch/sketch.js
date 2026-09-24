let plants = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // Initialize with some plants
  for (let i = 0; i < 20; i++) {
    plants.push(new Plant(random(width), random(height)));
  }
}

function draw() {
  background(50, 60, 40); // Dark greenish background

  // Update and display all plants
  for (let plant of plants) {
    plant.update();
    plant.display();
  }

  // Occasionally add a new plant
  if (random() < 0.02) {
    plants.push(new Plant(random(width), random(height)));
  }

  // Remove old plants to keep the count reasonable
  if (plants.length > 100) {
    plants.splice(0, 10);
  }
}

class Plant {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(5, 20);
    this.color = color(random(100, 255), random(100, 255), random(50, 150));
    this.growth = 0;
    this.maxGrowth = random(100, 300);
    this.angle = random(TWO_PI);
    this.speed = random(0.005, 0.02);
    this.hueShift = random(-1, 1);
  }

  update() {
    this.growth += 1;
    if (this.growth > this.maxGrowth) {
      this.size += random(-0.5, 0.5);
      this.color = lerpColor(this.color, color(hue(this.color), saturation(this.color), brightness(this.color) + random(-2, 2)), 0.01);
    }

    // Slowly move
    this.pos.x += sin(this.angle) * 0.2;
    this.pos.y += cos(this.angle) * 0.2;
    this.angle += random(-0.05, 0.05);

    // Wrap around screen
    if (this.pos.x < -this.size) this.pos.x = width + this.size;
    if (this.pos.x > width + this.size) this.pos.x = -this.size;
    if (this.pos.y < -this.size) this.pos.y = height + this.size;
    if (this.pos.y > height + this.size) this.pos.y = -this.size;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw expanding shape
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.size * (1 + this.growth / 200), this.size * (1 + this.growth / 200));
    
    // Add a secondary shape for more organic feel
    fill(red(this.color), green(this.color), blue(this.color), 150);
    ellipse(0, 0, this.size * (0.5 + this.growth / 400), this.size * (0.5 + this.growth / 400));
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
