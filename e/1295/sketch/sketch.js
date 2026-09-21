let strands = [];
let tearPoints = [];
let tearRadius = 0;
let maxTearRadius = 150;
let tearDecay = 2;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create complex knot structure with multiple intertwined strands
  const numStrands = 8;
  const numPoints = 200;
  
  for (let s = 0; s < numStrands; s++) {
    let strand = [];
    for (let i = 0; i < numPoints; i++) {
      // Create a helical pattern with some randomness
      const t = map(i, 0, numPoints, 0, TWO_PI * 4);
      const radius = 80 + sin(t * 3) * 20;
      const x = cos(t + s * 0.5) * radius;
      const y = sin(t + s * 0.5) * radius;
      const z = sin(t * 2 + s * 0.3) * 100;
      
      strand.push(createVector(x, y, z));
    }
    strands.push(strand);
  }
}

function draw() {
  background(0);
  
  // Create a subtle rotation to make it more dynamic
  rotateY(frameCount * 0.002);
  rotateX(sin(frameCount * 0.001) * 0.2);
  
  // Draw the knot structure
  push();
  translate(0, 0, -50);
  
  for (let s = 0; s < strands.length; s++) {
    const strand = strands[s];
    
    // Draw each strand with a different color
    const hue = (s * 45) % 360;
    fill(hue, 80, 90, 0.8);
    
    beginShape();
    for (let i = 0; i < strand.length; i++) {
      const v = strand[i];
      vertex(v.x, v.y, v.z);
    }
    endShape();
  }
  
  pop();
  
  // Handle tearing effect
  if (tearPoints.length > 0) {
    tearRadius -= tearDecay;
    if (tearRadius <= 0) {
      tearPoints = [];
      tearRadius = 0;
    }
  }
  
  // Draw the tear effect
  if (tearPoints.length > 0) {
    noFill();
    stroke(255, 0.7);
    strokeWeight(2);
    
    for (let i = 0; i < tearPoints.length; i++) {
      const p = tearPoints[i];
      ellipse(p.x, p.y, tearRadius * 2);
    }
  }
}

function mouseDragged() {
  // Create a tear effect at the drag location
  const currentTearRadius = min(tearRadius + 10, maxTearRadius);
  if (currentTearRadius > tearRadius) {
    tearRadius = currentTearRadius;
    tearPoints.push(createVector(mouseX - width/2, mouseY - height/2));
  }
  
  // Limit number of tears to prevent memory issues
  if (tearPoints.length > 50) {
    tearPoints.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
