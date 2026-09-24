let gears = [];
let bubbles = [];
let droplets = [];
let iceChunks = [];
let waterLevel = 0;
let steamParticles = [];

class Gear {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = 0;
    this.teeth = [];
    this.generateTeeth();
  }

  generateTeeth() {
    const toothCount = Math.floor(this.radius / 3);
    for (let i = 0; i < toothCount; i++) {
      const angle = (i / toothCount) * TWO_PI;
      const toothX = this.x + cos(angle) * this.radius;
      const toothY = this.y + sin(angle) * this.radius;
      this.teeth.push({ x: toothX, y: toothY });
    }
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    stroke(100, 80, 40);
    strokeWeight(2);
    noFill();
    circle(0, 0, this.radius * 2);

    // Draw teeth
    for (let tooth of this.teeth) {
      const angle = atan2(tooth.y - this.y, tooth.x - this.x);
      push();
      translate(tooth.x - this.x, tooth.y - this.y);
      rotate(angle);
      rect(0, -1, 3, 2);
      pop();
    }

    pop();
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speed = random(0.5, 1.5);
    this.life = 255;
  }

  update() {
    this.y -= this.speed;
    this.life -= 2;
    this.size += 0.05;
  }

  display() {
    noStroke();
    fill(200, 220, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }
}

class Droplet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.speed = random(0.5, 1.5);
    this.life = 255;
  }

  update() {
    this.y += this.speed;
    this.x += random(-0.5, 0.5);
    this.life -= 2;
  }

  display() {
    noStroke();
    fill(180, 200, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }
}

class IceChunk {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 40);
    this.speed = random(0.1, 0.3);
    this.life = 255;
  }

  update() {
    this.size -= this.speed;
    this.life -= 1;
  }

  display() {
    noStroke();
    fill(200, 220, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }
}

class SteamParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.speed = random(0.5, 2);
    this.life = random(100, 200);
  }

  update() {
    this.y -= this.speed;
    this.x += random(-0.5, 0.5);
    this.life -= 2;
    this.size *= 0.98;
  }

  display() {
    noStroke();
    fill(240, 240, 240, this.life);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create gears
  gears.push(new Gear(width / 2, height / 2 - 100, 60, 0.03));
  gears.push(new Gear(width / 2, height / 2 + 100, 40, -0.05));
  gears.push(new Gear(width / 2 - 150, height / 2, 30, 0.07));

  // Initialize water level
  waterLevel = height / 2;
}

function draw() {
  background(200, 220, 255);

  // Draw a large container for the water
  fill(180, 200, 255);
  noStroke();
  rect(0, waterLevel, width, height - waterLevel);

  // Update and draw gears
  for (let gear of gears) {
    gear.update();
    gear.display();
  }

  // Draw connection lines between gears
  stroke(100, 80, 40);
  strokeWeight(2);
  line(gears[0].x, gears[0].y, gears[1].x, gears[1].y);
  line(gears[1].x, gears[1].y, gears[2].x, gears[2].y);

  // Simulate boiling water
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 3; i++) {
      bubbles.push(new Bubble(random(width / 2 - 50, width / 2 + 50), waterLevel));
    }
  }

  // Update and display bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].life <= 0) {
      bubbles.splice(i, 1);
    }
  }

  // Add steam particles
  if (frameCount % 5 === 0) {
    for (let i = 0; i < 2; i++) {
      steamParticles.push(new SteamParticle(width / 2, waterLevel - 10));
    }
  }

  // Update and display steam particles
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    steamParticles[i].update();
    steamParticles[i].display();
    if (steamParticles[i].life <= 0) {
      steamParticles.splice(i, 1);
    }
  }

  // Add ice chunks
  if (frameCount % 30 === 0 && iceChunks.length < 5) {
    iceChunks.push(new IceChunk(random(width / 2 - 80, width / 2 + 80), height / 4));
  }

  // Update and display ice chunks
  for (let i = iceChunks.length - 1; i >= 0; i--) {
    iceChunks[i].update();
    iceChunks[i].display();
    if (iceChunks[i].life <= 0) {
      iceChunks.splice(i, 1);
    }
  }

  // Add droplets when ice melts
  if (frameCount % 20 === 0 && iceChunks.length > 0) {
    for (let chunk of iceChunks) {
      droplets.push(new Droplet(chunk.x, chunk.y));
    }
  }

  // Update and display droplets
  for (let i = droplets.length - 1; i >= 0; i--) {
    droplets[i].update();
    droplets[i].display();
    if (droplets[i].life <= 0) {
      droplets.splice(i, 1);
    }
  }

  // Simulate increasing water level due to boiling
  if (frameCount % 2 === 0) {
    waterLevel -= 0.5;
    if (waterLevel < height / 2 - 50) {
      waterLevel = height / 2 - 50;
    }
  }

  // Add more bubbles as the water gets hotter
  if (frameCount % 8 === 0 && random() > 0.7) {
    bubbles.push(new Bubble(random(width / 2 - 50, width / 2 + 50), waterLevel));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
