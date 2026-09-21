let hexGrid = [];
let ants = [];
let debris = [];
let tileSize = 80;
let cols, rows;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / tileSize) + 2;
  rows = Math.ceil(height / tileSize) + 2;
  
  // Generate hexagonal grid
  for (let y = 0; y < rows; y++) {
    hexGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      let offset = (y % 2) * tileSize / 2;
      let hx = x * tileSize + offset;
      let hy = y * tileSize * 0.866; // 0.866 is sin(60°)
      
      hexGrid[y][x] = {
        x: hx,
        y: hy,
        active: random() > 0.3, // 70% chance of being a tunnel
        size: tileSize * 0.8
      };
    }
  }
  
  // Create ants
  for (let i = 0; i < 20; i++) {
    ants.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      size: random(3, 6)
    });
  }
  
  // Create debris clumps
  for (let i = 0; i < 30; i++) {
    debris.push({
      x: random(width),
      y: random(height),
      size: random(15, 40),
      density: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(120, 90, 60); // Warm tan background
  
  time += 0.01;
  
  // Draw hexagonal grid
  stroke(40, 30, 20);
  strokeWeight(1);
  noFill();
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = hexGrid[y][x];
      if (cell.active) {
        drawHexagon(cell.x, cell.y, cell.size);
      }
    }
  }
  
  // Draw debris
  fill(80, 60, 40);
  noStroke();
  for (let d of debris) {
    let noiseVal = noise(d.x * 0.01, d.y * 0.01, time);
    let size = d.size * (0.8 + noiseVal * 0.4);
    
    // Draw clump with irregular shape
    for (let i = 0; i < 5; i++) {
      let angle = random(TWO_PI);
      let dist = random(size * 0.3, size * 0.7);
      let px = d.x + cos(angle) * dist;
      let py = d.y + sin(angle) * dist;
      ellipse(px, py, size * 0.2, size * 0.2);
    }
  }
  
  // Draw ants
  noStroke();
  for (let ant of ants) {
    // Update position with subtle random movement
    ant.angle += random(-0.1, 0.1);
    ant.x += cos(ant.angle) * ant.speed;
    ant.y += sin(ant.angle) * ant.speed;
    
    // Keep ants on screen
    if (ant.x < 0 || ant.x > width || ant.y < 0 || ant.y > height) {
      ant.x = random(width);
      ant.y = random(height);
      ant.angle = random(TWO_PI);
    }
    
    // Draw ant body
    fill(20, 10, 5);
    ellipse(ant.x, ant.y, ant.size, ant.size * 0.6);
    
    // Draw ant antennae
    stroke(20, 10, 5);
    strokeWeight(1);
    let angle1 = ant.angle - PI/4;
    let angle2 = ant.angle + PI/4;
    line(ant.x, ant.y, ant.x + cos(angle1) * ant.size, ant.y + sin(angle1) * ant.size);
    line(ant.x, ant.y, ant.x + cos(angle2) * ant.size, ant.y + sin(angle2) * ant.size);
    
    // Draw sand disturbance
    fill(100, 70, 40, 80);
    ellipse(ant.x, ant.y, ant.size * 2, ant.size * 1.5);
  }
  
  // Add subtle shifting shadows
  let shadowOffset = sin(time) * 3;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = hexGrid[y][x];
      if (cell.active) {
        fill(20, 15, 10, 60);
        noStroke();
        drawHexagon(cell.x + shadowOffset, cell.y + shadowOffset, cell.size * 0.9);
      }
    }
  }
}

function drawHexagon(x, y, size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let px = x + cos(angle) * size;
    let py = y + sin(angle) * size;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
