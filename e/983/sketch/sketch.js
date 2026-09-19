let trail = [];
let lastX, lastY;
let inkColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  inkColor = color(0, 30); // Semi-transparent black for ink
}

function draw() {
  // Update the trail with current mouse position
  if (mouseIsPressed) {
    if (lastX !== undefined && lastY !== undefined) {
      // Add a new point to the trail
      trail.push({ x: mouseX, y: mouseY, age: 0 });
      
      // Draw a line from last point to current point
      stroke(inkColor);
      strokeWeight(2);
      line(lastX, lastY, mouseX, mouseY);
    }
    
    lastX = mouseX;
    lastY = mouseY;
  } else {
    lastX = undefined;
    lastY = undefined;
  }

  // Update ages and fade out old points
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].age++;
    
    // Remove very old points
    if (trail[i].age > 100) {
      trail.splice(i, 1);
    }
  }

  // Draw the trail points with varying opacity based on age
  noStroke();
  for (let point of trail) {
    let alpha = map(point.age, 0, 100, 30, 0); // Fade out over time
    fill(0, alpha);
    ellipse(point.x, point.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
