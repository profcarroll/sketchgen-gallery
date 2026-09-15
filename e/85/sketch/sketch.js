let snowboarder;
let trail = [];
let particles = [];
let health = 100;
let courseHeight = 500;
let courseWidth = 800;
let gravity = 0.2;
let jumpForce = -6;
let isJumping = false;
let gameRunning = true;

class Snowboarder {
  constructor() {
    this.x = courseWidth / 2;
    this.y = 100;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.width = 20;
    this.height = 40;
    this.color = [255, 255, 255];
    this.trailColor = [255, 255, 255];
  }

  update() {
    if (!gameRunning) return;

    // Apply gravity
    this.vy += gravity;

    // Update position
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // Boundary checks
    if (this.x < 0 || this.x > courseWidth) {
      health -= 5;
      if (health <= 0) gameRunning = false;
    }

    // Add to trail
    if (frameCount % 2 === 0) {
      trail.push({
        x: this.x,
        y: this.y,
        z: this.z,
        color: this.trailColor,
        size: random(3, 7)
      });
    }

    // Remove old trail points
    if (trail.length > 100) {
      trail.shift();
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateY(frameCount * 0.02);
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();
    box(this.width, this.height, this.width / 2);
    pop();
  }
}

function setup() {
  createCanvas(courseWidth, courseHeight, WEBGL);
  snowboarder = new Snowboarder();
}

function draw() {
  background(135, 206, 235);

  // Create a simple mountain terrain
  push();
  translate(0, 0, -200);
  rotateX(PI / 3);
  fill(240, 240, 240);
  noStroke();
  plane(courseWidth, courseHeight);
  pop();

  // Draw trail
  for (let i = 0; i < trail.length; i++) {
    let point = trail[i];
    push();
    translate(point.x - courseWidth / 2, point.y - courseHeight / 2, point.z);
    fill(point.color[0], point.color[1], point.color[2]);
    noStroke();
    sphere(point.size);
    pop();
  }

  // Draw snowboarder
  if (gameRunning) {
    snowboarder.update();
  }
  snowboarder.display();

  // Draw health bar
  fill(0);
  rect(-courseWidth / 2 + 10, -courseHeight / 2 + 10, 100, 20);
  fill(255, 0, 0);
  rect(-courseWidth / 2 + 10, -courseHeight / 2 + 10, health * 0.8, 20);

  // Game over screen
  if (!gameRunning) {
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Game Over", 0, 0);
  }
}

function keyPressed() {
  if (!gameRunning) return;

  switch (keyCode) {
    case LEFT_ARROW:
      snowboarder.vx = -3;
      break;
    case RIGHT_ARROW:
      snowboarder.vx = 3;
      break;
    case UP_ARROW:
      snowboarder.vz = -2;
      break;
    case DOWN_ARROW:
      snowboarder.vz = 2;
      break;
    case 32: // Spacebar
      if (!isJumping) {
        snowboarder.vy = jumpForce;
        isJumping = true;
      }
      break;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    snowboarder.vx = 0;
  } else if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    snowboarder.vz = 0;
  }
}
