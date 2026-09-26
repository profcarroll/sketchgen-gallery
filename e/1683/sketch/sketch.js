let tree;
let leaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree();
  
  // Create many leaves
  for (let i = 0; i < 300; i++) {
    leaves.push(new Leaf(random(width), random(height)));
  }
}

function draw() {
  background(180, 200, 230);
  
  // Draw tree and leaves
  tree.display();
  
  // Update and display leaves
  for (let leaf of leaves) {
    leaf.update();
    leaf.display();
  }
}

class Tree {
  constructor() {
    this.trunk = { x: width/2, y: height - 50, w: 30, h: 150 };
    this.branches = [];
    
    // Create branches with more intricate detail
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 12, -PI/3, PI/3);
      let length = random(80, 180);
      this.branches.push({
        x: width/2,
        y: height - 50,
        angle: angle,
        length: length,
        thickness: map(length, 80, 180, 6, 2)
      });
    }
  }
  
  display() {
    // Draw trunk
    fill(120, 80, 40);
    rect(this.trunk.x - this.trunk.w/2, this.trunk.y, this.trunk.w, this.trunk.h);
    
    // Draw branches with more detail
    stroke(120, 80, 40);
    strokeWeight(3);
    noFill();
    for (let branch of this.branches) {
      push();
      translate(branch.x, branch.y);
      rotate(branch.angle);
      
      // Add more intricate branching
      let segments = 3;
      for (let i = 0; i < segments; i++) {
        let segLength = branch.length / segments;
        let segX = i * segLength;
        line(segX, 0, segX + segLength, 0);
        
        // Add smaller branches
        if (i < segments - 1) {
          let subAngle = random(-PI/6, PI/6);
          push();
          translate(segX + segLength/2, 0);
          rotate(subAngle);
          line(0, 0, 30, 0);
          pop();
        }
      }
      
      pop();
    }
  }
}

class Leaf {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(12, 20);
    // Muted autumnal colors
    let r = random(200, 255);
    let g = random(80, 160);
    let b = random(0, 50);
    this.color = color(r, g, b);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.03, 0.03);
    this.wobble = random(TWO_PI);
    this.wobbleSpeed = random(0.02, 0.05);
    this.spiral = random(TWO_PI);
    this.spiralSpeed = random(0.01, 0.03);
  }
  
  update() {
    // Apply gravity
    this.acc.add(0, 0.05);
    
    // Add gentle spiral movement
    this.spiral += this.spiralSpeed;
    let spiralForce = createVector(cos(this.spiral) * 0.02, sin(this.spiral) * 0.02);
    this.acc.add(spiralForce);
    
    // Add some wobble for natural movement
    this.wobble += this.wobbleSpeed;
    
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
    
    // Add wobble effect
    let wobbleOffset = sin(this.wobble) * 0.2;
    translate(wobbleOffset, 0);
    
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size, this.size * 0.7);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
