let planes = [];
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize organic planes
  for (let i = 0; i < 200; i++) {
    planes.push({
      pos: createVector(random(width), random(height), random(-100, 100)),
      size: random(50, 200),
      speed: random(0.001, 0.005),
      hue: random(360),
      alpha: random(0.1, 0.3)
    });
  }
  
  // Grid parameters
  grid = {
    size: 100,
    rows: floor(height / 100) + 2,
    cols: floor(width / 100) + 2,
    spacing: 100,
    timeOffset: 0
  };
}

function draw() {
  background(0);
  noFill();
  strokeWeight(1);
  
  // Update grid animation
  grid.timeOffset += 0.01;
  
  // Draw hexagonal grid
  drawHexGrid();
  
  // Update and draw organic planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Animate position
    p.pos.x += sin(p.pos.y * 0.01 + frameCount * p.speed) * 0.5;
    p.pos.y += cos(p.pos.x * 0.01 + frameCount * p.speed) * 0.5;
    p.pos.z += sin(frameCount * p.speed * 0.5) * 0.2;
    
    // Update color
    p.hue = (p.hue + 0.1) % 360;
    
    // Draw glowing plane
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    rotateX(frameCount * 0.001);
    rotateY(frameCount * 0.002);
    rotateZ(frameCount * 0.0005);
    
    stroke(p.hue, 80, 90, p.alpha);
    drawOrganicPlane(p.size);
    pop();
  }
}

function drawHexGrid() {
  // Draw hexagonal grid with wave effect
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      let x = col * grid.spacing - width/2;
      let y = row * grid.spacing - height/2;
      
      // Wave displacement
      let waveOffset = sin(row * 0.5 + grid.timeOffset) * 10;
      let waveOffset2 = cos(col * 0.3 + grid.timeOffset) * 10;
      
      push();
      translate(x + waveOffset, y + waveOffset2, 0);
      
      // Hexagon shape
      stroke(200, 50, 90, 0.7);
      drawHexagon(grid.size);
      pop();
    }
  }
}

function drawOrganicPlane(size) {
  // Create a subtle organic shape using ellipse and rotation
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let r = size * (0.8 + 0.2 * sin(frameCount * 0.01 + angle));
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y, 0);
  }
  endShape(CLOSE);
}

function drawHexagon(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = size * cos(angle);
    let y = size * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
