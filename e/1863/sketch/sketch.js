let batPositions = [];
let batVelocities = [];
let candleFlame;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize bats
  for (let i = 0; i < 20; i++) {
    batPositions.push(createVector(random(width), random(height)));
    batVelocities.push(createVector(random(-1.5, 1.5), random(-1.5, 1.5)));
  }
  
  // Create candle flame effect with intense pulsation
  candleFlame = createGraphics(100, 100);
  candleFlame.noStroke();
  candleFlame.colorMode(HSB);
  for (let i = 0; i < 100; i++) {
    let angle = random(TWO_PI);
    let dist = random(10, 40);
    let x = 50 + cos(angle) * dist;
    let y = 50 + sin(angle) * dist;
    let size = random(1, 2);
    candleFlame.fill(random(20, 40), 100, 100, 150);
    candleFlame.ellipse(x, y, size, size);
  }
}

function draw() {
  // Draw the background
  background(0);
  
  // Draw pumpkin with smile and candle
  push();
  translate(width/2, height/2);
  fill(255, 100, 100); // Pumpkin color
  ellipse(0, 0, 300, 300); // Main pumpkin
  
  // Draw smile
  fill(0);
  arc(0, 50, 150, 80, 0, PI, CHORD); // Smile
  
  // Draw eyes
  fill(0);
  ellipse(-60, -30, 40, 40); // Left eye
  ellipse(60, -30, 40, 40);  // Right eye
  
  // Draw candle flame with intense pulsation
  let pulse = sin(frameCount * 0.2) * 0.8 + 0.8; // More intense pulsation
  push();
  scale(1 + pulse * 0.5);
  image(candleFlame, -20, -150);
  pop();
  
  pop();
  
  // Draw bats
  for (let i = 0; i < batPositions.length; i++) {
    let pos = batPositions[i];
    let vel = batVelocities[i];
    
    // Update position
    pos.add(vel);
    
    // Bounce off edges
    if (pos.x < 0 || pos.x > width) vel.x *= -1;
    if (pos.y < 0 || pos.y > height) vel.y *= -1;
    
    // Draw bat
    fill(100, 50, 100);
    ellipse(pos.x, pos.y, 20, 10); // Bat body
    
    // Draw wings
    fill(80, 40, 80);
    ellipse(pos.x - 10, pos.y - 5, 15, 8);
    ellipse(pos.x + 10, pos.y - 5, 15, 8);
  }
}
