let dustDevils = [];
let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create sparse acacia trees
  for (let i = 0; i < 15; i++) {
    trees.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(20, 40)
    });
  }

  // Create dust devils
  for (let i = 0; i < 8; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(5, 15),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  // Draw sky with beige tone
  background(245, 240, 230);

  // Draw terracotta ground
  fill(150, 60, 30);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);

  // Draw sparse trees
  fill(120, 70, 40);
  for (let tree of trees) {
    // Tree trunk
    rect(tree.x - 5, tree.y, 10, height - tree.y);
    // Tree foliage
    fill(100, 80, 60);
    ellipse(tree.x, tree.y - 20, tree.size, tree.size * 0.7);
    fill(120, 70, 40);
  }

  // Draw dust devils
  for (let devil of dustDevils) {
    // Move dust devil
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;
    
    // Bounce off edges
    if (devil.x < 0 || devil.x > width) devil.angle = PI - devil.angle;
    if (devil.y < 0 || devil.y > height) devil.angle = -devil.angle;

    // Draw dust devil as wispy cloud
    noFill();
    stroke(180, 150, 130);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = i * 0.6 + devil.angle;
      let radius = devil.size + sin(frameCount * 0.05 + i) * 3;
      let x = devil.x + cos(angle) * radius;
      let y = devil.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
