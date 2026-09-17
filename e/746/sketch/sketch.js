function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(240);
  
  // Center and radius
  const cx = width / 2;
  const cy = height / 2;
  const r = min(width, height) * 0.4;
  
  // Draw clock face
  noStroke();
  fill(255);
  ellipse(cx, cy, r * 2, r * 2);
  
  // Draw hour markers
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const x1 = cx + (r - 15) * cos(angle);
    const y1 = cy + (r - 15) * sin(angle);
    const x2 = cx + r * cos(angle);
    const y2 = cy + r * sin(angle);
    line(x1, y1, x2, y2);
  }
  
  // Get current time
  const d = new Date();
  const hours = d.getHours() % 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  // Calculate angles for hands
  // Hour hand: moves 0.5 degrees per minute (30 degrees per hour)
  const hourAngle = (hours * 30) + (minutes * 0.5);
  // Minute hand: moves 6 degrees per minute (360 degrees per hour)
  const minuteAngle = minutes * 6;
  
  // Draw hour hand
  stroke(0);
  strokeWeight(8);
  strokeCap(SQUARE);
  line(cx, cy, cx + (r * 0.5) * cos(hourAngle - 90), cy + (r * 0.5) * sin(hourAngle - 90));
  
  // Draw minute hand
  strokeWeight(4);
  line(cx, cy, cx + (r * 0.7) * cos(minuteAngle - 90), cy + (r * 0.7) * sin(minuteAngle - 90));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
