let player;
let enemy;
let platforms = [];
let gapWidth = 100;
let gapSpacing = 200;

function setup() {
  createCanvas(800, 400);
  player = new Player();
  enemy = new Enemy();
  
  // Create platforms with gaps
  for (let x = 0; x < width * 3; x += gapSpacing) {
    let platformWidth = gapSpacing - gapWidth;
    if (platformWidth > 0) {
      platforms.push({
        x: x,
        y: height - 100,
        width: platformWidth,
        height: 20
      });
    }
  }
}

function draw() {
  background(50, 150, 200);
  
  // Draw platforms
  fill(100, 200, 100);
  for (let platform of platforms) {
    rect(platform.x, platform.y, platform.width, platform.height);
  }
  
  // Update and draw player
  player.update();
  player.draw();
  
  // Update and draw enemy
  enemy.update();
  enemy.draw();
}

class Player {
  constructor() {
    this.x = 100;
    this.y = height - 150;
    this.width = 30;
    this.height = 40;
    this.velY = 0;
    this.jumping = false;
    this.speed = 5;
  }
  
  update() {
    // Apply gravity
    this.velY += 0.8;
    this.y += this.velY;
    
    // Ground collision
    if (this.y > height - 150) {
      this.y = height - 150;
      this.velY = 0;
      this.jumping = false;
    }
    
    // Platform collisions
    for (let platform of platforms) {
      if (
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height > platform.y &&
        this.y + this.height < platform.y + 20 &&
        this.velY > 0
      ) {
        this.y = platform.y - this.height;
        this.velY = 0;
        this.jumping = false;
      }
    }
    
    // Move left/right
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A or left arrow
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D or right arrow
      this.x += this.speed;
    }
    
    // Jump
    if ((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && !this.jumping) { // W, up arrow, or space
      this.velY = -15;
      this.jumping = true;
    }
    
    // Boundary check
    if (this.x < 0) this.x = 0;
    if (this.x > width - this.width) this.x = width - this.width;
  }
  
  draw() {
    fill(255, 100, 100);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor() {
    this.x = 300;
    this.y = height - 150;
    this.width = 30;
    this.height = 40;
    this.speed = 2;
    this.direction = 1;
  }
  
  update() {
    this.x += this.speed * this.direction;
    
    // Reverse direction at edges
    if (this.x < 0 || this.x > width - this.width) {
      this.direction *= -1;
    }
  }
  
  draw() {
    fill(255, 255, 100);
    rect(this.x, this.y, this.width, this.height);
  }
}
