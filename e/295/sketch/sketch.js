let particles = [];
let crystals = [];
let bioluminescence = [];
let flowSpeed = 0.5;
let maxFlowSpeed = 3.0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-2000, 0),
      size: random(1, 3),
      hue: random(180, 240)
    });
  }

  // Initialize bioluminescence points
  for (let i = 0; i < 200; i++) {
    bioluminescence.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-2000, 0),
      size: random(0.5, 2),
      hue: random(160, 180)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 100;
  let camY = cos(time * 0.3) * 50;
  camera(0, 0, height / 2, 0, 0, 0, 0, 1, 0);
  translate(camX, camY, 0);

  // Increase speed over time
  flowSpeed = min(flowSpeed + 0.001, maxFlowSpeed);

  // Draw particles (molecular structures)
  beginShape(POINTS);
  for (let p of particles) {
    p.z += flowSpeed;
    if (p.z > 0) {
      p.z = -2000;
      p.x = random(-width, width);
      p.y = random(-height, height);
    }
    fill(p.hue, 80, 90, 0.7);
    noStroke();
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw bioluminescence
  beginShape(POINTS);
  for (let b of bioluminescence) {
    b.z += flowSpeed;
    if (b.z > 0) {
      b.z = -2000;
      b.x = random(-width, width);
      b.y = random(-height, height);
    }
    fill(b.hue, 100, 95, 0.5);
    noStroke();
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Occasionally spawn crystalline distortions
  if (random() < 0.02) {
    crystals.push({
      x: random(-width, width),
      y: random(-height, height),
      z: -2000,
      size: random(10, 30),
      hue: random(200, 260),
      rotation: random(TWO_PI),
      velocity: createVector(random(-1, 1), random(-1, 1), flowSpeed * 1.5)
    });
  }

  // Draw and update crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    let c = crystals[i];
    c.z += flowSpeed;
    c.x += c.velocity.x;
    c.y += c.velocity.y;
    c.rotation += 0.05;

    if (c.z > 0 || random() < 0.01) {
      // Fragmentation
      for (let j = 0; j < 10; j++) {
        particles.push({
          x: c.x + random(-20, 20),
          y: c.y + random(-20, 20),
          z: c.z,
          size: random(0.5, 2),
          hue: c.hue
        });
      }
      crystals.splice(i, 1);
    } else {
      push();
      translate(c.x, c.y, c.z);
      rotateX(c.rotation);
      rotateY(c.rotation * 0.5);
      rotateZ(c.rotation * 0.3);
      
      fill(c.hue, 90, 90, 0.8);
      noStroke();
      box(c.size);
      pop();
    }
  }

  // React bioluminescence to flow and crystals
  for (let b of bioluminescence) {
    let dx = b.x - width/2;
    let dy = b.y - height/2;
    let distToCenter = sqrt(dx*dx + dy*dy);
    
    if (distToCenter < 300) {
      b.hue += 1;
      if (b.hue > 260) b.hue = 160;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
