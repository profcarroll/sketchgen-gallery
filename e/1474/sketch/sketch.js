let stitches = [];
let lastX, lastY;
let seamColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seamColor = color(255, 215, 0); // Gold color for the seam
  strokeWeight(3);
  noFill();
  lastX = -1;
  lastY = -1;
}

function draw() {
  background(30);
  
  if (mouseX !== lastX || mouseY !== lastY) {
    // Add a new stitch point
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
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
