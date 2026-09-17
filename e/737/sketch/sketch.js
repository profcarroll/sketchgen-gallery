let particles = [];
let shards = [];
let tensionLines = [];

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.size = random(5, 15);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 180);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Shard {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(20, 40);
    this.angle = random(TWO_PI);
    this.rotation = random(-0.02, 0.02);
    this.color = color(random(150, 255), random(150, 255), random(255), 200);
  }

  update() {
    this.angle += this.rotation;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size * 0.3);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);

  // Create particles
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }

  // Create shards
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    shards.push(new Shard(x, y));
  }
}

function draw() {
  background(0, 0, 10);

  // Update and display shards
  for (let shard of shards) {
    shard.update();
    shard.display();
  }

  // Reset tension lines
  tensionLines = [];

  // Apply forces from shards to particles
  for (let particle of particles) {
    for (let shard of shards) {
      let force = p5.Vector.sub(shard.pos, particle.pos);
      let distance = force.mag();
      
      if (distance < shard.size * 2 && distance > 0) {
        force.normalize();
        let strength = map(distance, 0, shard.size * 2, 10, 0);
        force.mult(strength);
        particle.applyForce(force);
        
        // Add tension line
        tensionLines.push({
          from: particle.pos,
          to: shard.pos
        });
      }
    }
    
    particle.update();
    particle.display();
  }

  // Draw tension lines
  stroke(255, 100);
  strokeWeight(0.5);
  noFill();
  
  beginShape(LINES);
  for (let line of tensionLines) {
    vertex(line.from.x, line.from.y);
    vertex(line.to.x, line.to.y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
