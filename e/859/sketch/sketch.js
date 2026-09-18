let particles1 = [];
let particles2 = [];
let stream1Center = { x: 0, y: 0 };
let stream2Center = { x: 0, y: 0 };
let pulseTimer = 0;
let pulseDuration = 120; // frames
let pulsePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Initialize two streams of particles
  for (let i = 0; i < 300; i++) {
    particles1.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      size: random(2, 6),
      color: color(random(100, 255), random(100, 255), random(200, 255)),
    });

    particles2.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      size: random(2, 6),
      color: color(random(100, 255), random(100, 255), random(200, 255)),
    });
  }
}

function draw() {
  background(0);
  ambientLight(30);

  // Update and draw streams
  updateStream(particles1, stream1Center, color(255, 100, 100));
  updateStream(particles2, stream2Center, color(100, 100, 255));

  // Handle pulsing effect periodically
  pulseTimer++;
  if (pulseTimer > pulseDuration * 4) {
    pulseTimer = 0;
    pulsePhase = 0;
  }
  if (pulseTimer > pulseDuration && pulseTimer < pulseDuration * 2) {
    pulsePhase = map(pulseTimer, pulseDuration, pulseDuration * 2, 0, 1);
  }

  // Reverse direction at peak of pulse
  if (pulseTimer > pulseDuration * 2 && pulseTimer < pulseDuration * 3) {
    let reverseFactor = map(pulseTimer, pulseDuration * 2, pulseDuration * 3, 1, 0);
    for (let p of particles1) {
      p.vx *= -reverseFactor;
      p.vy *= -reverseFactor;
      p.vz *= -reverseFactor;
    }
  }

  // Draw connections between particles in same stream
  drawConnections(particles1);
  drawConnections(particles2);
}

function updateStream(particles, center, color) {
  let dx = (mouseX - width/2) * 0.0005;
  let dy = (mouseY - height/2) * 0.0005;

  center.x += dx;
  center.y += dy;

  // Apply pulse effect
  if (pulsePhase > 0) {
    let pulseSize = map(pulsePhase, 0, 1, 1, 3);
    for (let p of particles) {
      p.vx *= pulseSize;
      p.vy *= pulseSize;
      p.vz *= pulseSize;
    }
  }

  // Draw particles
  beginShape(POINTS);
  fill(color);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Boundary checks and wrap around
    if (p.x > width/2 + 100) p.x = -width/2 - 100;
    if (p.x < -width/2 - 100) p.x = width/2 + 100;
    if (p.y > height/2 + 100) p.y = -height/2 - 100;
    if (p.y < -height/2 - 100) p.y = height/2 + 100;

    // Apply some noise to movement for fluidity
    p.vx += random(-0.05, 0.05);
    p.vy += random(-0.05, 0.05);
    p.vz += random(-0.05, 0.05);

    // Clamp velocities
    p.vx = constrain(p.vx, -2, 2);
    p.vy = constrain(p.vy, -2, 2);
    p.vz = constrain(p.vz, -2, 2);

    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function drawConnections(particles) {
  beginShape(LINES);
  stroke(255, 30);
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dz = p1.z - p2.z;
      let distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < 2000 && distSq > 50) {
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
