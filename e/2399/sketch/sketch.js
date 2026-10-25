let crystals = [];
let particles = [];

class Crystal {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(30, 80);
    this.age = 0;
    this.maxAge = random(400, 800);
    this.growthRate = random(0.05, 0.15);
    this.stress = 0;
    this.shards = [];
    this.createShards();
  }
  
  createShards() {
    let shardCount = floor(random(8, 20));
    for (let i = 0; i < shardCount; i++) {
      let angle = random(TWO_PI);
      let distance = random(this.size * 0.3, this.size * 0.8);
      let shard = {
        pos: createVector(
          this.pos.x + cos(angle) * distance,
          this.pos.y + sin(angle) * distance
        ),
        vel: p5.Vector.random2D().mult(random(0.5, 3)),
        size: random(3, 12),
        life: random(80, 200),
        color: color(180, 70, 80, 180)
      };
      this.shards.push(shard);
    }
  }
  
  update() {
    this.age++;
    this.stress = sin(this.age * 0.03) * 0.5 + 0.5;
    
    // Update shards
    for (let i = this.shards.length - 1; i >= 0; i--) {
      let shard = this.shards[i];
      shard.pos.add(shard.vel);
      shard.vel.mult(0.93);
      shard.life--;
      
      if (shard.life <= 0) {
        this.shards.splice(i, 1);
      }
    }
    
    // Occasionally add new shards to simulate decay
    if (random() < 0.03 && this.shards.length < 40) {
      let angle = random(TWO_PI);
      let distance = random(this.size * 0.3, this.size * 0.8);
      let shard = {
        pos: createVector(
          this.pos.x + cos(angle) * distance,
          this.pos.y + sin(angle) * distance
        ),
        vel: p5.Vector.random2D().mult(random(0.5, 3)),
        size: random(3, 12),
        life: random(80, 200),
        color: color(180, 70, 80, 180)
      };
      this.shards.push(shard);
    }
    
    // Occasionally remove shards to simulate rebirth
    if (this.shards.length > 30 && random() < 0.015) {
      this.shards.splice(0, 1);
    }
    
    // Create particles when stress is high
    if (random() < 0.04) {
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(this.pos.x, this.pos.y));
      }
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw main crystal structure
    noFill();
    stroke(180, 70, 80, 180);
    strokeWeight(1.5);
    
    // Draw a growing hexagonal crystal
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let x = cos(angle) * this.size * (0.9 + this.stress * 0.15);
      let y = sin(angle) * this.size * (0.9 + this.stress * 0.15);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw stress fractures
    stroke(255, 255, 255, 40);
    strokeWeight(0.8);
    for (let i = 0; i < 6; i++) {
      if (random() < 0.4) {
        let angle1 = TWO_PI * i / 6;
        let angle2 = TWO_PI * (i + 1) / 6;
        let x1 = cos(angle1) * this.size * 0.9;
        let y1 = sin(angle1) * this.size * 0.9;
        let x2 = cos(angle2) * this.size * 0.9;
        let y2 = sin(angle2) * this.size * 0.9;
        line(x1, y1, x2, y2);
      }
    }
    
    // Draw shards
    for (let i = 0; i < this.shards.length; i++) {
      let shard = this.shards[i];
      noStroke();
      fill(red(shard.color), green(shard.color), blue(shard.color), shard.life * 1.2);
      ellipse(shard.pos.x, shard.pos.y, shard.size);
    }
    
    pop();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 3));
    this.life = 150;
    this.size = random(1, 4);
    this.color = color(180, 70, 80, 180);
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.96);
    this.life--;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life * 1.2);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial crystals
  for (let i = 0; i < 25; i++) {
    let x = random(width);
    let y = random(height);
    crystals.push(new Crystal(x, y));
  }
}

function draw() {
  background(22, 10, 25);
  
  // Draw subtle gradient background
  for (let i = 0; i < height; i += 25) {
    let alpha = map(i, 0, height, 15, 60);
    stroke(40, 20, 50, alpha);
    line(0, i, width, i);
  }
  
  // Update and display crystals
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    crystal.update();
    crystal.display();
    
    // Occasionally add new crystals to simulate growth
    if (random() < 0.0015 && crystals.length < 40) {
      let x = random(width);
      let y = random(height);
      crystals.push(new Crystal(x, y));
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
  
  // Remove old crystals
  if (crystals.length > 40) {
    crystals.shift();
  }
}

function mousePressed() {
  // Trigger a stress wave by adjusting all crystals
  for (let i = 0; i < crystals.length; i++) {
    crystals[i].size *= random(0.9, 1.1);
    crystals[i].growthRate += random(-0.05, 0.05);
  }
}
