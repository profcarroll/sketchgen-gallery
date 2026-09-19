let particles1 = [];
let particles2 = [];
let numParticles = 150;
let flowField;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push(new Particle(random(width/4), random(height), 1));
    particles2.push(new Particle(random(3*width/4, width), random(height), 2));
  }
  flowField = new FlowField(20);
}

function draw() {
  background(10, 10, 30);
  flowField.update();
  flowField.display();

  // Update and display particles
  for (let i = 0; i < numParticles; i++) {
    particles1[i].update();
    particles1[i].display();
    particles1[i].edges();
    
    particles2[i].update();
    particles2[i].display();
    particles2[i].edges();
  }

  // Apply repulsion between streams
  for (let i = 0; i < numParticles; i++) {
    for (let j = 0; j < numParticles; j++) {
      let d = dist(particles1[i].pos.x, particles1[i].pos.y, 
                   particles2[j].pos.x, particles2[j].pos.y);
      if (d < 80 && d > 0) {
        let force = p5.Vector.sub(particles1[i].pos, particles2[j].pos);
        force.normalize();
        force.mult(0.5);
        particles1[i].applyForce(force);
        particles2[j].applyForce(force.mult(-1));
      }
    }
  }

  // Draw connections between close particles within streams
  stroke(255, 30);
  noFill();
  for (let i = 0; i < numParticles; i++) {
    for (let j = 0; j < numParticles; j++) {
      let d = dist(particles1[i].pos.x, particles1[i].pos.y, 
                   particles1[j].pos.x, particles1[j].pos.y);
      if (d < 50 && i !== j) {
        line(particles1[i].pos.x, particles1[i].pos.y, 
             particles1[j].pos.x, particles1[j].pos.y);
      }
    }
  }
}

class Particle {
  constructor(x, y, streamId) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.acc = createVector(0, 0);
    this.streamId = streamId;
    this.size = random(3, 6);
    this.color = streamId === 1 ? 
      color(random(200, 255), random(50, 150), random(200, 255)) :
      color(random(200, 255), random(100, 200), random(50, 150));
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Apply flow field
    let x = floor(this.pos.x / 20);
    let y = floor(this.pos.y / 20);
    if (x >= 0 && x < flowField.cols && y >= 0 && y < flowField.rows) {
      let force = flowField.field[x][y];
      this.applyForce(force);
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  edges() {
    if (this.pos.x > width + 10) this.pos.x = -10;
    else if (this.pos.x < -10) this.pos.x = width + 10;
    if (this.pos.y > height + 10) this.pos.y = -10;
    else if (this.pos.y < -10) this.pos.y = height + 10;
  }
}

class FlowField {
  constructor(res) {
    this.res = res;
    this.cols = floor(width / res);
    this.rows = floor(height / res);
    this.field = [];
    for (let i = 0; i < this.cols; i++) {
      this.field[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.field[i][j] = p5.Vector.random2D();
        this.field[i][j].mult(random(0.5, 1.5));
      }
    }
  }

  update() {
    let time = millis() * 0.0001;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let angle = noise(i * 0.05, j * 0.05, time) * TWO_PI * 2;
        let v = p5.Vector.fromAngle(angle);
        v.mult(0.5);
        this.field[i][j] = v;
      }
    }
  }

  display() {
    stroke(255, 30);
    noFill();
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        push();
        translate(i * this.res, j * this.res);
        rotate(this.field[i][j].heading());
        line(0, 0, this.res/2, 0);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
