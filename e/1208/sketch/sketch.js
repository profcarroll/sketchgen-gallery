let ekgData = [];
let linePos = 0;
let isPlaying = false;

function setup() {
  createCanvas(800, 400);
  background(0);
  noLoop();
}

function draw() {
  if (!isPlaying) return;
  
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
  
  // Draw EKG line
  stroke(255, 255, 0); // Neon yellow
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < ekgData.length; i++) {
    vertex(i, ekgData[i]);
  }
  endShape();
  
  linePos++;
}

function mousePressed() {
  if (!isPlaying) {
    isPlaying = true;
    loop();
  }
}
