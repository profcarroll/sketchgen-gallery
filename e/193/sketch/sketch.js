let tree;
let seasonCycle = 0;
let snowflakes = [];
let buds = [];
let flowers = [];
let leaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree(width / 2, height / 2 + 100);
  
  // Initialize snowflakes
  for (let i = 0; i < 500; i++) {
    snowflakes.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(0.5, 2),
      size: random(1, 3)
    });
  }
  
  // Initialize buds
  for (let i = 0; i < 30; i++) {
    buds.push({
      x: random(width),
      y: random(height / 2, height),
      size: random(2, 5),
      bloomTime: random(100, 300)
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue
  
  // Update season cycle
  seasonCycle += 0.002;
  
  // Draw hill
  drawHill();
  
  // Draw tree with seasonal changes
  tree.update(seasonCycle);
  tree.display();
  
  // Snowfall and melting
  drawSnow();
  
  // Flowering and bud growth
  drawBudsAndFlowers();
}

function drawHill() {
  noStroke();
  fill(34, 139, 34); // Green hill
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 20) {
    let y = height - 50 + sin(x * 0.01 + seasonCycle) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawSnow() {
  // Snow accumulation
  if (seasonCycle > 0.8 && seasonCycle < 1.0) {
    fill(255);
    noStroke();
    for (let i = 0; i < 50; i++) {
      let x = random(width);
      let y = random(height / 2, height);
      ellipse(x, y, 3, 3);
    }
  }
  
  // Snowfall
  if (seasonCycle > 0.7 && seasonCycle < 0.9) {
    for (let flake of snowflakes) {
      flake.y += flake.speed;
      if (flake.y > height) {
        flake.y = random(-20, -5);
        flake.x = random(width);
      }
      fill(255);
      noStroke();
      ellipse(flake.x, flake.y, flake.size, flake.size);
    }
  }
}

function drawBudsAndFlowers() {
  if (seasonCycle > 0.9 && seasonCycle < 1.0) {
    // Draw buds
    for (let bud of buds) {
      bud.bloomTime--;
      if (bud.bloomTime <= 0) {
        // Bloom into flower
        fill(255, 105, 180); // Pink
        noStroke();
        ellipse(bud.x, bud.y, 8, 8);
      } else {
        // Draw bud
        fill(139, 69, 19); // Brown
        noStroke();
        ellipse(bud.x, bud.y, 4, 4);
      }
    }
  }
}

class Tree {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.stemHeight = 150;
    this.trunkWidth = 20;
    this.branches = [];
    
    // Create initial branches
    for (let i = 0; i < 8; i++) {
      this.branches.push({
        angle: TWO_PI * i / 8,
        length: random(40, 80),
        thickness: random(3, 6)
      });
    }
  }
  
  update(seasonCycle) {
    // Update leaves based on season
    if (seasonCycle < 0.2) {
      // Spring - new green leaves
      this.leaves = [];
      for (let i = 0; i < 300; i++) {
        this.leaves.push({
          x: random(-100, 100),
          y: random(-100, 50),
          size: random(3, 6),
          color: color(34, 139, 34)
        });
      }
    } else if (seasonCycle < 0.4) {
      // Summer - green leaves
      this.leaves = [];
      for (let i = 0; i < 300; i++) {
        this.leaves.push({
          x: random(-100, 100),
          y: random(-100, 50),
          size: random(3, 6),
          color: color(34, 139, 34)
        });
      }
    } else if (seasonCycle < 0.6) {
      // Autumn - red/orange leaves
      this.leaves = [];
      for (let i = 0; i < 300; i++) {
        this.leaves.push({
          x: random(-100, 100),
          y: random(-100, 50),
          size: random(3, 6),
          color: color(random(200, 255), random(50, 150), 0)
        });
      }
    } else if (seasonCycle < 0.8) {
      // Winter - bare branches
      this.leaves = [];
    } else {
      // Spring again - buds and flowers
      this.leaves = [];
    }
  }
  
  display() {
    // Draw trunk
    fill(139, 69, 19); // Brown trunk
    rectMode(CENTER);
    rect(this.x, this.y, this.trunkWidth, this.stemHeight);
    
    // Draw branches
    stroke(139, 69, 19);
    strokeWeight(2);
    noFill();
    for (let branch of this.branches) {
      push();
      translate(this.x, this.y);
      rotate(branch.angle);
      line(0, 0, 0, -branch.length);
      pop();
    }
    
    // Draw leaves
    if (this.leaves && this.leaves.length > 0) {
      noStroke();
      for (let leaf of this.leaves) {
        fill(leaf.color);
        ellipse(this.x + leaf.x, this.y + leaf.y, leaf.size, leaf.size);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
