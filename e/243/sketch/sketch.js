let tree, leaves, snowflakes;
let season = 0; // 0: spring, 1: summer, 2: fall, 3: winter
let time = 0;
let sway = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree();
  leaves = [];
  snowflakes = [];
  
  // Initialize leaves with random positions and colors
  for (let i = 0; i < 200; i++) {
    leaves.push({
      x: random(-100, 100),
      y: random(-200, 200),
      z: random(-50, 50),
      color: color(0, 200, 0),
      size: random(3, 8)
    });
  }
}

function draw() {
  background(135, 206, 235);
  
  // Draw ground
  fill(34, 139, 34);
  noStroke();
  rect(0, height/2, width, height/2);
  
  time += 0.01;
  sway = sin(time) * 0.1;
  
  // Cycle through seasons
  if (frameCount % 600 === 0) {
    season = (season + 1) % 4;
  }
  
  tree.update();
  tree.display();
  
  drawLeaves();
  drawSnow();
}

class Tree {
  constructor() {
    this.trunkHeight = 150;
    this.trunkWidth = 20;
    this.branches = [];
    this.buds = [];
    
    // Initialize branches
    for (let i = 0; i < 8; i++) {
      this.branches.push({
        angle: random(TWO_PI),
        length: random(50, 100),
        width: random(3, 8)
      });
    }
    
    // Initialize buds
    for (let i = 0; i < 30; i++) {
      this.buds.push({
        x: random(-80, 80),
        y: random(-150, -50),
        size: random(2, 5),
        bloomed: false
      });
    }
  }
  
  update() {
    // Animate buds
    for (let bud of this.buds) {
      if (!bud.bloomed && season === 0) {
        if (random() < 0.01) {
          bud.bloomed = true;
        }
      } else if (bud.bloomed && season === 0) {
        bud.bloomed = false;
      }
    }
  }
  
  display() {
    // Draw trunk
    push();
    translate(0, height/2 - this.trunkHeight/2);
    rotate(sway);
    
    fill(139, 69, 19);
    rect(-this.trunkWidth/2, 0, this.trunkWidth, this.trunkHeight);
    
    // Draw branches
    for (let branch of this.branches) {
      push();
      rotate(branch.angle);
      stroke(139, 69, 19);
      strokeWeight(branch.width);
      line(0, 0, branch.length, 0);
      pop();
    }
    
    // Draw leaves and buds
    for (let bud of this.buds) {
      if (bud.bloomed) {
        fill(255, 182, 193); // pink flowers
        noStroke();
        ellipse(bud.x, bud.y, bud.size * 2);
      } else {
        // Draw buds in spring
        fill(107, 142, 35); // green buds
        noStroke();
        ellipse(bud.x, bud.y, bud.size);
      }
    }
    
    pop();
  }
}

function drawLeaves() {
  for (let leaf of leaves) {
    push();
    
    // Apply seasonal color changes
    if (season === 0) { // Spring - green buds
      leaf.color = color(107, 142, 35);
    } else if (season === 1) { // Summer - green
      leaf.color = color(0, 200, 0);
    } else if (season === 2) { // Fall - red/orange
      leaf.color = color(255, 140, 0); // orange
    } else if (season === 3) { // Winter - brown
      leaf.color = color(101, 67, 33);
    }
    
    fill(leaf.color);
    noStroke();
    ellipse(leaf.x, leaf.y, leaf.size);
    
    pop();
  }
}

function drawSnow() {
  if (season === 3) { // Winter
    // Add new snowflakes occasionally
    if (random() < 0.1) {
      snowflakes.push({
        x: random(width),
        y: -10,
        size: random(2, 6),
        speed: random(0.5, 1.5)
      });
    }
    
    // Update and draw snowflakes
    for (let i = snowflakes.length - 1; i >= 0; i--) {
      let flake = snowflakes[i];
      
      flake.y += flake.speed;
      flake.x += sin(flake.y * 0.02) * 0.5;
      
      if (flake.y > height) {
        snowflakes.splice(i, 1);
      } else {
        fill(255);
        noStroke();
        ellipse(flake.x, flake.y, flake.size);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
