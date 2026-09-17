function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(240);
  
  // Center of the canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw the clock face
  noStroke();
  fill(255);
  ellipse(cx, cy, 300, 300);
  
  // Draw the hour hand
  const hourAngle = (hour() % 12) * 30 + minute() * 0.5;
  const hourLength = 100;
  const hourX = cx + hourLength * cos(hourAngle - PI/2);
  const hourY = cy + hourLength * sin(hourAngle - PI/2);
  
  stroke(0);
  strokeWeight(6);
  line(cx, cy, hourX, hourY);
  
  // Draw the minute hand
  const minuteAngle = minute() * 6 + second() * 0.1;
  const minuteLength = 140;
  const minuteX = cx + minuteLength * cos(minuteAngle - PI/2);
  const minuteY = cy + minuteLength * sin(minuteAngle - PI/2);
  
  strokeWeight(3);
  line(cx, cy, minuteX, minuteY);
  
  // Draw the center point
  noStroke();
  fill(0);
  ellipse(cx, cy, 10, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
