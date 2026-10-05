let batPositions = [];
let batVelocities = [];
let candleFlame;
let centerX, centerY;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize bats in concentric circles around the center
  for (let i = 0; i < 30; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 400); // Concentric circles
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    batPositions.push(createVector(x, y));
    
    // Velocity tangent to circle path
    let velAngle = angle + PI/2;
    batVelocities.push(createVector(cos(velAngle) * 0.5, sin(velAngle) * 0.5));
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
  translate(centerX, centerY);
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
  
  // Draw bats in concentric orbits
  for (let i = 0; i < batPositions.length; i++) {
    let pos = batPositions[i];
    let vel = batVelocities[i];
    
    // Update position along circular path
    pos.add(vel);
    
    // Keep bats in orbit by recalculating their positions
    let dx = pos.x - centerX;
    let dy = pos.y - centerY;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      // Normalize and scale back to circular orbit
      let normX = dx / dist;
      let normY = dy / dist;
      let targetDist = 150 + sin(frameCount * 0.02 + i) * 100; // Varying orbit radius
      pos.x = centerX + normX * targetDist;
      pos.y = centerY + normY * targetDist;
    }
    
    // Draw bat body
    fill(100, 50, 100);
    ellipse(pos.x, pos.y, 20, 10); // Bat body
    
    // Draw wings
    fill(80, 40, 80);
    ellipse(pos.x - 10, pos.y - 5, 15, 8);
    ellipse(pos.x + 10, pos.y - 5, 15, 8);
  }
}
