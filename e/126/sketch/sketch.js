let roadWidth = 300;
let carWidth = 20;
let carHeight = 40;
let speed = 0;
let maxSpeed = 8;
let acceleration = 0.1;
let deceleration = 0.2;
let steering = 0;
let steeringStrength = 0.05;
let roadCurve = 0;
let curveChange = 0.001;
let sidePaths = [];
let frameCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  speed = maxSpeed;
  // Initialize some side paths
  for (let i = 0; i < 10; i++) {
    sidePaths.push({
      x: random(-roadWidth/2, roadWidth/2),
      y: random(0, height),
      width: random(30, 60),
      height: random(30, 60),
      active: false
    });
  }
}

function draw() {
  background(50);
  
  // Simulate forward motion by moving road elements
  frameCount++;
  
  // Update road curve
  roadCurve += curveChange;
  if (roadCurve > 0.1 || roadCurve < -0.1) {
    curveChange *= -1;
  }
  
  // Draw sky
  fill(135, 206, 235);
  rect(0, 0, width, height/2);
  
  // Draw ground
  fill(34, 139, 34);
  rect(0, height/2, width, height/2);
  
  // Draw road
  let roadX = width/2 - roadWidth/2;
  let roadY = 0;
  let roadHeight = height;
  fill(50);
  rect(roadX, roadY, roadWidth, roadHeight);
  
  // Draw road markings (dashed lines)
  stroke(255);
  strokeWeight(2);
  let dashLength = 30;
  let gapLength = 30;
  for (let y = -dashLength; y < height; y += dashLength + gapLength) {
    line(width/2, y + frameCount * speed / 2 % (dashLength + gapLength), 
         width/2, y + frameCount * speed / 2 % (dashLength + gapLength) + dashLength);
  }
  
  // Draw side paths
  for (let path of sidePaths) {
    if (path.active) {
      fill(100, 100, 100);
      rect(width/2 + path.x - path.width/2, path.y, path.width, path.height);
    }
  }
  
  // Draw car
  let carX = width/2;
  let carY = height - carHeight - 20;
  fill(255, 0, 0);
  rect(carX - carWidth/2, carY, carWidth, carHeight);
  fill(0);
  rect(carX - carWidth/2 + 5, carY + 5, 5, 10); // windows
  rect(carX + carWidth/2 - 10, carY + 5, 5, 10);
  
  // Update speed based on keys
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      steering = -1;
    } else if (keyCode === RIGHT_ARROW) {
      steering = 1;
    } else if (keyCode === 32) { // Space bar
      speed -= deceleration;
    }
  } else {
    steering = 0;
  }
  
  // Apply acceleration
  speed += acceleration;
  if (speed > maxSpeed) speed = maxSpeed;
  
  // Apply steering
  carX += steering * steeringStrength * speed * 10;
  
  // Keep car on road
  if (carX < width/2 - roadWidth/2 + carWidth/2) {
    carX = width/2 - roadWidth/2 + carWidth/2;
  }
  if (carX > width/2 + roadWidth/2 - carWidth/2) {
    carX = width/2 + roadWidth/2 - carWidth/2;
  }
  
  // Move side paths with the road
  for (let path of sidePaths) {
    path.y += speed;
    if (path.y > height) {
      path.y = -path.height;
      path.x = random(-roadWidth/2, roadWidth/2);
      path.active = random() > 0.7; // Randomly activate some paths
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
