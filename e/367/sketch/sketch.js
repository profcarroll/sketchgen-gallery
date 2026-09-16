let particles = [];
let connections = [];
let crystals = [];
let time = 0;

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.1, 0.5));
    this.size = random(2, 6);
  }

  update() {
    this.pos.add(this.vel);
    // Bounce off bounds
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    if (this.pos.z < -200 || this.pos.z > 200) this.vel.z *= -1;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 200);
    sphere(this.size);
    pop();
  }
}

class Crystal {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(10, 30);
    this.growth = 0;
    this.maxGrowth = random(200, 400);
    this.pulse = 0;
    this.active = true;
  }

  update() {
    if (!this.active) return;

    this.pulse += 0.05;
    this.growth += 1;
    
    if (this.growth > this.maxGrowth) {
      this.active = false;
    }
  }

  display() {
    if (!this.active) return;

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    const pulse = sin(this.pulse) * 0.5 + 0.5;
    fill(255, 150 + pulse * 100, 255, 180);
    
    // Draw a crystalline structure
    for (let i = 0; i < 6; i++) {
      rotate(HALF_PI / 3);
      push();
      scale(1, 1, this.growth / this.maxGrowth);
      cone(this.size * 0.5, this.size);
      pop();
    }
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial particles
  for (let i = 0; i < 200; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-200, 200);
    particles.push(new Particle(x, y, z));
  }

  frameRate(30);
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  rotateX(time * 0.1);
  rotateY(time * 0.2);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Occasionally spawn a crystal
  if (random() < 0.05 && crystals.length < 10) {
    const x = random(-width/3, width/3);
    const y = random(-height/3, height/3);
    const z = random(-100, 100);
    crystals.push(new Crystal(x, y, z));
  }

  // Update and display crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    crystals[i].update();
    crystals[i].display();
    if (!crystals[i].active) {
      crystals.splice(i, 1);
    }
  }

  // Draw connections between nearby particles
  beginShape(LINES);
  noFill();
  stroke(255, 0.3);
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = p5.Vector.dist(particles[i].pos, particles[j].pos);
      if (d < 100) {
        const alpha = map(d, 0, 100, 0.8, 0.05);
        stroke(255, alpha);
        vertex(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z);
        vertex(particles[j].pos.x, particles[j].pos.y, particles[j].pos.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
