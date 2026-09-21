let logs = [];
let planks = [];
let plankCount = 0;
let logRadius = 50;
let plankWidth = 40;
let plankHeight = 10;
let logSpeed = 2;
let gravity = 0.5;
let dropHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Start with a few logs
  for (let i = 0; i < 5; i++) {
    logs.push({
      x: random(-width/2 + logRadius, width/2 - logRadius),
      y: -height/2 - 100 - i * 150,
      z: random(-50, 50),
      angle: random(TWO_PI),
      speed: logSpeed + random(0.5),
      color: color(random(20, 40), 70, 80)
    });
  }
}

function draw() {
  background(220, 10, 95);
  
  // Draw floor
  fill(30, 20, 60);
  push();
  translate(0, height/2 - 20, 0);
  rotateX(HALF_PI);
  plane(width * 1.5, 40);
  pop();
  
  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    log.y += log.speed;
    
    // Rotate log
    log.angle += 0.02;
    
    // Draw log
    push();
    translate(log.x, log.y, log.z);
    rotateY(log.angle);
    fill(log.color);
    cylinder(logRadius, 100, 8, true);
    pop();
    
    // If log passes bottom, create planks
    if (log.y > height/2 - 150) {
      createPlanks(log.x, log.y, log.z, log.angle, log.color);
      logs.splice(i, 1);
    }
  }
  
  // Add new logs occasionally
  if (frameCount % 60 === 0 && logs.length < 8) {
    logs.push({
      x: random(-width/2 + logRadius, width/2 - logRadius),
      y: -height/2 - 100,
      z: random(-50, 50),
      angle: random(TWO_PI),
      speed: logSpeed + random(0.5),
      color: color(random(20, 40), 70, 80)
    });
  }
  
  // Update and draw planks
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    // Apply gravity to falling planks
    if (!plank.settled) {
      plank.y += plank.fallSpeed;
      plank.fallSpeed += gravity;
      
      // Check if plank hits floor
      if (plank.y > height/2 - 30 - plankHeight/2) {
        plank.y = height/2 - 30 - plankHeight/2;
        plank.settled = true;
      }
    }
    
    // Draw plank
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.angle);
    fill(plank.color);
    box(plankWidth, plankHeight, 100);
    pop();
    
    // Remove settled planks that are off screen
    if (plank.settled && plank.y > height/2 + 100) {
      planks.splice(i, 1);
    }
  }
  
  // Stack settled planks
  stackPlanks();
}

function createPlanks(x, y, z, angle, color) {
  let numPlanks = floor(random(3, 6));
  for (let i = 0; i < numPlanks; i++) {
    planks.push({
      x: x + random(-logRadius/2, logRadius/2),
      y: y,
      z: z + random(-10, 10),
      angle: angle + random(-0.2, 0.2),
      color: color,
      fallSpeed: random(1, 3),
      settled: false
    });
  }
}

function stackPlanks() {
  // Stack planks in a neat row at the bottom
  let baseY = height/2 - 30;
  let spacing = plankWidth + 5;
  let startX = -width/2 + spacing/2;
  
  // Sort planks by x position
  planks.sort((a, b) => a.x - b.x);
  
  for (let i = 0; i < planks.length; i++) {
    let plank = planks[i];
    
    if (plank.settled) {
      plank.x = startX + (i % 10) * spacing;
      plank.z = (i / 10) * 50 - 250;
      
      // Keep planks from going too far
      if (plank.x > width/2 - spacing/2) {
        plank.x = width/2 - spacing/2;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
