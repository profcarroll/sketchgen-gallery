let dustDevils = [];
let cracks = [];
let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create cracks
  for (let i = 0; i < 500; i++) {
    cracks.push({
      x: random(width),
      y: random(height),
      w: random(2, 8),
      h: random(10, 50)
    });
  }

  // Create dust devils
  for (let i = 0; i < 30; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height),
      size: random(10, 40),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.02, 0.02),
      color: color(random(180, 220), random(60, 100), random(20, 40))
    });
  }

  // Create trees
  for (let i = 0; i < 15; i++) {
    trees.push({
      x: random(width),
      y: random(height * 0.7, height),
      trunkHeight: random(30, 60),
      crownSize: random(40, 80)
    });
  }
}

function draw() {
  // Draw sky
  background(240, 230, 210);

  // Draw ground with terracotta tones
  fill(150, 60, 30);
  noStroke();
  rect(0, 0, width, height);

  // Draw cracks
  stroke(100, 40, 20);
  strokeWeight(2);
  for (let crack of cracks) {
    line(crack.x, crack.y, crack.x + crack.w, crack.y + crack.h);
  }

  // Draw dust devils
  for (let devil of dustDevils) {
    // Update position
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;
    devil.angle += devil.sway;

    // Wrap around edges
    if (devil.x > width + devil.size) devil.x = -devil.size;
    if (devil.x < -devil.size) devil.x = width + devil.size;
    if (devil.y > height + devil.size) devil.y = -devil.size;
    if (devil.y < -devil.size) devil.y = height + devil.size;

    // Draw dust devil
    fill(devil.color);
    noStroke();
    ellipse(devil.x, devil.y, devil.size);

    // Add glow effect
    fill(255, 200);
    ellipse(devil.x, devil.y, devil.size * 0.7);
  }

  // Draw trees
  for (let tree of trees) {
    // Trunk
    fill(120, 80, 40);
    rect(tree.x - 5, tree.y, 10, tree.trunkHeight);

    // Crown
    fill(60, 100, 30);
    noStroke();
    ellipse(tree.x, tree.y - tree.trunkHeight / 2, tree.crownSize, tree.crownSize * 0.7);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
