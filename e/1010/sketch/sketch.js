function setup() {
  createCanvas(windowWidth, windowHeight);
  // Center of canvas
  cx = width / 2;
  cy = height / 2;
  // Clock radius
  r = min(width, height) * 0.4;
}

function draw() {
  background(245);
  
  // Draw clock face
  noStroke();
  fill(250);
  ellipse(cx, cy, r * 2, r * 2);
  
  // Draw hour hand
  let h = hour();
  let m = minute();
  let s = second();
  
  // Calculate angles (in radians)
  let hourAngle = map(h % 12, 0, 12, 0, TWO_PI) + map(m, 0, 60, 0, TWO_PI / 12);
  let minuteAngle = map(m, 0, 60, 0, TWO_PI) + map(s, 0, 60, 0, TWO_PI / 60);
  
  // Hour hand
  stroke(150, 100, 50); // Bronze color
  strokeWeight(r * 0.07);
  line(cx, cy, cx + cos(hourAngle) * r * 0.5, cy + sin(hourAngle) * r * 0.5);
  
  // Minute hand
  stroke(130, 90, 40); // Slightly darker bronze
  strokeWeight(r * 0.04);
  line(cx, cy, cx + cos(minuteAngle) * r * 0.7, cy + sin(minuteAngle) * r * 0.7);
  
  // Draw center cap
  noStroke();
  fill(100, 70, 30);
  ellipse(cx, cy, r * 0.1, r * 0.1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;
  r = min(width, height) * 0.4;
}
