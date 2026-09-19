let hourHand, minuteHand;
let clockRadius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  clockRadius = min(width, height) * 0.4;
  // Initialize hand positions
  hourHand = { angle: 0 };
  minuteHand = { angle: 0 };
}

function draw() {
  background(240); // Neutral background
  
  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw clock face
  noStroke();
  fill(230);
  ellipse(centerX, centerY, clockRadius * 2, clockRadius * 2);
  
  // Draw hands
  strokeWeight(4);
  stroke(180, 120, 60); // Muted copper color
  
  // Hour hand
  const hourAngle = (hour() % 12) * (PI / 6) + minute() * (PI / 360);
  const hourX = centerX + cos(hourAngle - PI/2) * clockRadius * 0.5;
  const hourY = centerY + sin(hourAngle - PI/2) * clockRadius * 0.5;
  line(centerX, centerY, hourX, hourY);
  
  // Minute hand
  const minuteAngle = minute() * (PI / 30) + second() * (PI / 1800);
  const minuteX = centerX + cos(minuteAngle - PI/2) * clockRadius * 0.75;
  const minuteY = centerY + sin(minuteAngle - PI/2) * clockRadius * 0.75;
  line(centerX, centerY, minuteX, minuteY);
  
  // Draw center cap
  noStroke();
  fill(150, 90, 40);
  ellipse(centerX, centerY, clockRadius * 0.1, clockRadius * 0.1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
