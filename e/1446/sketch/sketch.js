function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(240);
  
  // Draw clock face
  strokeWeight(2);
  noFill();
  ellipse(0, 0, width * 0.9, height * 0.9);
  
  // Get current time
  const hours = hour();
  const minutes = minute();
  const seconds = second();
  
  // Calculate angles with smooth movement
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minAngle = minutes * 6 + seconds * 0.1;
  
  // Draw hour hand
  push();
  translate(0, 0);
  rotate(hourAngle);
  stroke(200, 100, 50); // Copper color
  strokeWeight(8);
  line(0, 0, 0, -height * 0.3);
  pop();
  
  // Draw minute hand
  push();
  translate(0, 0);
  rotate(minAngle);
  stroke(200, 100, 50); // Copper color
  strokeWeight(4);
  line(0, 0, 0, -height * 0.4);
  pop();
  
  // Draw center cap
  fill(180, 90, 40);
  noStroke();
  ellipse(0, 0, 15, 15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
