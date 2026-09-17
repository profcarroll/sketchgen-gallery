let platforms = [];
let obstacles = [];
let character;
let scrollX = 0;
let groundY = 400;
let gravity = 0.5;
let isJumping = false;
let isCrouching = false;
let cameraOffset = 0;

class Platform {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  display() {
    fill(this.color);
    rect(this.x - scrollX, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 'jump' or 'duck'
  }

  display() {
    fill(100);
    if (this.type === 'jump') {
      rect(this.x - scrollX, this.y, this.width, this.height);
    } else if (this.type === 'duck') {
      rect(this.x - scrollX, this.y + 20, this.width, this.height - 20);
    }
  }
}

class Character {
  constructor() {
    this.x = 100;
    this.y = groundY - 30;
    this.width = 30;
    this.height = 30;
    this.velocityY = 0;
  }

  update() {
    if (isJumping && !isCrouching) {
      this.velocityY += gravity;
      this.y += this.velocityY;

      if (this.y >= groundY - 30) {
        this.y = groundY - 30;
        isJumping = false;
        this.velocityY = 0;
      }
    }

    // Move character forward
    this.x += 3;
  }

  display() {
    fill(255, 100, 100);
    rect(this.x - scrollX, this.y, this.width, this.height);
  }
}

function setup() {
  createCanvas(800, 500);
  character = new Character();

  // Generate platforms
  let currentX = 0;
  for (let i = 0; i < 20; i++) {
    let width = random(60, 150);
    let height = random(20, 50);
    let y = groundY - height;
    platforms.push(new Platform(currentX, y, width, height, color(random(100, 255), random(100, 255), random(100, 255))));
    currentX += width + random(30, 80);
  }

  // Add some obstacles
  for (let i = 0; i < 10; i++) {
    let platform = platforms[i];
    if (platform && random() > 0.5) {
      let x = platform.x + platform.width + random(20, 60);
      let height = random(30, 80);
      let type = random() > 0.5 ? 'jump' : 'duck';
      obstacles.push(new Obstacle(x, groundY - height, 20, height, type));
    }
  }
}

function draw() {
  background(150, 200, 255);

  // Draw clouds
  fill(255);
  for (let i = 0; i < 5; i++) {
    ellipse(100 + i * 200 - scrollX % 800, 80, 60, 40);
  }

  // Update and display platforms
  for (let platform of platforms) {
    platform.display();
  }

  // Update and display obstacles
  for (let obstacle of obstacles) {
    obstacle.display();
  }

  // Update and display character
  character.update();
  character.display();

  // Scroll the world
  scrollX += 3;

  // Keep character in view
  cameraOffset = character.x - width / 2;
}

function keyPressed() {
  if (key === ' ' && !isJumping) {
    isJumping = true;
    character.velocityY = -10;
  }

  if (keyCode === DOWN_ARROW) {
    isCrouching = true;
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    isCrouching = false;
  }
}

function mousePressed() {
  // Trigger jump on click
  if (!isJumping) {
    isJumping = true;
    character.velocityY = -10;
  }
}
