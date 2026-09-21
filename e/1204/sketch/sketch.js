let hourHand, minuteHand;
let clockRadius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  clockRadius = min(width, height) * 0.4;
  // Initialize hand positions to 12:00
  hourHand = { angle: 0 };
  minuteHand = { angle: 0 };
}

function draw() {
  background(240);
  
  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw clock face
  noStroke();
  fill(255);
  ellipse(centerX, centerY, clockRadius * 2, clockRadius * 2);
  
  // Draw metallic hands
  strokeWeight(8);
  stroke(100);
  line(centerX, centerY, 
       centerX + cos(hourHand.angle) * clockRadius * 0.5,
       centerY + sin(hourHand.angle) * clockRadius * 0.5);
  
  strokeWeight(6);
  stroke(150);
  line(centerX, centerY, 
       centerX + cos(minuteHand.angle) * clockRadius * 0.7,
       centerY + sin(minuteHand.angle) * clockRadius * 0.7);
  
  // Update angles for smooth motion
  const seconds = millis() / 1000;
  hourHand.angle = (seconds / 43200) % (TWO_PI); // 12 hours = 43200 seconds
  minuteHand.angle = (seconds / 60) % (TWO_PI); // 1 minute = 60 seconds
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
