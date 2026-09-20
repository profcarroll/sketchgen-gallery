let hourHand, minuteHand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize hand positions based on current time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  
  // Convert to radians (0° at top)
  hourHand = radians((hours * 60 + minutes) / 60 * 30);
  minuteHand = radians(minutes * 6);
}

function draw() {
  background(245);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Determine max radius based on smaller dimension
  const maxRadius = min(width, height) * 0.4;
  
  // Draw clock face (minimalist)
  noStroke();
  fill(255);
  ellipse(cx, cy, maxRadius * 2, maxRadius * 2);
  
  // Metallic finish for hands using gradient effect
  const handLength = maxRadius * 0.8;
  const handWidth = maxRadius * 0.04;
  
  // Hour hand
  push();
  translate(cx, cy);
  rotate(hourHand);
  fill(180, 140, 50); // Bronze-like color
  noStroke();
  rect(-handWidth/2, -handLength*0.7, handWidth, handLength*0.7);
  pop();
  
  // Minute hand
  push();
  translate(cx, cy);
  rotate(minuteHand);
  fill(180, 140, 50); // Bronze-like color
  noStroke();
  rect(-handWidth/2, -handLength*0.9, handWidth, handLength*0.9);
  pop();
  
  // Center cap
  fill(100);
  ellipse(cx, cy, maxRadius * 0.1, maxRadius * 0.1);
  
  // Update angles for next frame
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  hourHand += radians(1/60 * 30) / 60; // Move 1/60th of an hour hand degree per second
  minuteHand += radians(1/60 * 360) / 60; // Move 1/60th of a minute hand degree per second
  
  // Ensure the angles stay within [0, 2*PI)
  hourHand %= TWO_PI;
  minuteHand %= TWO_PI;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
