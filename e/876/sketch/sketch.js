let dustDevils = [];
let cracks = [];
let sedimentPatches = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Generate cracks
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(50, 300);
    let angle = random(TWO_PI);
    cracks.push({ x, y, len, angle });
  }

  // Generate sediment patches
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(5, 20);
    sedimentPatches.push({ x, y, size });
  }

  // Initialize dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      trail: [],
      hue: random(10, 30), // terracotta range
      saturation: random(40, 60)
    });
  }
}

function draw() {
  time += 0.01;

  // Draw sky
  background(50, 10, 95); // beige sky

  // Draw ground with terracotta tones
  noStroke();
  fill(10, 60, 30);
  rect(0, 0, width, height);

  // Draw cracks
  stroke(10, 70, 20);
  strokeWeight(2);
  for (let crack of cracks) {
    let endX = crack.x + cos(crack.angle) * crack.len;
    let endY = crack.y + sin(crack.angle) * crack.len;
    line(crack.x, crack.y, endX, endY);
  }

  // Draw sediment patches
  fill(30, 20, 85); // lighter sediment
  for (let patch of sedimentPatches) {
    ellipse(patch.x, patch.y, patch.size);
  }

  // Update and draw dust devils
  for (let devil of dustDevils) {
    // Move devil
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;

    // Add to trail
    devil.trail.push({ x: devil.x, y: devil.y });
    if (devil.trail.length > 30) {
      devil.trail.shift();
    }

    // Draw trail
    noFill();
    stroke(devil.hue, devil.saturation, 80, 0.5);
    strokeWeight(2);
    beginShape();
    for (let point of devil.trail) {
      vertex(point.x, point.y);
    }
    endShape();

    // Draw devil
    noStroke();
    fill(devil.hue, devil.saturation, 80, 0.7);
    ellipse(devil.x, devil.y, devil.size);

    // Boundary check and bounce
    if (devil.x < 0 || devil.x > width || devil.y < 0 || devil.y > height) {
      devil.angle += random(-0.5, 0.5);
    }

    // Random angle change
    devil.angle += sin(time * 0.1) * 0.02;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
