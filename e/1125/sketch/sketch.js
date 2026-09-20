let flows = [];
let shards = [];
let tensionLines = [];
let fractalNetworks = [];
let time = 0;

class Flow {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(10, 30);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 150);
    this.trail = [];
    this.maxTrail = 20;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.vel.add(p5.Vector.random2D().mult(0.05));

    // Keep within hexagon
    let hexCenter = createVector(width/2, height/2);
    let distFromCenter = p5.Vector.dist(this.pos, hexCenter);
    if (distFromCenter > width/2 - 30) {
      this.vel.mult(-1);
      this.pos.add(this.vel);
    }

    // Add to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);

    // Draw trail
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 150);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // Draw main flow
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Shard {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.size = random(5, 15);
    this.angle = random(TWO_PI);
    this.rotation = random(-0.05, 0.05);
    this.glow = 0;
    this.maxGlow = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.angle += this.rotation;

    // Keep within hexagon
    let hexCenter = createVector(width/2, height/2);
    let distFromCenter = p5.Vector.dist(this.pos, hexCenter);
    if (distFromCenter > width/2 - 30) {
      this.vel.mult(-1);
      this.pos.add(this.vel);
    }

    // Glow effect
    this.glow = sin(time * 0.02 + this.pos.x * 0.01) * 100 + 100;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    fill(255, 255, 255, this.glow);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size * 2, this.size * 2, 5);

    // Sharp edges
    stroke(255, 255, 255, 200);
    strokeWeight(1);
    line(-this.size, -this.size, this.size, this.size);
    line(this.size, -this.size, -this.size, this.size);

    pop();
  }
}

class TensionLine {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.strength = 0;
  }

  update() {
    let dist = p5.Vector.dist(this.p1.pos, this.p2.pos);
    this.strength = map(dist, 0, width/2, 1, 0.1);
  }

  display() {
    stroke(255, 255, 255, this.strength * 50);
    strokeWeight(this.strength * 2);
    line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
  }
}

class FractalNetwork {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(50, 150);
    this.segments = [];
    this.growth = 0;
    this.maxGrowth = 100;
  }

  update() {
    this.growth = min(this.growth + 0.5, this.maxGrowth);
    
    if (this.growth >= this.maxGrowth) {
      // Create segments
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let segment = createVector(
          this.pos.x + cos(angle) * this.size,
          this.pos.y + sin(angle) * this.size
        );
        this.segments.push(segment);
      }
    }
  }

  display() {
    if (this.growth < this.maxGrowth) {
      stroke(255, 255, 255, map(this.growth, 0, this.maxGrowth, 0, 100));
      strokeWeight(2);
      ellipse(this.pos.x, this.pos.y, this.size * (this.growth / this.maxGrowth));
    } else {
      // Draw fractal structure
      stroke(255, 255, 255, 150);
      strokeWeight(1);
      
      for (let i = 0; i < this.segments.length; i++) {
        let segment = this.segments[i];
        line(this.pos.x, this.pos.y, segment.x, segment.y);
        
        // Add branches
        if (this.growth > this.maxGrowth * 0.8) {
          for (let j = 0; j < 3; j++) {
            let branchAngle = random(-PI/4, PI/4);
            let branchLength = random(20, 50);
            let branchX = segment.x + cos(branchAngle) * branchLength;
            let branchY = segment.y + sin(branchAngle) * branchLength;
            line(segment.x, segment.y, branchX, branchY);
          }
        }
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create flows
  for (let i = 0; i < 15; i++) {
    flows.push(new Flow());
  }

  // Create shards
  for (let i = 0; i < 8; i++) {
    shards.push(new Shard());
  }
}

function draw() {
  background(0);
  time++;
  
  // Draw hexagon
  noFill();
  stroke(255, 100, 100, 50);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = width/2 + cos(angle) * (width/2 - 20);
    let y = height/2 + sin(angle) * (height/2 - 20);
    vertex(x, y);
  }
  endShape(CLOSE);

  // Update and display flows
  for (let flow of flows) {
    flow.update();
    flow.display();
  }

  // Update and display shards
  for (let shard of shards) {
    shard.update();
    shard.display();
  }

  // Create tension lines between nearby flows
  tensionLines = [];
  for (let i = 0; i < flows.length; i++) {
    for (let j = i + 1; j < flows.length; j++) {
      let dist = p5.Vector.dist(flows[i].pos, flows[j].pos);
      if (dist < 150) {
        tensionLines.push(new TensionLine(flows[i], flows[j]));
      }
    }
  }

  for (let line of tensionLines) {
    line.update();
    line.display();
  }

  // Create fractal networks
  if (time % 300 === 0 && fractalNetworks.length < 5) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    fractalNetworks.push(new FractalNetwork(x, y));
  }

  for (let network of fractalNetworks) {
    network.update();
    network.display();
  }

  // Occasionally create new shards
  if (time % 500 === 0 && shards.length < 20) {
    shards.push(new Shard());
  }

  // Occasionally create new flows
  if (time % 400 === 0 && flows.length < 30) {
    flows.push(new Flow());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
