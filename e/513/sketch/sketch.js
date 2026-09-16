let tree;
let seasonCycle = 0;
let snowFall = [];
let snowMelt = 0;
let buds = [];
let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree = new Tree();
  
  // Initialize snowflakes
  for (let i = 0; i < 200; i++) {
    snowFall.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(1, 3),
      size: random(2, 6)
    });
  }
  
  // Initialize buds
  for (let i = 0; i < 50; i++) {
    buds.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(3, 8),
      growth: 0,
      maxGrowth: random(100, 200)
    });
  }
}

function draw() {
  // Update season cycle (0 = green, 1 = red/orange, 2 = fall, 3 = snow, 4 = melt, 5 = buds, 6 = flowers, 7 = green)
  seasonCycle += 0.002;
  if (seasonCycle > 8) seasonCycle = 0;
  
  // Background gradient
  let bg = lerpColor(color(135, 206, 235), color(25, 25, 112), sin(frameCount * 0.01) * 0.5 + 0.5);
  background(bg);
  
  // Draw hillside
  drawHill();
  
  // Draw snow if in snow phase
  if (seasonCycle >= 3 && seasonCycle < 4) {
    drawSnow();
  }
  
  // Update and draw tree
  tree.update();
  tree.draw();
  
  // Draw buds if in bud phase
  if (seasonCycle >= 5 && seasonCycle < 6) {
    drawBuds();
  }
  
  // Draw flowers if in flower phase
  if (seasonCycle >= 6 && seasonCycle < 7) {
    drawFlowers();
  }
  
  // Melt snow if in melt phase
  if (seasonCycle >= 4 && seasonCycle < 5) {
    snowMelt += 0.02;
  }
  
  // Update snowflakes
  for (let s of snowFall) {
    s.y += s.speed;
    if (s.y > height) {
      s.y = random(-20, 0);
      s.x = random(width);
    }
  }
}

function drawHill() {
  noStroke();
  fill(34, 139, 34); // Green hill
  beginShape();
  for (let i = 0; i <= width; i += 20) {
    let y = height * 0.7 + sin(i * 0.01 + frameCount * 0.005) * 20;
    vertex(i, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawSnow() {
  noStroke();
  fill(255);
  for (let s of snowFall) {
    ellipse(s.x, s.y, s.size, s.size);
  }
  
  // Draw snow on ground
  fill(240);
  beginShape();
  vertex(0, height);
  for (let i = 0; i <= width; i += 10) {
    let y = height - 5 + sin(i * 0.02 + frameCount * 0.01) * 3;
    vertex(i, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawBuds() {
  noStroke();
  for (let bud of buds) {
    if (bud.growth < bud.maxGrowth) {
      bud.growth += 0.5;
    }
    let size = map(bud.growth, 0, bud.maxGrowth, 0, bud.size);
    fill(255, 182, 193); // Pink buds
    ellipse(bud.x, bud.y, size, size);
  }
}

function drawFlowers() {
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let size = random(5, 10);
    fill(random(255), random(100, 255), random(100, 255)); // Random flower colors
    ellipse(x, y, size, size);
  }
}

class Tree {
  constructor() {
    this.trunkHeight = 150;
    this.trunkWidth = 20;
    this.leafSize = 80;
    this.leafCount = 30;
    this.leaves = [];
    this.branches = [];
    
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push({
        x: random(-this.leafSize, this.leafSize),
        y: random(-this.leafSize, this.leafSize),
        size: random(10, 20),
        color: color(0, 100, 0)
      });
    }
    
    // Initialize branches
    for (let i = 0; i < 8; i++) {
      this.branches.push({
        angle: random(TWO_PI),
        length: random(50, 100),
        thickness: random(3, 6)
      });
    }
  }
  
  update() {
    // Update seasonal colors
    if (seasonCycle < 1) {
      // Spring to summer green
      this.leafColor = color(34, 139, 34);
    } else if (seasonCycle < 2) {
      // Fall transition
      let r = map(seasonCycle, 1, 2, 34, 255);
      let g = map(seasonCycle, 1, 2, 139, 100);
      let b = map(seasonCycle, 1, 2, 34, 0);
      this.leafColor = color(r, g, b);
    } else if (seasonCycle < 3) {
      // Fall leaves
      this.leafColor = color(255, 69, 0); // Orange-red
    } else if (seasonCycle < 4) {
      // Snow phase - no leaves, just trunk and branches
      this.leafColor = color(255);
    } else if (seasonCycle < 5) {
      // Melt snow
      this.leafColor = color(100);
    } else if (seasonCycle < 6) {
      // Bud phase
      this.leafColor = color(255, 182, 193); // Pink buds
    } else if (seasonCycle < 7) {
      // Flower phase
      this.leafColor = color(255);
    } else {
      // Back to green
      this.leafColor = color(34, 139, 34);
    }
  }
  
  draw() {
    push();
    translate(width / 2, height * 0.8);
    
    // Draw trunk
    fill(101, 67, 33);
    rect(-this.trunkWidth/2, 0, this.trunkWidth, this.trunkHeight);
    
    // Draw branches
    stroke(101, 67, 33);
    strokeWeight(2);
    for (let branch of this.branches) {
      push();
      rotate(branch.angle);
      line(0, 0, branch.length, 0);
      pop();
    }
    
    // Draw leaves
    if (seasonCycle < 3 || seasonCycle >= 4) {
      noStroke();
      fill(this.leafColor);
      for (let leaf of this.leaves) {
        ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
      }
    }
    
    pop();
  }
}
