let hourHand, minuteHand;
let centerX, centerY;
let handLength;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  handLength = min(width, height) * 0.4;
  
  // Initialize hands with starting angles
  hourHand = { angle: 0 };
  minuteHand = { angle: 0 };
}

function draw() {
  background(240); // Neutral background
  
  // Draw clock face
  noStroke();
  fill(255);
  ellipse(centerX, centerY, handLength * 2.2, handLength * 2.2);
  
  // Update angles for continuous motion
  const seconds = millis() / 1000;
  hourHand.angle = (seconds / 43200) % 1; // 12 hours = 43200 seconds
  minuteHand.angle = (seconds / 60) % 1;   // 1 minute = 60 seconds
  
  // Convert to radians
  const hourRad = TWO_PI * hourHand.angle;
  const minuteRad = TWO_PI * minuteHand.angle;
  
  // Draw hour hand (shorter, thicker)
  stroke(150, 150, 150); // Brushed nickel color
  strokeWeight(handLength * 0.08);
  line(centerX, centerY, 
       centerX + cos(hourRad) * handLength * 0.6,
       centerY + sin(hourRad) * handLength * 0.6);
  
  // Draw minute hand (longer, thinner)
  stroke(180, 180, 180); // Slightly lighter brushed nickel
  strokeWeight(handLength * 0.04);
  line(centerX, centerY, 
       centerX + cos(minuteRad) * handLength * 0.9,
       centerY + sin(minuteRad) * handLength * 0.9);
  
  // Draw center cap
  noStroke();
  fill(120, 120, 120);
  ellipse(centerX, centerY, handLength * 0.1, handLength * 0.1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  handLength = min(width, height) * 0.4;
}
