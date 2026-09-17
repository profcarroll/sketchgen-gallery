let peaks = [];
let snow = [];
let rocks = [];
let avalancheActive = false;
let avalancheX = 0;
let avalancheY = 0;
let avalancheSize = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create mountain peaks
  for (let i = 0; i < 20; i++) {
    peaks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      w: random(100, 300),
      h: random(200, 400),
      color: color(200, 220, 255, 200)
    });
  }

  // Create snow particles
  for (let i = 0; i < 1000; i++) {
    snow.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      opacity: random(100, 255)
    });
  }

  // Create rock formations
  for (let i = 0; i < 15; i++) {
    rocks.push({
      x: random(width * 0.3, width * 0.7),
      y: height - 50,
      w: random(20, 60),
      h: random(30, 80),
      color: color(100, 100, 120, 200)
    });
  }
}

function draw() {
  background(180, 210, 255);

  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(180, 210, 255), color(100, 130, 200), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw mountains
  for (let peak of peaks) {
    fill(peak.color);
    triangle(
      peak.x - peak.w/2, peak.y,
      peak.x + peak.w/2, peak.y,
      peak.x, peak.y - peak.h
    );
  }

  // Update and draw snow
  for (let s of snow) {
    s.y += s.speed;
    if (s.y > height) {
      s.y = 0;
      s.x = random(width);
    }
    fill(255, 255, 255, s.opacity);
    ellipse(s.x, s.y, s.size);
  }

  // Draw rocks
  for (let r of rocks) {
    fill(r.color);
    rect(r.x - r.w/2, r.y - r.h, r.w, r.h);
  }

  // Draw avalanche if active
  if (avalancheActive) {
    fill(255, 255, 255, 150);
    ellipse(avalancheX, avalancheY, avalancheSize);
    avalancheSize += 3;
    avalancheY += 2;

    // Stop avalanche after reaching bottom
    if (avalancheY > height) {
      avalancheActive = false;
      avalancheSize = 0;
    }
  }
}

function mousePressed() {
  if (!avalancheActive) {
    avalancheActive = true;
    avalancheX = width / 2;
    avalancheY = 0;
    avalancheSize = 10;

    // Move rocks into foreground
    for (let i = 0; i < rocks.length; i++) {
      if (random() > 0.5) {
        rocks[i].x += random(-20, 20);
        rocks[i].y -= random(0, 30);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
