let hourHand, minuteHand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize hand positions based on current time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  
  hourHand = map(hours, 0, 12, 0, TWO_PI) + map(minutes, 0, 60, 0, TWO_PI/6);
  minuteHand = map(minutes, 0, 60, 0, TWO_PI);
}

function draw() {
  background(240);
  
  // Center of the canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw clock face
  noStroke();
  fill(255);
  ellipse(cx, cy, min(width, height) * 0.9);
  
  // Draw metallic hands
  strokeWeight(8);
  stroke(180, 100, 40); // Copper tone
  
  // Hour hand
  const hourLength = min(width, height) * 0.3;
  const hourX = cx + hourLength * cos(hourHand - HALF_PI);
  const hourY = cy + hourLength * sin(hourHand - HALF_PI);
  line(cx, cy, hourX, hourY);
  
  // Minute hand
  const minuteLength = min(width, height) * 0.4;
  const minuteX = cx + minuteLength * cos(minuteHand - HALF_PI);
  const minuteY = cy + minuteLength * sin(minuteHand - HALF_PI);
  line(cx, cy, minuteX, minuteY);
  
  // Update hand angles
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  hourHand += (TWO_PI / 43200); // 12-hour cycle in seconds
  minuteHand += (TWO_PI / 3600); // 1-hour cycle in seconds
  
  // Keep angles within [0, TWO_PI)
  hourHand %= TWO_PI;
  minuteHand %= TWO_PI;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
