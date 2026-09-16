let terrain;
let trees = [];
let dustDevils = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create terrain with cracked texture
  terrain = createGraphics(width, height);
  terrain.colorMode(RGB);
  terrain.background(139, 69, 19); // Terracotta base
  
  // Add cracks and fissures
  terrain.stroke(80, 40, 10);
  terrain.strokeWeight(2);
  for (let i = 0; i < 500; i++) {
    let x1 = random(width);
    let y1 = random(height * 0.7); // Keep most cracks in lower half
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-50, 50);
    terrain.line(x1, y1, x2, y2);
  }
  
  // Add some rock formations
  terrain.fill(100, 50, 10);
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = height * 0.7 + random(height * 0.3);
    let w = random(20, 80);
    let h = random(10, 40);
    terrain.rect(x, y, w, h);
  }
  
  // Create trees
  for (let i = 0; i < 15; i++) {
    trees.push({
      x: random(width),
      y: height * 0.7 + random(height * 0.3),
      trunkHeight: random(40, 80),
      crownSize: random(20, 40)
    });
  }
  
  // Create dust devils
  for (let i = 0; i < 50; i++) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7 + random(height * 0.3),
      size: random(5, 20),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.05, 0.05),
      opacity: random(100, 200)
    });
  }
}

function draw() {
  // Sky background
  background(245, 245, 220); // Beige sky
  
  // Draw cracked terrain
  image(terrain, 0, 0);
  
  // Draw trees
  fill(101, 67, 33); // Brown trunk
  noStroke();
  for (let tree of trees) {
    rect(tree.x - 5, tree.y, 10, tree.trunkHeight);
    
    fill(50, 150, 50); // Green leaves
    ellipse(tree.x, tree.y - tree.trunkHeight/2, tree.crownSize, tree.crownSize);
  }
  
  // Draw dust devils
  for (let devil of dustDevils) {
    let x = devil.x + cos(devil.angle) * devil.speed;
    let y = devil.y + sin(devil.angle) * devil.speed;
    
    devil.angle += devil.sway;
    
    // Wrap around screen
    if (x > width) x = 0;
    else if (x < 0) x = width;
    if (y > height) y = 0;
    else if (y < 0) y = height;
    
    devil.x = x;
    devil.y = y;
    
    // Draw dust devil
    noFill();
    stroke(200, 180, 160, devil.opacity);
    strokeWeight(devil.size / 5);
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 9, 0, TWO_PI);
      let radius = devil.size * (1 + sin(frameCount * 0.05 + i) * 0.5);
      let px = x + cos(angle) * radius;
      let py = y + sin(angle) * radius;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    // Add some particles
    stroke(180, 160, 140, devil.opacity/2);
    strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      let angle = random(TWO_PI);
      let distance = random(devil.size * 0.5, devil.size * 1.5);
      let px = x + cos(angle) * distance;
      let py = y + sin(angle) * distance;
      point(px, py);
    }
  }
  
  // Add subtle movement to dust devils
  for (let devil of dustDevils) {
    if (random() < 0.01) {
      devil.sway = random(-0.05, 0.05);
      devil.speed = random(0.5, 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
