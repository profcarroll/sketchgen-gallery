let lines = [];
const NUM_LINES = 1500;
const STIFFNESS = 0.05;
const DAMPING = 0.95;
const MOUSE_RADIUS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines with random positions
  for (let i = 0; i < NUM_LINES; i++) {
    const start = createVector(random(width), random(height));
    const end = createVector(random(width), random(height));
    lines.push({
      start,
      end,
      startVel: createVector(0, 0),
      endVel: createVector(0, 0),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(50, 100)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Update and draw lines
  for (let i = 0; i < lines.length; i++) {
    const lineObj = lines[i];
    
    // Apply physics to start point
    lineObj.startVel.mult(DAMPING);
    lineObj.startVel.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
    lineObj.start.add(lineObj.startVel);
    
    // Apply physics to end point
    lineObj.endVel.mult(DAMPING);
    lineObj.endVel.add(createVector(random(-0.5, 0.5), random(-0.5, 0.5)));
    lineObj.end.add(lineObj.endVel);
    
    // Mouse interaction
    const mouseDistStart = dist(mouseX, mouseY, lineObj.start.x, lineObj.start.y);
    const mouseDistEnd = dist(mouseX, mouseY, lineObj.end.x, lineObj.end.y);
    
    if (mouseDistStart < MOUSE_RADIUS) {
      const force = p5.Vector.sub(lineObj.start, createVector(mouseX, mouseY));
      force.normalize();
      force.mult(0.5);
      lineObj.startVel.add(force);
    }
    
    if (mouseDistEnd < MOUSE_RADIUS) {
      const force = p5.Vector.sub(lineObj.end, createVector(mouseX, mouseY));
      force.normalize();
      force.mult(0.5);
      lineObj.endVel.add(force);
    }
    
    // Boundary check - wrap around
    if (lineObj.start.x < 0) lineObj.start.x = width;
    if (lineObj.start.x > width) lineObj.start.x = 0;
    if (lineObj.start.y < 0) lineObj.start.y = height;
    if (lineObj.start.y > height) lineObj.start.y = 0;
    
    if (lineObj.end.x < 0) lineObj.end.x = width;
    if (lineObj.end.x > width) lineObj.end.x = 0;
    if (lineObj.end.y < 0) lineObj.end.y = height;
    if (lineObj.end.y > height) lineObj.end.y = 0;
    
    // Draw the line with dynamic color
    stroke(lineObj.hue, lineObj.saturation, lineObj.brightness, 0.7);
    line(lineObj.start.x, lineObj.start.y, lineObj.end.x, lineObj.end.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
