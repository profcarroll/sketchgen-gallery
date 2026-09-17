let roadWidth = 200;
let roadLength = 1000;
let segmentLength = 50;
let segments = [];
let playerX = 0;
let playerY = 0;
let speed = 0;
let maxSpeed = 8;
let acceleration = 0.2;
let deceleration = 0.1;
let steering = 0;
let steerSpeed = 0.05;
let obstacles = [];
let curve = 0;
let curveDirection = 1;
let curveChangeTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = width / 2;
  playerY = height - 100;
  
  // Create road segments
  for (let i = 0; i < roadLength / segmentLength; i++) {
    segments.push({
      y: i * segmentLength,
      curve: 0
    });
  }
  
  // Generate obstacles
  for (let i = 0; i < 20; i++) {
    obstacles.push({
      x: random(-roadWidth/2 + 20, roadWidth/2 - 20),
      y: random(-height, height * 2),
      size: random(10, 30)
    });
  }
}

function draw() {
  background(50);
  
  // Update curve
  curveChangeTimer++;
  if (curveChangeTimer > 120) {
    curveDirection = random([-1, 1]);
    curveChangeTimer = 0;
  }
  curve += curveDirection * 0.001;
  
  // Handle input
  if (keyIsDown(LEFT_ARROW)) {
    steering = -1;
  } else if (keyIsDown(RIGHT_ARROW)) {
    steering = 1;
  } else {
    steering = 0;
  }
  
  if (keyIsDown(32)) { // Space bar
    speed -= deceleration;
  } else {
    speed += acceleration;
  }
  
  speed = constrain(speed, 0, maxSpeed);
  
  // Update player position
  playerX += steering * speed * 0.5;
  playerX = constrain(playerX, -roadWidth/2 + 20, roadWidth/2 - 20);
  
  // Draw road
  drawRoad();
  
  // Draw obstacles
  drawObstacles();
  
  // Draw player
  drawPlayer();
}

function drawRoad() {
  push();
  translate(width/2, height/2);
  
  // Draw main road
  stroke(255);
  strokeWeight(4);
  noFill();
  
  beginShape();
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let x = segment.curve + playerX;
    let y = segment.y - height/2;
    
    // Apply curve effect
    let curveEffect = sin(y * 0.01 + frameCount * 0.02) * 30;
    x += curveEffect;
    
    vertex(x, y);
  }
  endShape();
  
  // Draw road boundaries
  stroke(255, 100);
  strokeWeight(2);
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let x1 = -roadWidth/2 + segment.curve + playerX;
    let y1 = segment.y - height/2;
    let x2 = roadWidth/2 + segment.curve + playerX;
    let y2 = segment.y - height/2;
    
    line(x1, y1, x2, y2);
  }
  
  // Draw side roads
  stroke(100);
  strokeWeight(1);
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let x1 = -roadWidth/2 - 50 + segment.curve + playerX;
    let y1 = segment.y - height/2;
    let x2 = -roadWidth/2 + segment.curve + playerX;
    let y2 = segment.y - height/2;
    
    line(x1, y1, x2, y2);
    
    x1 = roadWidth/2 + 50 + segment.curve + playerX;
    x2 = roadWidth/2 + segment.curve + playerX;
    
    line(x1, y1, x2, y2);
  }
  
  pop();
}

function drawObstacles() {
  push();
  translate(width/2, height/2);
  
  for (let obstacle of obstacles) {
    let x = obstacle.x + playerX;
    let y = obstacle.y - height/2;
    
    fill(200, 50, 50);
    noStroke();
    ellipse(x, y, obstacle.size, obstacle.size);
  }
  
  pop();
}

function drawPlayer() {
  push();
  translate(width/2 + playerX, height/2 + playerY);
  
  fill(100, 200, 255);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(0, 0, 30, 60);
  
  // Draw windows
  fill(200, 240, 255);
  rect(-8, -10, 10, 20);
  rect(8, -10, 10, 20);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
