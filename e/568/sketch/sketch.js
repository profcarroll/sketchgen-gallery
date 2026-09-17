let particles = [];
let fields = [];
let connections = [];

const PARTICLE_COUNT = 200;
const FIELD_COUNT = 5;
const CONNECTION_THRESHOLD = 100;
const CONNECTION_SNAP_DISTANCE = 30;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 180);
  }

  update() {
    this.pos.add(this.vel);
    
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    
    // Slowly drift with field
    for (let field of fields) {
      let d = dist(this.pos.x, this.pos.y, field.pos.x, field.pos.y);
      if (d < field.size) {
        let force = p5.Vector.sub(field.pos, this.pos);
        force.normalize();
        force.mult(0.05);
        this.vel.add(force);
      }
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Field {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.size = random(100, 200);
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.5));
    this.color = color(random(100, 200), random(100, 200), random(200, 255), 30);
  }

  update() {
    this.pos.add(this.vel);
    
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
  
  for (let i = 0; i < FIELD_COUNT; i++) {
    fields.push(new Field());
  }
}

function draw() {
  background(10, 10, 30);
  
  // Update and display fields
  for (let field of fields) {
    field.update();
    field.display();
  }
  
  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
  
  // Connect nearby particles
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].pos.x, particles[i].pos.y,
        particles[j].pos.x, particles[j].pos.y
      );
      
      if (d < CONNECTION_THRESHOLD) {
        connections.push({
          p1: particles[i],
          p2: particles[j],
          distance: d
        });
      }
    }
  }
  
  // Draw connections with snapping effect
  beginShape(LINES);
  for (let conn of connections) {
    let alpha = map(conn.distance, 0, CONNECTION_SNAP_DISTANCE, 255, 0);
    if (alpha > 0) {
      stroke(200, 200, 255, alpha * 0.7);
      
      // Snap effect when particles are very close
      if (conn.distance < CONNECTION_SNAP_DISTANCE) {
        strokeWeight(map(conn.distance, 0, CONNECTION_SNAP_DISTANCE, 3, 0.5));
        vertex(conn.p1.pos.x, conn.p1.pos.y);
        vertex(conn.p2.pos.x, conn.p2.pos.y);
      } else {
        strokeWeight(0.5);
        vertex(conn.p1.pos.x, conn.p1.pos.y);
        vertex(conn.p2.pos.x, conn.p2.pos.y);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
