let hourHand, minuteHand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set up clock hands with specific dimensions and styles
  hourHand = {
    length: height * 0.3,
    width: height * 0.025,
    tipRadius: height * 0.012
  };
  minuteHand = {
    length: height * 0.4,
    width: height * 0.015,
    tipRadius: height * 0.008
  };
}

function draw() {
  background(255);
  
  // Center of the clock
  const cx = width / 2;
  const cy = height / 2;
  
  // Get current time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Calculate angles for hands
  // Hour hand: moves 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = (hours * 30) + (minutes * 0.5);
  // Minute hand: moves 6 degrees per minute + 0.1 degrees per second
  const minuteAngle = minutes * 6 + seconds * 0.1;
  
  // Draw hour hand
  push();
  translate(cx, cy);
  rotate(radians(hourAngle));
  drawHand(hourHand);
  pop();
  
  // Draw minute hand
  push();
  translate(cx, cy);
  rotate(radians(minuteAngle));
  drawHand(minuteHand);
  pop();
}

// Function to draw a hand with rounded tip
function drawHand(hand) {
  const { length, width, tipRadius } = hand;
  
  // Draw the main body of the hand as a rectangle with rounded ends
  rectMode(CENTER);
  fill(0);
  noStroke();
  
  // Draw the main body
  rect(0, -length/2, width, length);
  
  // Draw rounded tips
  ellipse(0, -length/2, tipRadius*2, tipRadius*2);
  ellipse(0, length/2, tipRadius*2, tipRadius*2);
}
