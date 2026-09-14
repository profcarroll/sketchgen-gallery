let roadWidth = 400;
let roadX = 0;
let speed = 5;
let carX = 0;
let carY = 300;
let acceleration = 0;
let braking = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  roadX = width / 2 - roadWidth / 2;
}

function draw() {
  background(100);

  // Draw sky
  fill(135, 206, 235);
  rect(0, 0, width, height / 2);

  // Draw ground
  fill(34, 139, 34);
  rect(0, height / 2, width, height / 2);

  // Draw road
  fill(50);
  rect(roadX, 0, roadWidth, height);

  // Draw road lines
  fill(255);
  for (let i = 0; i < height; i += 40) {
    rect(width / 2 - 10, i + frameCount * speed % 40, 20, 20);
  }

  // Draw car
  fill(255, 0, 0);
  rect(width / 2 + carX - 20, carY - 30, 40, 60);

  // Update car position
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      carX -= 5;
    }
    if (keyCode === RIGHT_ARROW) {
      carX += 5;
    }
    if (keyCode === UP_ARROW) {
      acceleration = 0.2;
    } else if (keyCode === DOWN_ARROW) {
      acceleration = -0.2;
    }
  }

  // Apply braking
  if (braking) {
    acceleration -= 0.5;
  }

  speed += acceleration;
  if (speed < 0) speed = 0;
  if (speed > 10) speed = 10;

  // Reset acceleration
  acceleration = 0;

  // Reset braking after one frame
  braking = false;

  // Curve the road slightly
  roadX += sin(frameCount * 0.02) * 0.5;
}

function keyPressed() {
  if (key === ' ') {
    braking = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  carY = height - 100;
}
