let snowboarder;
let course;
let camera;
let health = 100;
let gameActive = true;
let shakeIntensity = 0;
let shakeDuration = 0;

function setup() {
  createCanvas(800, 400);
  snowboarder = new Snowboarder();
  course = new Course();
  camera = new Camera();
}

function draw() {
  background(150, 200, 255);

  if (gameActive) {
    // Update game state
    snowboarder.update();
    camera.follow(snowboarder);
    course.update(camera);

    // Check for collisions
    if (snowboarder.collidesWithWalls(course)) {
      health -= 1;
      shakeIntensity = 10;
      shakeDuration = 30;
      if (health <= 0) {
        gameActive = false;
      }
    }

    // Handle shaking
    if (shakeDuration > 0) {
      shakeDuration--;
      translate(random(-shakeIntensity, shakeIntensity), random(-shakeIntensity, shakeIntensity));
    }
  }

  // Draw everything
  course.draw(camera);
  snowboarder.draw(camera);

  // Draw health bar
  drawHealthBar();
}

function drawHealthBar() {
  fill(0);
  rect(10, 10, 200, 20);
  noStroke();
  fill(255, 0, 0);
  rect(10, 10, health * 2, 20);
}

class Snowboarder {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.width = 20;
    this.height = 40;
    this.speedX = 0;
    this.speedY = 0;
    this.onGround = false;
    this.color = color(255, 100, 100);
  }

  update() {
    // Handle input
    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW) {
        this.speedX -= 0.5;
      } else if (keyCode === RIGHT_ARROW) {
        this.speedX += 0.5;
      }
      if (keyCode === UP_ARROW) {
        this.speedY -= 0.5;
      } else if (keyCode === DOWN_ARROW) {
        this.speedY += 0.5;
      }
      if (key === ' ' && this.onGround) {
        this.speedY = -10;
        this.onGround = false;
      }
    }

    // Apply gravity
    this.speedY += 0.5;

    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // Apply friction
    this.speedX *= 0.9;

    // Ground collision
    if (this.y > height - 50) {
      this.y = height - 50;
      this.onGround = true;
      this.speedY = 0;
    }

    // Boundary check for lateral movement
    if (this.x < 0) this.x = 0;
    if (this.x > width) this.x = width;
  }

  draw(camera) {
    push();
    translate(-camera.x, -camera.y);
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    // Simple snowboarder body representation
    fill(0);
    ellipse(this.x + 10, this.y - 5, 8, 8); // Head
    pop();
  }

  collidesWithWalls(course) {
    const leftWall = course.leftWall;
    const rightWall = course.rightWall;

    if (this.x < leftWall || this.x > rightWall) {
      return true;
    }
    return false;
  }
}

class Course {
  constructor() {
    this.segments = [];
    this.segmentWidth = 300;
    this.generateSegments();
  }

  generateSegments() {
    for (let i = 0; i < 10; i++) {
      const segment = {
        x: i * this.segmentWidth,
        y: height - 50,
        width: this.segmentWidth,
        height: 50
      };
      this.segments.push(segment);
    }
  }

  update(camera) {
    // Move segments based on camera position
  }

  draw(camera) {
    noStroke();
    fill(200, 230, 255);
    rect(0, height - 50, width, 50); // Ground

    // Draw gradient lines for the course
    stroke(100);
    strokeWeight(2);
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      const x = segment.x - camera.x;
      const y = segment.y;

      // Draw gradient lines
      for (let j = 0; j < 10; j++) {
        const lineX = x + j * 30;
        line(lineX, y, lineX, y - 20);
      }
    }

    // Draw sidewalls
    stroke(50);
    strokeWeight(10);
    const leftWall = 0;
    const rightWall = width;

    line(leftWall, 0, leftWall, height);
    line(rightWall, 0, rightWall, height);
  }
}

class Camera {
  constructor() {
    this.x = 0;
  }

  follow(snowboarder) {
    this.x = snowboarder.x - width / 2;
  }
}
