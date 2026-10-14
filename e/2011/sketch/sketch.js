let cameraAngleX = 0;
let cameraAngleY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(240, 10, 10); // Deep navy blue background

  // Camera setup for isometric view
  camera(
    500 * cos(cameraAngleX) * cos(cameraAngleY),
    500 * sin(cameraAngleY),
    500 * sin(cameraAngleX) * cos(cameraAngleY),
    0, 0, 0,
    0, 1, 0
  );
  
  // Perspective projection
  perspective(PI/3, width/height, 100, 10000);

  // Draw grid background
  drawGrid();

  // Draw architectural blueprint
  drawBlueprint();
}

function drawGrid() {
  stroke(240, 5, 50, 0.1);
  noFill();
  
  // Draw grid lines in X and Z directions
  for (let i = -20; i <= 20; i++) {
    beginShape(LINES);
    vertex(i * 50, 0, -500);
    vertex(i * 50, 0, 500);
    endShape();
    
    beginShape(LINES);
    vertex(-500, 0, i * 50);
    vertex(500, 0, i * 50);
    endShape();
  }
}

function drawBlueprint() {
  // Draw floor plans with cyan lines
  stroke(180, 100, 100, 0.8);
  strokeWeight(1);
  
  // Multi-level building structure
  for (let level = 0; level < 3; level++) {
    let y = level * 100;
    
    // Outer walls
    beginShape(LINES);
    vertex(-200, y, -200);
    vertex(200, y, -200);
    vertex(200, y, 200);
    vertex(-200, y, 200);
    vertex(-200, y, -200);
    endShape();
    
    // Inner walls
    beginShape(LINES);
    vertex(-100, y, -100);
    vertex(100, y, -100);
    vertex(100, y, 100);
    vertex(-100, y, 100);
    vertex(-100, y, -100);
    endShape();
    
    // Vertical structural elements
    stroke(180, 100, 100, 0.6);
    for (let x = -200; x <= 200; x += 50) {
      line(x, y, -200, x, y + 100, -200);
      line(x, y, 200, x, y + 100, 200);
    }
    
    for (let z = -200; z <= 200; z += 50) {
      line(-200, y, z, -200, y + 100, z);
      line(200, y, z, 200, y + 100, z);
    }
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;
    
    cameraAngleX += deltaX * 0.01;
    cameraAngleY += deltaY * 0.01;
    
    // Clamp vertical angle to prevent flipping
    cameraAngleY = constrain(cameraAngleY, -PI/2 + 0.01, PI/2 - 0.01);
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
