let ants = [];
let foodSources = [];
let particles = [];
let tunnels = [];
let tunnelNetwork;
let noiseScale = 0.02;
let noiseStrength = 5;

function setup() {
  createCanvas(400, 400);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create tunnel network
  createTunnelNetwork();

  // Initialize ants
  for (let i = 0; i < 20; i++) {
    ants.push(new Ant(random(width), random(height)));
  }

  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(30, 10, 90);

  // Draw tunnels
  drawTunnels();

  // Update and draw ants
  for (let ant of ants) {
    ant.update();
    ant.display();
  }

  // Update and draw particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Draw food sources
  for (let food of foodSources) {
    food.display();
  }
}

function createTunnelNetwork() {
  tunnelNetwork = [];
  let segments = 100;
  let start = createVector(width / 2, height / 2);
  let current = start.copy();

  for (let i = 0; i < segments; i++) {
    let angle = noise(current.x * noiseScale, current.y * noiseScale) * TWO_PI * 2;
    let step = p5.Vector.fromAngle(angle).mult(noiseStrength);
    current.add(step);

    // Keep within bounds
    current.x = constrain(current.x, 0, width);
    current.y = constrain(current.y, 0, height);

    tunnelNetwork.push(current.copy());
  }

  // Add some branching
  for (let i = 0; i < 5; i++) {
    let branchStart = random(tunnelNetwork);
    let branchLength = random(30, 100);
    let angle = random(TWO_PI);
    let branchEnd = branchStart.copy().add(createVector(cos(angle) * branchLength, sin(angle) * branchLength));
    
    // Keep within bounds
    branchEnd.x = constrain(branchEnd.x, 0, width);
    branchEnd.y = constrain(branchEnd.y, 0, height);

    tunnelNetwork.push(branchEnd);
  }
}

function drawTunnels() {
  stroke(30, 20, 70);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let v of tunnelNetwork) {
    vertex(v.x, v.y);
  }
  endShape();
}

class Ant {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 1));
    this.size = random(3, 5);
    this.hue = random(10, 30); // Ant color range
  }

  update() {
    // Simple wandering behavior
    let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI;
    let target = p5.Vector.fromAngle(angle).mult(0.5);
    this.vel.add(target);
    this.vel.limit(2);

    // Update position
    this.pos.add(this.vel);

    // Boundary check
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.vel.mult(-1);
    }

    // Attract to food
    let closestFood = null;
    let closestDist = Infinity;
    for (let food of foodSources) {
      let dist = this.pos.dist(food.pos);
      if (dist < closestDist && dist < 50) {
        closestDist = dist;
        closestFood = food;
      }
    }

    if (closestFood) {
      let dir = p5.Vector.sub(closestFood.pos, this.pos);
      dir.normalize();
      dir.mult(0.1);
      this.vel.add(dir);
    }
  }

  display() {
    fill(this.hue, 100, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.size = random(1, 3);
    this.life = random(100, 200);
    this.hue = random(30, 40); // Sand color range
  }

  update() {
    this.pos.add(this.vel);
    this.life--;

    if (this.life <= 0 || this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.reset();
    }
  }

  display() {
    fill(this.hue, 20, 90);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function mousePressed() {
  // Drop food at click location
  foodSources.push(new Food(mouseX, mouseY));
  
  // Resume audio context on first interaction
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }
}

class Food {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(8, 12);
    this.hue = random(10, 20); // Bright food color
    this.life = 150;
  }

  display() {
    fill(this.hue, 100, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
