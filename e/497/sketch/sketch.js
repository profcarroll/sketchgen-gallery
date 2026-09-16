let snowboarder;
let course;
let walls = [];
let damage = 0;
let maxDamage = 100;
let gameRunning = true;
let cameraOffset = 0;

class Snowboarder {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.z = 0;
    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;
    this.onGround = false;
    this.jumpPower = -15;
    this.gravity = 0.8;
    this.speed = 5;
    this.recoil = 0;
    this.width = 20;
    this.height = 40;
  }

  update() {
    if (!gameRunning) return;

    // Apply gravity
    this.velY += this.gravity;

    // Handle input
    if (keyIsDown(LEFT_ARROW)) {
      this.velX = -this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velX = this.speed;
    } else {
      this.velX *= 0.8; // Friction
    }

    if (keyIsDown(UP_ARROW) && this.onGround) {
      this.velY = this.jumpPower;
      this.onGround = false;
    }

    // Update position
    this.x += this.velX;
    this.y += this.velY;
    this.z += this.velZ;

    // Apply recoil from collisions
    if (this.recoil > 0) {
      this.recoil -= 1;
    }

    // Keep within bounds
    this.x = constrain(this.x, 50, width - 50);

    // Ground collision
    if (this.y > height - 50) {
      this.y = height - 50;
      this.velY = 0;
      this.onGround = true;
    }

    // Wall collision
    for (let wall of walls) {
      if (abs(this.x - wall.x) < wall.width / 2 + this.width / 2 &&
          abs(this.y - wall.y) < wall.height / 2 + this.height / 2) {
        // Damage from collision
        damage += 5;
        this.recoil = 10;
        this.velX *= -0.5;
        this.velY *= -0.3;

        if (damage >= maxDamage) {
          gameRunning = false;
        }
      }
    }

    // Camera follows snowboarder
    cameraOffset = this.x - width / 2;
  }

  display() {
    push();
    translate(-cameraOffset, 0);

    // Draw snowboarder with recoil effect
    fill(255);
    if (this.recoil > 0) {
      fill(255, 100, 100); // Red when hit
    }
    rect(this.x, this.y, this.width, this.height, 5);

    // Draw snowboard
    fill(139, 69, 19);
    rect(this.x - 5, this.y + this.height - 5, this.width + 10, 5);

    pop();
  }
}

class Wall {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display() {
    push();
    translate(-cameraOffset, 0);
    fill(200);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  snowboarder = new Snowboarder();

  // Create some walls for the course
  for (let i = 0; i < 20; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 150);
    let w = random(20, 40);
    let h = random(50, 100);
    walls.push(new Wall(x, y, w, h));
  }

  // Add some ground
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height - 30;
    let size = random(5, 15);
    walls.push(new Wall(x, y, size, 30));
  }
}

function draw() {
  background(220);

  // Draw ground
  fill(240);
  rect(0, height - 30, width, 30);

  // Draw walls
  for (let wall of walls) {
    wall.display();
  }

  // Update and display snowboarder
  snowboarder.update();
  snowboarder.display();

  // Draw damage indicator
  fill(255, 0, 0);
  rect(10, 10, map(damage, 0, maxDamage, 0, 200), 20);

  if (!gameRunning) {
    textSize(32);
    textAlign(CENTER);
    fill(0);
    text("Game Over", width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
