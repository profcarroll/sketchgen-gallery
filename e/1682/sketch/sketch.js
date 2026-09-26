let coins = [];
let caseWidth = 400;
let caseHeight = 200;
let coinRadius = 8;
let gravity = 0.2;
let friction = 0.99;
let rippleIntensity = 0;
let rippleTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();
  
  // Initialize coins in a pile
  for (let i = 0; i < 200; i++) {
    coins.push({
      x: random(width/2 - caseWidth/2 + coinRadius, width/2 + caseWidth/2 - coinRadius),
      y: random(height/2 - caseHeight/2 + 50, height/2 + caseHeight/2 - 50),
      radius: coinRadius,
      vx: random(-0.3, 0.3),
      vy: random(-0.2, 0.2),
      color: color(random(240, 255), random(180, 220), 0), // Gold to copper
      accumulated: false,
      originalY: 0
    });
  }
}

function draw() {
  background(240);
  
  // Draw wooden case
  fill(139, 69, 19); // Brown color for wood
  rect(width/2, height/2, caseWidth, caseHeight, 10);
  
  // Draw back of case (depth)
  fill(101, 67, 33); // Darker brown for depth
  beginShape();
  vertex(width/2 - caseWidth/2, height/2 - caseHeight/2);
  vertex(width/2 + caseWidth/2, height/2 - caseHeight/2);
  vertex(width/2 + caseWidth/2, height/2 + caseHeight/2);
  vertex(width/2 - caseWidth/2, height/2 + caseHeight/2);
  endShape(CLOSE);
  
  // Draw open top
  fill(139, 69, 19);
  rect(width/2, height/2 - caseHeight/2 + 10, caseWidth - 20, 20);
  
  // Update ripple effect periodically
  if (frameCount % 150 === 0) {
    rippleTimer = 30;
    rippleIntensity = random(0.5, 1.5);
  }
  
  // Apply ripple effect
  if (rippleTimer > 0) {
    rippleTimer--;
    // Create localized movement in coins
    for (let coin of coins) {
      let dx = coin.x - width/2;
      let dy = coin.y - height/2;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        let force = map(distance, 0, 150, rippleIntensity * 2, 0);
        coin.vx += random(-force, force) * 0.5;
        coin.vy += random(-force, force) * 0.5;
      }
    }
  }
  
  // Update and draw coins
  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];
    
    // Apply gravity
    coin.vy += gravity;
    
    // Apply friction
    coin.vx *= friction;
    coin.vy *= friction;
    
    // Update position
    coin.x += coin.vx;
    coin.y += coin.vy;
    
    // Boundary collision with case walls
    if (coin.x - coin.radius < width/2 - caseWidth/2) {
      coin.x = width/2 - caseWidth/2 + coin.radius;
      coin.vx *= -0.5; // Bounce
    } else if (coin.x + coin.radius > width/2 + caseWidth/2) {
      coin.x = width/2 + caseWidth/2 - coin.radius;
      coin.vx *= -0.5;
    }
    
    // Check if coin hits bottom of case or accumulates
    if (coin.y + coin.radius > height/2 + caseHeight/2 - 10) {
      coin.y = height/2 + caseHeight/2 - 10 - coin.radius;
      coin.vy = 0;
      
      // Accumulate coins at the bottom
      if (!coin.accumulated) {
        coin.accumulated = true;
        coin.vy = 0;
        coin.vx = 0;
      }
    }
    
    // Draw coin
    fill(coin.color);
    ellipse(coin.x, coin.y, coin.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
