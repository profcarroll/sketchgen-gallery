let coins = [];
let caseWidth = 400;
let caseHeight = 200;
let caseDepth = 100;
let coinRadius = 8;
let gravity = 0.2;
let friction = 0.99;
let coinSpeed = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Center the case horizontally and vertically
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240);
  
  // Draw wooden case
  fill(139, 69, 19); // Brown color for wood
  noStroke();
  rectMode(CENTER);
  rect(width/2, height/2, caseWidth, caseHeight, 10); // Top of case
  
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
  rect(width/2, height/2 - caseHeight/2 + 10, caseWidth - 20, 20); // Top edge
  
  // Add coins
  if (frameCount % 30 === 0) {
    coins.push({
      x: random(width/2 - caseWidth/2 + coinRadius, width/2 + caseWidth/2 - coinRadius),
      y: height/2 - caseHeight/2 - 20,
      radius: coinRadius,
      vx: random(-0.5, 0.5),
      vy: 0,
      color: color(255, 215, 0), // Gold color
      accumulated: false
    });
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
    
    // Boundary collision
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
    noStroke();
    ellipse(coin.x, coin.y, coin.radius * 2);
    
    // Remove coins that are no longer visible or have settled
    if (coin.y > height + 50) {
      coins.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
