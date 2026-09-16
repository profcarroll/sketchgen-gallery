let pyramids = [];
let residueParticles = [];
let current;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create pyramidal structures
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let size = random(30, 80);
    pyramids.push({
      x,
      y: height/2,
      z,
      size,
      h: random(100, 200),
      rot: random(TWO_PI)
    });
  }

  // Initialize residue particles
  for (let i = 0; i < 500; i++) {
    residueParticles.push({
      x: random(-width/2, width/2),
      y: height/2 + random(100),
      z: random(-height/2, height/2),
      size: random(1, 4),
      speed: random(0.5, 2),
      hue: random(180, 240),
      sat: random(70, 100),
      bri: random(80, 100),
      life: 1,
      decay: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);

  // Simulate deep-sea current
  let time = millis() * 0.0002;
  let currentX = sin(time) * 0.5;
  let currentZ = cos(time) * 0.5;

  // Draw pyramids
  for (let p of pyramids) {
    push();
    translate(p.x, p.y - p.h/2, p.z);
    rotateY(p.rot + time);
    
    // Pyramid shape using triangles
    fill(p.hue, 30, 90, 0.7);
    beginShape(TRIANGLES);
    vertex(0, -p.h/2, 0);
    vertex(-p.size/2, p.h/2, -p.size/2);
    vertex(p.size/2, p.h/2, -p.size/2);

    vertex(0, -p.h/2, 0);
    vertex(p.size/2, p.h/2, -p.size/2);
    vertex(p.size/2, p.h/2, p.size/2);

    vertex(0, -p.h/2, 0);
    vertex(p.size/2, p.h/2, p.size/2);
    vertex(-p.size/2, p.h/2, p.size/2);

    vertex(0, -p.h/2, 0);
    vertex(-p.size/2, p.h/2, p.size/2);
    vertex(-p.size/2, p.h/2, -p.size/2);
    endShape();

    // Luminescent shed particles
    fill(p.hue, 80, 100, 0.5);
    beginShape(POINTS);
    for (let i = 0; i < 30; i++) {
      let a = random(TWO_PI);
      let r = random(0, p.size/2);
      let x = r * cos(a);
      let y = random(-p.h/2, p.h/2);
      let z = r * sin(a);
      vertex(x, y, z);
    }
    endShape();
    pop();
  }

  // Update and draw residue particles
  beginShape(POINTS);
  for (let i = residueParticles.length - 1; i >= 0; i--) {
    let p = residueParticles[i];
    
    // Apply current
    p.x += currentX * p.speed;
    p.z += currentZ * p.speed;
    p.y -= p.speed;

    // Fade out particles
    p.life -= p.decay;
    if (p.life <= 0) {
      residueParticles.splice(i, 1);
      continue;
    }

    // Add new particles occasionally
    if (random() < 0.02 && residueParticles.length < 700) {
      residueParticles.push({
        x: random(-width/2, width/2),
        y: height/2 + random(100),
        z: random(-height/2, height/2),
        size: random(1, 4),
        speed: random(0.5, 2),
        hue: random(180, 240),
        sat: random(70, 100),
        bri: random(80, 100),
        life: 1,
        decay: random(0.001, 0.005)
      });
    }

    fill(p.hue, p.sat, p.bri, p.life);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw visible current streams
  noFill();
  stroke(200, 70, 100, 0.3);
  beginShape(LINES);
  for (let i = 0; i < 10; i++) {
    let a = time + i * 0.5;
    let r = 200 + sin(a) * 50;
    let x1 = r * cos(a);
    let z1 = r * sin(a);
    let x2 = r * cos(a + PI);
    let z2 = r * sin(a + PI);
    vertex(x1, height/2 - 50, z1);
    vertex(x2, height/2 - 50, z2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
