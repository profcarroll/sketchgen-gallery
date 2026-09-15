let connections = [];
let particles = [];
let trails = [];
let time = 0;

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.prevPos = this.pos.copy();
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(255), 200);
  }

  update() {
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < -width/2 || this.pos.x > width/2) this.vel.x *= -1;
    if (this.pos.y < -height/2 || this.pos.y > height/2) this.vel.y *= -1;
    if (this.pos.z < -200 || this.pos.z > 200) this.vel.z *= -1;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size);
    pop();
  }
}

class Connection {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = p5.Vector.dist(p1.pos, p2.pos);
    this.segments = [];
    this.initSegments();
  }

  initSegments() {
    let dir = p5.Vector.sub(this.p2.pos, this.p1.pos);
    let steps = ceil(dir.mag() / 10);
    dir.normalize().mult(10);
    
    for (let i = 0; i < steps; i++) {
      this.segments.push({
        pos: p5.Vector.add(this.p1.pos, dir.copy().mult(i)),
        size: random(1, 3)
      });
    }
  }

  update() {
    let newLength = p5.Vector.dist(this.p1.pos, this.p2.pos);
    if (abs(newLength - this.length) > 20) {
      // Trigger energy discharge
      this.discharge();
      this.length = newLength;
      this.initSegments();
    }
  }

  discharge() {
    let pos = p5.Vector.lerp(this.p1.pos, this.p2.pos, random());
    trails.push({
      pos: pos.copy(),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      life: 1,
      color: color(random(200, 255), random(100, 200), random(200, 255), 200)
    });
  }

  display() {
    strokeWeight(1);
    noFill();
    
    // Draw pulsing glow
    let pulse = sin(time * 0.01) * 0.3 + 0.7;
    stroke(red(this.p1.color), green(this.p1.color), blue(this.p1.color), 150 * pulse);
    
    beginShape();
    for (let seg of this.segments) {
      vertex(seg.pos.x, seg.pos.y, seg.pos.z);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-200, 200);
    particles.push(new Particle(x, y, z));
  }
  
  // Create connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = p5.Vector.dist(particles[i].pos, particles[j].pos);
      if (d < 150) {
        connections.push(new Connection(particles[i], particles[j]));
      }
    }
  }
  
  colorMode(HSB, 255);
}

function draw() {
  background(0, 0, 0, 30);
  time++;
  
  // Camera movement
  let camX = sin(time * 0.001) * width/4;
  let camY = cos(time * 0.001) * height/4;
  camera(camX, camY, (height/2) / tan(PI/6), 
         0, 0, 0, 
         0, 1, 0);
  
  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Update and display connections
  for (let c of connections) {
    c.update();
    c.display();
  }
  
  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.pos.add(t.vel);
    t.life -= 0.01;
    
    if (t.life <= 0) {
      trails.splice(i, 1);
    } else {
      push();
      translate(t.pos.x, t.pos.y, t.pos.z);
      noStroke();
      fill(t.color);
      sphere(3 * t.life);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
