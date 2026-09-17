let cracks = [];
let dustDevils = [];
let terrain;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create terrain texture
  terrain = createGraphics(width, height);
  terrain.colorMode(HSB, 360, 100, 100, 1);
  terrain.background(10, 80, 25); // Base terracotta color

  // Generate cracks
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(50, 300);
    let angle = random(TWO_PI);
    cracks.push({x, y, len, angle});
  }

  // Generate dust devils
  for (let i = 0; i < 20; i++) {
    dustDevils.push({
      x: random(width),
      y: height - 50,
      size: random(10, 30),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.02, 0.02)
    });
  }
}

function draw() {
  // Draw sky
  background(60, 30, 85); // Muted beige sky

  // Draw terrain with texture
  image(terrain, 0, 0);

  // Draw cracks
  stroke(10, 70, 10);
  strokeWeight(2);
  noFill();
  for (let crack of cracks) {
    push();
    translate(crack.x, crack.y);
    rotate(crack.angle);
    line(0, 0, crack.len, 0);
    pop();
  }

  // Update and draw dust devils
  for (let devil of dustDevils) {
    devil.x += cos(devil.angle) * devil.speed;
    devil.y -= devil.speed;
    devil.angle += devil.sway;

    // Reset if out of bounds
    if (devil.y < -20 || devil.x < -20 || devil.x > width + 20) {
      devil.x = random(width);
      devil.y = height - 50;
      devil.angle = random(TWO_PI);
    }

    // Draw dust devil
    noStroke();
    fill(60, 30, 90, 0.7);
    ellipse(devil.x, devil.y, devil.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
