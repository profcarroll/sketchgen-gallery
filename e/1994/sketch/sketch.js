let ekgData = [];
let linePos = 0;
let isPlaying = false;
let beeswaxPoints = [];

function setup() {
  createCanvas(800, 400);
  background(0);
  
  // Initialize beeswax points with random positions
  for (let i = 0; i < 500; i++) {
    beeswaxPoints.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  // Clear with a semi-transparent overlay for trail effect
  fill(0, 15);
  rect(0, 0, width, height);
  
  // Generate new EKG point
  let newY = 200 + random(-50, 50);
  if (random() < 0.05) { // occasional big spike
    newY += random(-100, 100);
  }
  
  ekgData.push(newY);
  if (ekgData.length > width) {
    ekgData.shift();
  }
  
  // Draw EKG line with granular beeswax effect
  stroke(255, 255, 0); // Neon yellow
  strokeWeight(2);
  noFill();
  beginShape();
  
  for (let i = 0; i < ekgData.length; i++) {
    let x = i + linePos;
    let y = ekgData[i];
    
    // Apply pulsing motion to each point
    let pulse = sin(frameCount * 0.05 + i * 0.1) * 0.5 + 1;
    y *= pulse;
    
    vertex(x, y);
  }
  endShape();
  
  // Draw granular beeswax particles
  noStroke();
  for (let point of beeswaxPoints) {
    point.pulse += point.pulseSpeed;
    let pulse = sin(point.pulse) * 0.5 + 1;
    let size = point.size * pulse;
    
    fill(255, 255, 0, 100);
    ellipse(point.x, point.y, size, size);
  }
  
  linePos++;
}

function mousePressed() {
  if (!isPlaying) {
    isPlaying = true;
  }
}
