let snowboarder = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  isJumping: false,
  jumpTimer: 0,
  tricks: [],
  damage: 0
};

let course = [];
let sidewalls = [];
let gravity = 0.5;
let jumpPower = -12;
let speed = 3;
let groundLevel = 0;
let gameRunning = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetCourse();
  snowboarder.x = width / 2;
  snowboarder.y = height * 0.2;
  groundLevel = height * 0.8;
}

function draw() {
  background(150, 200, 255);
  
  if (gameRunning) {
    updateSnowboarder();
    checkCollisions();
    drawCourse();
    drawSnowboarder();
  } else {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width/2, height/2);
    textSize(16);
    text("Press R to restart", width/2, height/2 + 40);
  }
}

function resetCourse() {
  course = [];
  sidewalls = [];
  
  // Generate terrain
  for (let i = 0; i < 50; i++) {
    course.push({
      x: i * 50,
      y: height * 0.8 + sin(i * 0.2) * 30 + random(-10, 10),
      width: 50
    });
  }
  
  // Generate sidewalls
  for (let i = 0; i < course.length; i++) {
    sidewalls.push({
      x: course[i].x - 20,
      y: course[i].y,
      width: 20,
      height: 50
    });
    
    sidewalls.push({
      x: course[i].x + course[i].width,
      y: course[i].y,
      width: 20,
      height: 50
    });
  }
}

function updateSnowboarder() {
  // Handle controls
  if (keyIsDown(LEFT_ARROW)) {
    snowboarder.vx -= 0.3;
    snowboarder.angle = -0.2;
  } else if (keyIsDown(RIGHT_ARROW)) {
    snowboarder.vx += 0.3;
    snowboarder.angle = 0.2;
  } else {
    snowboarder.vx *= 0.9;
    snowboarder.angle *= 0.9;
  }
  
  // Jumping
  if (keyIsPressed && keyCode === 32) { // Spacebar
    if (!snowboarder.isJumping) {
      snowboarder.vy = jumpPower;
      snowboarder.isJumping = true;
      snowboarder.jumpTimer = 0;
    }
  }
  
  // Tricks
  if (keyIsPressed && keyCode === 81) { // Q key
    snowboarder.tricks.push("360");
  }
  if (keyIsPressed && keyCode === 87) { // W key
    snowboarder.tricks.push("540");
  }
  
  // Apply physics
  snowboarder.vy += gravity;
  snowboarder.x += snowboarder.vx;
  snowboarder.y += snowboarder.vy;
  
  // Update jump timer
  if (snowboarder.isJumping) {
    snowboarder.jumpTimer++;
    if (snowboarder.jumpTimer > 30) {
      snowboarder.isJumping = false;
    }
  }
  
  // Keep on course
  let currentSegment = Math.floor(snowboarder.x / 50);
  if (currentSegment >= 0 && currentSegment < course.length) {
    let targetY = course[currentSegment].y - 30;
    if (snowboarder.y > targetY) {
      snowboarder.y = targetY;
      snowboarder.vy = 0;
      snowboarder.isJumping = false;
    }
  }
  
  // Boundary checks
  if (snowboarder.x < 0 || snowboarder.x > width) {
    snowboarder.damage += 10;
  }
  
  // Update damage counter
  if (snowboarder.damage >= 100) {
    gameRunning = false;
  }
}

function checkCollisions() {
  for (let wall of sidewalls) {
    if (
      snowboarder.x > wall.x &&
      snowboarder.x < wall.x + wall.width &&
      snowboarder.y > wall.y &&
      snowboarder.y < wall.y + wall.height
    ) {
      snowboarder.damage += 5;
    }
  }
}

function drawCourse() {
  // Draw ground
  fill(200, 230, 255);
  noStroke();
  beginShape();
  for (let segment of course) {
    vertex(segment.x, segment.y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Draw sidewalls
  fill(100, 100, 100);
  for (let wall of sidewalls) {
    rect(wall.x, wall.y, wall.width, wall.height);
  }
  
  // Draw damage counter
  fill(0);
  textSize(16);
  text(`Damage: ${snowboarder.damage}`, 20, 30);
}

function drawSnowboarder() {
  push();
  translate(snowboarder.x, snowboarder.y);
  rotate(snowboarder.angle);
  
  // Draw snowboarder body
  fill(255, 0, 0);
  ellipse(0, -10, 20, 30);
  
  // Draw snowboard
  fill(0, 0, 255);
  rect(-20, 15, 40, 5);
  
  // Draw tricks
  if (snowboarder.tricks.length > 0) {
    fill(255, 255, 0);
    ellipse(0, -20, 10, 10);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetCourse();
  snowboarder.x = width / 2;
  snowboarder.y = height * 0.2;
}

function mousePressed() {
  if (!gameRunning) {
    gameRunning = true;
    snowboarder.damage = 0;
    snowboarder.x = width / 2;
    snowboarder.y = height * 0.2;
    snowboarder.vx = 0;
    snowboarder.vy = 0;
    snowboarder.isJumping = false;
    snowboarder.jumpTimer = 0;
    snowboarder.tricks = [];
  }
}
