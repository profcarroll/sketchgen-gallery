let balloons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create floating balloons with varying properties
  for (let i = 0; i < 20; i++) {
    balloons.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.3, 0.3),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      bobPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(180, 220, 255); // Sky blue background
  
  // Update and display balloons
  for (let balloon of balloons) {
    // Gentle floating motion with bobbing effect
    balloon.x += balloon.speedX;
    balloon.y += balloon.speedY + sin(balloon.bobPhase) * 0.2;
    balloon.bobPhase += 0.02;
    
    // Wrap around screen edges
    if (balloon.x > width + balloon.size) balloon.x = -balloon.size;
    if (balloon.x < -balloon.size) balloon.x = width + balloon.size;
    if (balloon.y > height + balloon.size) balloon.y = -balloon.size;
    if (balloon.y < -balloon.size) balloon.y = height + balloon.size;
    
    // Draw the balloon
    fill(balloon.color);
    noStroke();
    ellipse(balloon.x, balloon.y, balloon.size, balloon.size * 1.2);
    
    // Add a simple string
    stroke(200);
    strokeWeight(1);
    line(balloon.x, balloon.y + balloon.size * 0.6, balloon.x, balloon.y + balloon.size * 1.2);
  }
}

function mousePressed() {
  // When clicked, make all balloons move to new random positions briefly
  for (let balloon of balloons) {
    balloon.x = random(width);
    balloon.y = random(height);
    balloon.speedX = random(-0.5, 0.5);
    balloon.speedY = random(-0.3, 0.3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
