let hourHand, minuteHand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize hand positions based on current time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  
  // Convert to radians for rotation
  hourHand = (hours * 60 + minutes) / 720 * TWO_PI;
  minuteHand = minutes / 60 * TWO_PI;
}

function draw() {
  background(240);
  
  // Center of the canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Clock size
  const size = min(width, height) * 0.4;
  
  // Draw clock face
  noStroke();
  fill(255);
  ellipse(cx, cy, size, size);
  
  // Draw hour hand
  strokeWeight(size * 0.08);
  stroke(30);
  line(cx, cy, cx + cos(hourHand) * size * 0.4, cy + sin(hourHand) * size * 0.4);
  
  // Draw minute hand
  strokeWeight(size * 0.05);
  stroke(60);
  line(cx, cy, cx + cos(minuteHand) * size * 0.6, cy + sin(minuteHand) * size * 0.6);
  
  // Update hands for next frame
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  hourHand = (hours * 60 + minutes + seconds/60) / 720 * TWO_PI;
  minuteHand = (minutes + seconds/60) / 60 * TWO_PI;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
