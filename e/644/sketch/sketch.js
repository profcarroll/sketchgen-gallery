let lines = [];
let lastX, lastY;
let brushSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  brushSize = 2;
}

function draw() {
  // Keep the canvas still unless dragged
  noLoop();
}

function mousePressed() {
  // Start drawing when mouse is pressed
  lastX = mouseX;
  lastY = mouseY;
  lines.push([]);
  loop();
}

function mouseDragged() {
  // Add new line segment based on mouse movement
  const currentLine = lines[lines.length - 1];
  
  // Calculate distance and adjust brush size and color based on speed
  let dx = mouseX - lastX;
  let dy = mouseY - lastY;
  let speed = sqrt(dx * dx + dy * dy);
  
  // Adjust brush size based on speed
  brushSize = map(speed, 0, 50, 1, 5);
  
  // Draw line segment
  currentLine.push({
    x1: lastX,
    y1: lastY,
    x2: mouseX,
    y2: mouseY,
    weight: brushSize,
    color: color(
      map(mouseX, 0, width, 0, 255),
      map(mouseY, 0, height, 0, 255),
      100,
      150
    )
  });
  
  // Update last position
  lastX = mouseX;
  lastY = mouseY;
  
  // Redraw the canvas to show new stroke
  redraw();
}

function drawLines() {
  // Draw all lines
  for (let lineGroup of lines) {
    for (let line of lineGroup) {
      stroke(line.color);
      strokeWeight(line.weight);
      line(line.x1, line.y1, line.x2, line.y2);
    }
  }
}

function mouseReleased() {
  // Stop drawing when mouse is released
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
