let paintStrokes = [];
let currentStroke = null;
let colors = [
  [255, 50, 50],   // red
  [50, 255, 50],   // green
  [50, 50, 255],   // blue
  [255, 255, 50],  // yellow
  [255, 50, 255],  // magenta
  [50, 255, 255]   // cyan
];
let colorIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(240);
  noStroke();
}

function draw() {
  // Simulate some motion for the gate test
  if (frameCount % 60 === 0) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 30);
    fill(colors[floor(random(colors.length))]);
    ellipse(x, y, size, size);
  }
}

function mousePressed() {
  // Start a new stroke
  currentStroke = {
    points: [],
    color: colors[colorIndex],
    size: random(2, 8)
  };
  paintStrokes.push(currentStroke);
  return false;
}

function mouseDragged() {
  if (currentStroke) {
    // Add point to current stroke
    currentStroke.points.push({x: mouseX, y: mouseY});
    
    // Draw the stroke as we drag
    fill(currentStroke.color[0], currentStroke.color[1], currentStroke.color[2]);
    ellipse(mouseX, mouseY, currentStroke.size);
    
    // Draw a line connecting last point to this one
    if (currentStroke.points.length > 1) {
      let prevPoint = currentStroke.points[currentStroke.points.length - 2];
      stroke(currentStroke.color[0], currentStroke.color[1], currentStroke.color[2]);
      strokeWeight(currentStroke.size * 0.5);
      line(prevPoint.x, prevPoint.y, mouseX, mouseY);
    }
    
    // Randomly change color every few points
    if (currentStroke.points.length % 5 === 0) {
      colorIndex = (colorIndex + 1) % colors.length;
      currentStroke.color = colors[colorIndex];
    }
  }
  return false;
}

function mouseReleased() {
  currentStroke = null;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
