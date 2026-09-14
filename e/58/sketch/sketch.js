let plants = [];
let colorPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorPalette = [
    color(34, 139, 34),   // Forest Green
    color(50, 205, 50),   // Lime Green
    color(143, 188, 143), // Light Green
    color(107, 142, 35),  // Olive Drab
    color(0, 100, 0),     // Dark Green
    color(124, 252, 0),   // Lawn Green
    color(154, 205, 50),  // Yellow Green
    color(34, 139, 34),   // Forest Green
    color(0, 128, 0),     // Green
    color(50, 205, 50),   // Lime Green
    color(143, 188, 143), // Light Green
    color(107, 142, 35),  // Olive Drab
    color(0, 100, 0),     // Dark Green
    color(124, 252, 0),   // Lawn Green
    color(154, 205, 50)   // Yellow Green
  ];

  // Create initial plants
  for (let i = 0; i < 30; i++) {
    plants.push(new Plant());
  }
}

function draw() {
  background(220, 230, 240); // Light sky blue background

  // Draw ground
  fill(139, 69, 19); // Brown color for soil
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Update and display plants
  for (let plant of plants) {
    plant.update();
    plant.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Plant {
  constructor() {
    this.x = random(width);
    this.y = height * 0.7 + random(height * 0.2);
    this.size = random(5, 15);
    this.growthStage = 0;
    this.maxGrowth = random(300, 600);
    this.colorIndex = floor(random(colorPalette.length));
    this.stemColor = color(139, 69, 19); // Brown stem
    this.leafColor = colorPalette[this.colorIndex];
    this.fruitColor = color(255, 0, 0); // Red fruit
    this.hasFruit = false;
    this.age = 0;
  }

  update() {
    this.age++;
    if (this.growthStage < this.maxGrowth) {
      this.growthStage += 0.1;
    }
    if (!this.hasFruit && this.growthStage > this.maxGrowth * 0.7) {
      this.hasFruit = true;
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // Draw stem
    stroke(this.stemColor);
    strokeWeight(2);
    line(0, 0, 0, -this.growthStage * 0.3);

    // Draw leaves
    noStroke();
    fill(this.leafColor);
    for (let i = 0; i < 5; i++) {
      let angle = map(i, 0, 4, -PI/6, PI/6);
      let leafSize = this.size * (1 + sin(frameCount * 0.02 + i)) * 0.5;
      ellipse(
        leafSize * cos(angle),
        -this.growthStage * 0.3 * (1 + sin(frameCount * 0.02 + i)),
        leafSize,
        leafSize * 1.5
      );
    }

    // Draw fruit if mature
    if (this.hasFruit) {
      fill(this.fruitColor);
      noStroke();
      ellipse(0, -this.growthStage * 0.3, this.size * 2, this.size * 2);
    }

    pop();
  }
}
