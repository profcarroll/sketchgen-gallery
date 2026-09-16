let rocks = [];
let snowflakes = [];
let avalancheTriggered = false;
let avalancheTime = 0;
let groundLevel;

class Rock {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalY = y;
    this.vx = 0;
    this.vy = 0;
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
    this.color = color(80, 90, 100);
  }

  update() {
    if (avalancheTriggered && millis() > avalancheTime + 500) {
      this.vx += random(-0.1, 0.1);
      this.vy += 0.2;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.color);
    noStroke();
    // Draw jagged rock shape
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let radius = this.size * (0.7 + random(0.3));
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.size = random(1, 3);
    this.speed = random(0.5, 2);
    this.wind = random(-0.5, 0.5);
    this.windSpeed = random(0.01, 0.05);
  }

  update() {
    this.y += this.speed;
    this.x += this.wind;
    this.wind += this.windSpeed;

    if (this.y > height + 10) {
      this.reset();
    }
  }

  display() {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundLevel = height * 0.7;

  // Create background mountains
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let h = random(100, 300);
    let w = random(200, 500);
    let y = groundLevel - h;
    fill(40, 50, 60);
    noStroke();
    triangle(x, groundLevel, x + w/2, y, x + w, groundLevel);
  }

  // Create foreground rocks
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let size = random(10, 40);
    let y = groundLevel - size/2;
    rocks.push(new Rock(x, y, size));
  }

  // Create snowflakes
  for (let i = 0; i < 200; i++) {
    snowflakes.push(new Snowflake());
  }
}

function draw() {
  background(150, 170, 190); // Sky blue

  // Draw distant mist
  fill(200, 220, 240, 80);
  noStroke();
  rect(0, 0, width, height * 0.6);

  // Draw ground
  fill(200, 210, 220);
  rect(0, groundLevel, width, height - groundLevel);

  // Draw snow on ground
  fill(255, 255, 255, 180);
  noStroke();
  for (let i = 0; i < 50; i++) {
    ellipse(random(width), groundLevel + random(-5, 5), random(3, 8));
  }

  // Update and display snowflakes
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }

  // Update and display rocks
  for (let rock of rocks) {
    rock.update();
    rock.display();
  }
}

function mousePressed() {
  if (!avalancheTriggered) {
    avalancheTriggered = true;
    avalancheTime = millis();

    // Create some initial debris from the rocks
    for (let i = 0; i < 20; i++) {
      let rock = rocks[i];
      if (rock) {
        rock.vx = random(-2, 2);
        rock.vy = random(-5, -1);
      }
    }

    // Add more snowflakes for avalanche effect
    for (let i = 0; i < 50; i++) {
      snowflakes.push(new Snowflake());
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundLevel = height * 0.7;
}
