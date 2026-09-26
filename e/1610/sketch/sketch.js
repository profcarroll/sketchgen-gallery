let stitches = [];
let lastX, lastY;
let seamColor;
let machineHead;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seamColor = color(255, 215, 0); // Gold color for the seam
  machineHead = { x: -100, y: -100 }; // Start off-screen
  strokeWeight(3);
  noFill();
  lastX = -1;
  lastY = -1;
}

function draw() {
  background(30);
  
  // Draw fabric surface (simple grid pattern)
  stroke(50);
  strokeWeight(1);
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }
  
  // Update machine head position to follow cursor
  machineHead.x = mouseX;
  machineHead.y = mouseY;
  
  // Add new stitch point when mouse moves
  if (mouseIsPressed && (mouseX !== lastX || mouseY !== lastY)) {
    stitches.push({x: mouseX, y: mouseY});
    
    // Keep only the last 200 stitches to prevent memory issues
    if (stitches.length > 200) {
      stitches.shift();
    }
    
    lastX = mouseX;
    lastY = mouseY;
  }
  
  // Draw the seam
  if (stitches.length > 1) {
    stroke(seamColor);
    beginShape();
    for (let i = 0; i < stitches.length; i++) {
      vertex(stitches[i].x, stitches[i].y);
    }
    endShape();
    
    // Draw individual thread units along the seam
    stroke(seamColor);
    strokeWeight(2);
    for (let i = 0; i < stitches.length; i += 3) {
      point(stitches[i].x, stitches[i].y);
    }
  }
  
  // Draw machine head as a visible tracking element
  noStroke();
  fill(200, 200, 200);
  ellipse(machineHead.x, machineHead.y, 12, 12);
  fill(100);
  ellipse(machineHead.x, machineHead.y, 6, 6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
