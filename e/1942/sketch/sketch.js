let gears = [];
let cams = [];
let brushSize = 1;
let particles = [];
let particleSystem;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gears and cams
  for (let i = 0; i < 5; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      radius: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02)
    });
  }
  
  for (let i = 0; i < 3; i++) {
    cams.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      radius: random(15, 30),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
  
  // Create particles for sanding effect
  particleSystem = new ParticleSystem(2000);
}

function draw() {
  background(0);
  
  // Update and display gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y);
    rotateZ(gear.rotation);
    
    stroke(100, 30, 90);
    noFill();
    strokeWeight(2);
    
    // Draw gear teeth
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI * i / 12;
      let x1 = cos(angle) * gear.radius;
      let y1 = sin(angle) * gear.radius;
      let x2 = cos(angle) * (gear.radius - 15);
      let y2 = sin(angle) * (gear.radius - 15);
      
      vertex(x1, y1);
      vertex(x2, y2);
    }
    endShape();
    
    // Draw gear circle
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    pop();
  }
  
  // Update and display cams
  for (let cam of cams) {
    cam.rotation += cam.speed;
    
    push();
    translate(cam.x, cam.y);
    rotateZ(cam.rotation);
    
    stroke(100, 30, 90);
    noFill();
    strokeWeight(2);
    
    // Draw cam profile
    beginShape();
    for (let i = 0; i < 30; i++) {
      let angle = TWO_PI * i / 30;
      let r = cam.radius + sin(angle * 3) * 10;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
  
  // Simulate sanding effect by removing particles
  particleSystem.updateAndDisplay();
}

class ParticleSystem {
  constructor(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-500, 500),
        size: random(0.5, 3),
        age: 0,
        maxAge: random(100, 300)
      });
    }
  }
  
  updateAndDisplay() {
    // Batch all particle drawing into one shape
    beginShape(POINTS);
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      // Apply motion from gears and cams
      let dx = 0;
      let dy = 0;
      
      for (let gear of gears) {
        let d = dist(p.x, p.y, gear.x, gear.y);
        if (d < gear.radius * 2) {
          let angle = atan2(p.y - gear.y, p.x - gear.x);
          dx += cos(angle) * 0.5;
          dy += sin(angle) * 0.5;
        }
      }
      
      for (let cam of cams) {
        let d = dist(p.x, p.y, cam.x, cam.y);
        if (d < cam.radius * 3) {
          let angle = atan2(p.y - cam.y, p.x - cam.x);
          dx += cos(angle) * 0.8;
          dy += sin(angle) * 0.8;
        }
      }
      
      // Update particle position
      p.x += dx;
      p.y += dy;
      p.age++;
      
      // Reset particles that go off screen or are too old
      if (abs(p.x) > width/2 + 100 || abs(p.y) > height/2 + 100 || p.age > p.maxAge) {
        p.x = random(-width/2, width/2);
        p.y = random(-height/2, height/2);
        p.z = random(-500, 500);
        p.age = 0;
      }
      
      // Add vertex to batched shape
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
