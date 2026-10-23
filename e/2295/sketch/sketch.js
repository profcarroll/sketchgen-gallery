let trees = [];
let particles = [];

class Tree {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.trunkHeight = random(100, 200);
    this.trunkWidth = random(8, 15);
    this.branches = [];
    this.rootSystem = [];
    this.age = 0;
    this.maxAge = random(300, 600);
    
    // Create trunk
    this.createTrunk();
    
    // Create root system
    this.createRoots();
    
    // Create branches
    this.createBranches();
  }
  
  createTrunk() {
    this.trunk = [];
    let segments = floor(random(5, 10));
    for (let i = 0; i < segments; i++) {
      let height = map(i, 0, segments - 1, 0, this.trunkHeight);
      let width = map(i, 0, segments - 1, this.trunkWidth, this.trunkWidth * 0.7);
      this.trunk.push({
        pos: createVector(0, height),
        width: width
      });
    }
  }
  
  createRoots() {
    this.rootSystem = [];
    let rootCount = floor(random(8, 15));
    for (let i = 0; i < rootCount; i++) {
      let root = [];
      let length = random(80, 150);
      let angle = map(i, 0, rootCount - 1, -PI/3, PI/3);
      
      for (let j = 0; j < 10; j++) {
        let t = map(j, 0, 9, 0, length);
        let x = t * cos(angle) + random(-5, 5);
        let y = t * sin(angle) + random(-5, 5);
        root.push(createVector(x, y));
      }
      this.rootSystem.push(root);
    }
  }
  
  createBranches() {
    this.branches = [];
    let branchCount = floor(random(20, 40));
    
    for (let i = 0; i < branchCount; i++) {
      let branch = [];
      let length = random(30, 100);
      let angle = map(i, 0, branchCount - 1, -PI/2, PI/2) + random(-0.5, 0.5);
      
      for (let j = 0; j < 8; j++) {
        let t = map(j, 0, 7, 0, length);
        let x = t * cos(angle) + random(-3, 3);
        let y = t * sin(angle) + random(-3, 3);
        branch.push(createVector(x, y));
      }
      this.branches.push(branch);
    }
  }
  
  update() {
    this.age++;
    
    // Animate stress fractures
    for (let i = 0; i < this.branches.length; i++) {
      let branch = this.branches[i];
      for (let j = 0; j < branch.length; j++) {
        let offset = sin(j * 0.5 + millis() * 0.002 + i) * 0.5;
        branch[j].x += offset;
      }
    }
    
    // Occasionally add new branches to simulate growth
    if (random() < 0.01 && this.branches.length < 60) {
      let length = random(30, 100);
      let angle = random(-PI/2, PI/2);
      let branch = [];
      for (let j = 0; j < 8; j++) {
        let t = map(j, 0, 7, 0, length);
        let x = t * cos(angle) + random(-3, 3);
        let y = t * sin(angle) + random(-3, 3);
        branch.push(createVector(x, y));
      }
      this.branches.push(branch);
    }
    
    // Occasionally remove old branches to simulate decay
    if (this.branches.length > 40 && random() < 0.005) {
      this.branches.splice(0, 1);
    }
    
    // Create particles when stress is high
    if (random() < 0.02) {
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(this.pos.x, this.pos.y));
      }
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw trunk
    noFill();
    stroke(120, 80, 40);
    strokeWeight(2);
    for (let i = 0; i < this.trunk.length - 1; i++) {
      let p1 = this.trunk[i];
      let p2 = this.trunk[i + 1];
      line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
    }
    
    // Draw root system
    stroke(80, 60, 30);
    strokeWeight(1);
    for (let i = 0; i < this.rootSystem.length; i++) {
      let root = this.rootSystem[i];
      beginShape();
      for (let j = 0; j < root.length; j++) {
        vertex(root[j].x, root[j].y);
      }
      endShape();
    }
    
    // Draw branches
    stroke(100, 70, 40);
    strokeWeight(1.5);
    for (let i = 0; i < this.branches.length; i++) {
      let branch = this.branches[i];
      beginShape();
      for (let j = 0; j < branch.length; j++) {
        vertex(branch[j].x, branch[j].y);
      }
      endShape();
    }
    
    // Draw stress fractures
    stroke(255, 255, 255, 30);
    strokeWeight(0.5);
    for (let i = 0; i < this.branches.length; i++) {
      if (random() < 0.1) {
        let branch = this.branches[i];
        let start = branch[0];
        let end = branch[branch.length - 1];
        line(start.x, start.y, end.x, end.y);
      }
    }
    
    pop();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.life = 100;
    this.size = random(1, 3);
    this.color = color(100, 200, 200, 150);
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.life--;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life * 1.5);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Create initial trees
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    trees.push(new Tree(x, y));
  }
}

function draw() {
  background(20, 15, 30);
  
  // Draw subtle gradient background
  for (let i = 0; i < height; i += 20) {
    let alpha = map(i, 0, height, 10, 50);
    stroke(40, 30, 60, alpha);
    line(0, i, width, i);
  }
  
  // Update and display trees
  for (let i = 0; i < trees.length; i++) {
    let tree = trees[i];
    tree.update();
    tree.display();
    
    // Occasionally add new trees to simulate forest growth
    if (random() < 0.0005 && trees.length < 10) {
      let x = random(width);
      let y = random(height);
      trees.push(new Tree(x, y));
    }
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Remove old trees
  if (trees.length > 10) {
    trees.shift();
  }
}

function mousePressed() {
  // Trigger a stress wave by adjusting all trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].trunkHeight *= random(0.9, 1.1);
    trees[i].branchCount += random(-2, 2);
  }
}
