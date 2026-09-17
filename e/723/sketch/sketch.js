let mountains = [];
let rocks = [];
let snowDrifts = [];
let avalancheActive = false;
let avalancheParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create background mountains
  for (let i = 0; i < 8; i++) {
    mountains.push({
      x: random(width),
      w: random(200, 400),
      h: random(300, 500),
      color: color(random(190, 220), random(10, 20), random(60, 80))
    });
  }

  // Create foreground rocks
  for (let i = 0; i < 30; i++) {
    rocks.push({
      x: random(width),
      y: height - 100,
      w: random(20, 80),
      h: random(30, 100),
      color: color(random(190, 210), random(5, 15), random(40, 60))
    });
  }

  // Create initial snow drifts
  for (let i = 0; i < 20; i++) {
    snowDrifts.push({
      x: random(width),
      y: height - 100,
      w: random(30, 100),
      h: random(5, 20),
      color: color(240, 5, 90)
    });
  }
}

function draw() {
  background(210, 10, 95); // Cool blue-gray sky

  // Draw mountains
  for (let m of mountains) {
    fill(m.color);
    noStroke();
    triangle(
      m.x - m.w/2, height,
      m.x + m.w/2, height,
      m.x, height - m.h
    );
  }

  // Draw foreground rocks and snow drifts
  for (let r of rocks) {
    fill(r.color);
    noStroke();
    rect(r.x, r.y, r.w, r.h, 5);
  }

  for (let s of snowDrifts) {
    fill(s.color);
    noStroke();
    rect(s.x, s.y, s.w, s.h, 3);
  }

  // Draw avalanche particles if active
  if (avalancheActive) {
    for (let p of avalancheParticles) {
      fill(240, 10, 95);
      noStroke();
      ellipse(p.x, p.y, p.size);
    }
  }
}

function mousePressed() {
  // Only trigger avalanche at center
  if (dist(mouseX, mouseY, width/2, height/2) < 100) {
    avalancheActive = true;
    
    // Create avalanche particles
    avalancheParticles = [];
    for (let i = 0; i < 300; i++) {
      avalancheParticles.push({
        x: width/2,
        y: height/2,
        size: random(2, 8),
        speedX: random(-3, 3),
        speedY: random(-5, -1),
        gravity: 0.1
      });
    }
  }
}

function draw() {
  background(210, 10, 95); // Cool blue-gray sky

  // Draw mountains
  for (let m of mountains) {
    fill(m.color);
    noStroke();
    triangle(
      m.x - m.w/2, height,
      m.x + m.w/2, height,
      m.x, height - m.h
    );
  }

  // Draw foreground rocks and snow drifts
  for (let r of rocks) {
    fill(r.color);
    noStroke();
    rect(r.x, r.y, r.w, r.h, 5);
  }

  for (let s of snowDrifts) {
    fill(s.color);
    noStroke();
    rect(s.x, s.y, s.w, s.h, 3);
  }

  // Draw avalanche particles if active
  if (avalancheActive) {
    for (let p of avalancheParticles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += p.gravity;

      fill(240, 10, 95);
      noStroke();
      ellipse(p.x, p.y, p.size);

      // Remove particles that fall off screen or are too old
      if (p.y > height || p.size < 0.5) {
        p.size = 0;
      }
    }

    // Add new snow drifts from avalanche
    for (let i = 0; i < 10; i++) {
      if (random() < 0.3) {
        snowDrifts.push({
          x: random(width),
          y: height - 100,
          w: random(20, 60),
          h: random(5, 15),
          color: color(240, 5, 90)
        });
      }
    }

    // Remove particles that are no longer active
    avalancheParticles = avalancheParticles.filter(p => p.size > 0);
    
    // Stop avalanche after some time
    if (avalancheParticles.length === 0) {
      avalancheActive = false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
