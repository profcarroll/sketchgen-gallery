let stitches = [];
let lastX, lastY;
let seamColor;
let machineHead;
let minStitchLength = 8;
let maxStitchLength = 15;
let minStitchSpacing = 10;
let maxStitchSpacing = 25;

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
    // Only add a stitch if we've moved enough to justify one
    let dx = mouseX - lastX;
    let dy = mouseY - lastY;
    let distance = sqrt(dx * dx + dy * dy);
    
    // Randomly vary stitch spacing and length based on mouse movement
    let spacingVariation = map(distance, 0, 50, minStitchSpacing, maxStitchSpacing);
    let lengthVariation = map(distance, 0, 50, minStitchLength, maxStitchLength);
    
    // Add some randomness to make it look more natural
    let randomSpacing = random(spacingVariation * 0.7, spacingVariation * 1.3);
    let randomLength = random(lengthVariation * 0.7, lengthVariation * 1.3);
    
    if (distance >= randomSpacing / 2) {
      stitches.push({
        x: mouseX,
        y: mouseY,
        length: randomLength,
        spacing: randomSpacing
      });
      
      // Keep only the last 200 stitches to prevent memory issues
      if (stitches.length > 200) {
        stitches.shift();
      }
      
      lastX = mouseX;
      lastY = mouseY;
    }
  }
  
  // Draw the seam with discrete, varying stitches
  if (stitches.length > 1) {
    stroke(seamColor);
    strokeWeight(2);
    
    for (let i = 0; i < stitches.length - 1; i++) {
      let current = stitches[i];
      let next = stitches[i + 1];
      
      // Calculate direction vector
      let dx = next.x - current.x;
      let dy = next.y - current.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        // Normalize direction
        dx /= dist;
        dy /= dist;
        
        // Draw a stitch segment with varying length
        let endX = current.x + dx * current.length;
        let endY = current.y + dy * current.length;
        
        line(current.x, current.y, endX, endY);
      }
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
