let player;
let platforms = [];
let cameraX = 0;
let scrollSpeed = 2;

function setup() {
  createCanvas(800, 400);
  player = new Player(width / 2, height / 2);
  // Generate initial platforms
  for (let i = 0; i < 20; i++) {
    platforms.push(new Platform(i * 150, height - 50, 100, 20));
  }
}

function draw() {
  background(50, 100, 150);
  
  // Update camera to follow player
  cameraX = player.x - width / 2;
  
  // Draw platforms
  for (let platform of platforms) {
    platform.update(cameraX);
    platform.display();
  }
  
  // Update and display player
  player.update();
  player.display();
  
  // Add new platforms as the world scrolls
  if (platforms.length > 0 && platforms[platforms.length - 1].x < width + cameraX) {
    let lastPlatform = platforms[platforms.length - 1];
    platforms.push(new Platform(lastPlatform.x + 150, height - 50, 100, 20));
  }
  
  // Remove old platforms
  while (platforms.length > 0 && platforms[0].x + 100 < cameraX) {
    platforms.shift();
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.velY = 0;
    this.onGround = false;
    this.jumpPower = -15;
    this.gravity = 0.8;
  }
  
  update() {
    // Apply gravity
    this.velY += this.gravity;
    this.y += this.velY;
    
    // Simple ground collision
    if (this.y > height - 50 - this.size / 2) {
      this.y = height - 50 - this.size / 2;
      this.velY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    
    // Jumping
    if (keyIsPressed && keyCode === UP_ARROW && this.onGround) {
      this.velY = this.jumpPower;
      this.onGround = false;
    }
    
    // Horizontal movement
    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW) {
        this.x -= 5;
      } else if (keyCode === RIGHT_ARROW) {
        this.x += 5;
      }
    }
  }
  
  display() {
    fill(255, 100, 100);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  update(cameraX) {
    this.x -= scrollSpeed;
  }
  
  display() {
    fill(100, 200, 100);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    
    // Add some texture
    fill(80, 180, 80);
    for (let i = 0; i < this.width; i += 10) {
      rect(this.x + i, this.y, 5, this.height);
    }
  }
}
