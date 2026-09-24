let tree;
let leaves = [];
let pollen = [];
let defyingLeaf;
let windForce = 0;
let windDirection = 1;
let windSpeed = 0.02;
let clickEffect = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree();
  
  // Create many leaves
  for (let i = 0; i < 300; i++) {
    leaves.push(new Leaf(random(width), random(height)));
  }
  
  // Create pollen particles
  for (let i = 0; i < 200; i++) {
    pollen.push(new Pollen());
  }
  
  // Create the defiant leaf
  defyingLeaf = new DefyingLeaf(300, 200);
}

function draw() {
  background(180, 200, 230);
  
  // Simulate wind
  windForce += (noise(frameCount * 0.01) - 0.5) * windSpeed;
  windDirection = map(noise(frameCount * 0.005), 0, 1, -1, 1);
  
  // Apply click effect
  if (clickEffect > 0) {
    clickEffect -= 0.05;
  }
  
  // Draw tree and leaves
  tree.display();
  
  // Update and display leaves
  for (let leaf of leaves) {
    leaf.update(windForce, windDirection);
    leaf.display();
  }
  
  // Update and display pollen
  for (let p of pollen) {
    p.update(windForce, windDirection);
    p.display();
  }
  
  // Display the defiant leaf
  defyingLeaf.update(windForce, windDirection, clickEffect);
  defyingLeaf.display();
}

function mousePressed() {
  // Trigger click effect on the defiant leaf
  clickEffect = 1.0;
  // Start audio if needed (but no sound in this sketch)
}

class Tree {
  constructor() {
    this.trunk = { x: width/2, y: height - 50, w: 30, h: 150 };
    this.branches = [];
    
    // Create branches
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, -PI/4, PI/4);
      let length = random(100, 200);
      this.branches.push({
        x: width/2,
        y: height - 50,
        angle: angle,
        length: length,
        thickness: map(length, 100, 200, 8, 3)
      });
    }
  }
  
  display() {
    // Draw trunk
    fill(120, 80, 40);
    rect(this.trunk.x - this.trunk.w/2, this.trunk.y, this.trunk.w, this.trunk.h);
    
    // Draw branches
    stroke(120, 80, 40);
    strokeWeight(3);
    noFill();
    for (let branch of this.branches) {
      push();
      translate(branch.x, branch.y);
      rotate(branch.angle);
      line(0, 0, branch.length, 0);
      pop();
    }
  }
}

class Leaf {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(15, 25);
    this.color = color(random(200, 255), random(100, 180), random(0, 50));
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
  }
  
  update(windForce, windDirection) {
    // Apply gravity
    this.acc.add(0, 0.05);
    
    // Apply wind force
    let wind = createVector(windForce * 0.5, 0);
    wind.rotate(windDirection);
    this.acc.add(wind);
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Apply rotation
    this.rotation += this.rotationSpeed;
    
    // Boundary check (reset if leaves go off screen)
    if (this.pos.y > height + 50) {
      this.pos.y = -50;
      this.pos.x = random(width);
    }
    if (this.pos.x < -50 || this.pos.x > width + 50) {
      this.pos.x = random(width);
      this.pos.y = -50;
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size, this.size * 0.7);
    
    pop();
  }
}

class Pollen {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.size = random(2, 5);
    this.color = color(255, 255, 100);
    this.speed = random(0.5, 1.5);
    this.windOffset = random(TWO_PI);
  }
  
  update(windForce, windDirection) {
    // Apply some drift motion
    let drift = createVector(cos(frameCount * 0.02 + this.windOffset) * 0.3, 
                           sin(frameCount * 0.01 + this.windOffset) * 0.3);
    
    // Apply wind force
    let wind = createVector(windForce * 0.3, 0);
    wind.rotate(windDirection);
    
    this.pos.add(drift);
    this.pos.add(wind.mult(this.speed));
    
    // Reset if off screen
    if (this.pos.y > height + 50) {
      this.pos.y = -50;
      this.pos.x = random(width);
    }
    if (this.pos.x < -50 || this.pos.x > width + 50) {
      this.pos.x = random(width);
      this.pos.y = -50;
    }
  }
  
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

class DefyingLeaf {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = 35;
    this.color = color(255, 100, 0);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.03, 0.03);
    this.originalPos = createVector(x, y);
    this.strength = 1.0;
  }
  
  update(windForce, windDirection, clickEffect) {
    // Apply gravity
    this.acc.add(0, 0.08);
    
    // Apply wind force but resist it slightly
    let wind = createVector(windForce * 0.8, 0);
    wind.rotate(windDirection);
    this.acc.add(wind);
    
    // Add click effect
    if (clickEffect > 0) {
      let dir = p5.Vector.sub(this.originalPos, this.pos);
      dir.normalize();
      dir.mult(clickEffect * 2);
      this.acc.add(dir);
    }
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Apply rotation
    this.rotation += this.rotationSpeed;
    
    // Slowly return to original position
    let dir = p5.Vector.sub(this.originalPos, this.pos);
    if (dir.mag() > 1) {
      dir.normalize();
      dir.mult(0.02);
      this.acc.add(dir);
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size, this.size * 0.8);
    
    // Add a highlight
    fill(255, 200, 100);
    ellipse(-this.size/4, -this.size/4, this.size/3, this.size/3);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
