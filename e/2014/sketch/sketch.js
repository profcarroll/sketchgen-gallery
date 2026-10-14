let angle = 0;
let walls = [];
let gridLines = [];
let measurements = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create a simple floor plan with walls and windows
  for (let i = 0; i < 8; i++) {
    const x = map(i, 0, 8, -200, 200);
    const y = map(i, 0, 8, -200, 200);
    walls.push({x: x, y: y, z: 0, width: 400, height: 10});
  }
  
  // Add some windows
  for (let i = 0; i < 6; i++) {
    const x = map(i, 0, 6, -200, 200);
    walls.push({x: x, y: 0, z: 0, width: 30, height: 50});
  }
  
  // Add staircase
  for (let i = 0; i < 4; i++) {
    const x = -150;
    const y = map(i, 0, 4, -150, 150);
    walls.push({x: x, y: y, z: i * 20, width: 30, height: 30});
  }
  
  // Create grid lines
  for (let i = -200; i <= 200; i += 50) {
    gridLines.push({x1: i, y1: -200, z1: 0, x2: i, y2: 200, z2: 0});
    gridLines.push({x1: -200, y1: i, z1: 0, x2: 200, y2: i, z2: 0});
  }
  
  // Add measurement markings
  for (let i = -200; i <= 200; i += 100) {
    measurements.push({x: i, y: -210, z: 0, text: `${i}`});
    measurements.push({x: -210, y: i, z: 0, text: `${i}`});
  }
}

function draw() {
  background(10, 15, 30);
  
  // Auto-rotate the scene
  angle += 0.002;
  
  // Camera rotation with mouse drag
  if (mouseIsPressed) {
    angle = (mouseX / width) * TWO_PI;
  }
  
  // Set up camera
  translate(0, 0, -500);
  rotateY(angle);
  
  // Draw grid lines
  stroke(100, 120, 200, 80);
  strokeWeight(1);
  beginShape(LINES);
  for (let line of gridLines) {
    vertex(line.x1, line.y1, line.z1);
    vertex(line.x2, line.y2, line.z2);
  }
  endShape();
  
  // Draw walls
  stroke(255);
  strokeWeight(2);
  for (let wall of walls) {
    if (wall.width > 50) { // This is a wall
      rect(wall.x - wall.width/2, wall.y - wall.height/2, wall.width, wall.height);
    } else { // This is a window
      rect(wall.x - wall.width/2, wall.y - wall.height/2, wall.width, wall.height);
      stroke(100, 150, 255);
      rect(wall.x - wall.width/2 + 2, wall.y - wall.height/2 + 2, wall.width - 4, wall.height - 4);
      stroke(255);
    }
  }
  
  // Draw staircase
  for (let i = 0; i < 4; i++) {
    const x = -150;
    const y = map(i, 0, 4, -150, 150);
    const z = i * 20;
    rect(x - 30/2, y - 30/2, 30, 30);
  }
  
  // Draw measurement markings
  noStroke();
  fill(150, 200, 255);
  textSize(12);
  textAlign(CENTER, TOP);
  for (let mark of measurements) {
    text(mark.text, mark.x, mark.y, mark.z);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
