let organisms = [];
let paths = [];
let grid = [];
let blockSize = 15;
let rows, cols;
let pulseSpeed = 0.01;
let glowIntensity = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = floor(height / blockSize);
  cols = floor(width / blockSize);

  // Create grid
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x: x * blockSize,
        y: y * blockSize,
        isBlocked: false
      };
    }
  }

  // Create bioluminescent organisms
  for (let i = 0; i < 150; i++) {
    organisms.push({
      x: random(width),
      y: random(height),
      size: random(3, 8),
      color: color(random(50, 255), random(100, 255), random(200, 255), 200),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      pulse: random(TWO_PI)
    });
  }

  // Create pathways
  for (let i = 0; i < 300; i++) {
    let path = [];
    let startX = random(width);
    let startY = random(height);
    path.push({x: startX, y: startY});

    for (let j = 0; j < 15; j++) {
      let lastPoint = path[path.length - 1];
      let nextX = lastPoint.x + random(-30, 30);
      let nextY = lastPoint.y + random(-30, 30);
      
      // Keep within bounds
      nextX = constrain(nextX, 0, width);
      nextY = constrain(nextY, 0, height);
      
      path.push({x: nextX, y: nextY});
    }

    paths.push(path);
  }
}

function draw() {
  background(5, 5, 15);
  
  // Pulsing glow effect
  glowIntensity = sin(frameCount * pulseSpeed) * 0.3 + 0.7;
  time += 0.002;

  // Draw pathways
  strokeWeight(1);
  for (let path of paths) {
    if (path.length > 1) {
      beginShape();
      noFill();
      stroke(
        100 + sin(time + path.length * 0.1) * 50,
        200 + cos(time + path.length * 0.1) * 50,
        255,
        80 * glowIntensity
      );
      
      for (let i = 0; i < path.length; i++) {
        let p = path[i];
        curveVertex(p.x, p.y);
      }
      endShape();
    }
  }

  // Draw organisms
  for (let organism of organisms) {
    organism.x += organism.speedX;
    organism.y += organism.speedY;

    // Bounce off edges
    if (organism.x < 0 || organism.x > width) organism.speedX *= -1;
    if (organism.y < 0 || organism.y > height) organism.speedY *= -1;

    // Pulsing effect
    let pulse = sin(organism.pulse + time * 2) * 0.5 + 0.5;
    let size = organism.size * (0.8 + pulse * 0.4);
    
    noStroke();
    fill(organism.color);
    ellipse(organism.x, organism.y, size);

    // Add glow
    fill(red(organism.color), green(organism.color), blue(organism.color), 30);
    ellipse(organism.x, organism.y, size * 2);
    
    organism.pulse += 0.05;
  }

  // Draw cabinet frame
  stroke(100, 150, 255, 100);
  strokeWeight(8);
  noFill();
  rect(0, 0, width, height);

  // Inner screen area
  strokeWeight(2);
  rect(blockSize, blockSize, width - blockSize * 2, height - blockSize * 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rows = floor(height / blockSize);
  cols = floor(width / blockSize);
}
