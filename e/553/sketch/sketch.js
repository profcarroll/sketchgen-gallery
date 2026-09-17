let strokes = [];
let currentStroke = [];
let brushSize = 2;
let isDrawing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  strokeWeight(brushSize);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  // Draw existing strokes
  for (let stroke of strokes) {
    if (stroke.length > 1) {
      beginShape();
      for (let i = 0; i < stroke.length; i++) {
        let point = stroke[i];
        vertex(point.x, point.y);
      }
      endShape();
    }
  }

  // Draw current stroke
  if (currentStroke.length > 1) {
    beginShape();
    for (let i = 0; i < currentStroke.length; i++) {
      let point = currentStroke[i];
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function mousePressed() {
  isDrawing = true;
  currentStroke = [];
  stroke(random(360), 80, 90, 0.8);
}

function mouseDragged() {
  if (isDrawing) {
    let point = { x: mouseX, y: mouseY };
    currentStroke.push(point);
  }
}

function mouseReleased() {
  isDrawing = false;
  if (currentStroke.length > 0) {
    strokes.push(currentStroke);
    currentStroke = [];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
