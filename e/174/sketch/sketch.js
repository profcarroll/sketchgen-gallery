let player, enemy;
let platforms = [];
let gravity = 0.5;
let isJumping = false;
let moveSpeed = 5;
let cameraOffset = 0;

class Player {
  constructor() {
    this.x = 100;
    this.y = 300;
    this.width = 30;
    this.height = 50;
    this.velY = 0;
    this.jumping = false;
  }

  update() {
    this.velY += gravity;
    this.y += this.velY;

    if (this.y > 300) {
      this.y = 300;
      this.velY = 0;
      this.jumping = false;
    }

    // Simple platform collision
    for (let p of platforms) {
      if (
        this.x + this.width > p.x &&
        this.x < p.x + p.width &&
        this.y + this.height > p.y &&
        this.y + this.height < p.y + 20 &&
        this.velY > 0
      ) {
        this.y = p.y - this.height;
        this.velY = 0;
        this.jumping = false;
      }
    }
  }

  draw() {
    fill(0, 150, 255);
    rect(this.x, this.y, this.width, this.height);
  }

  jump() {
    if (!this.jumping) {
      this.velY = -12;
      this.jumping = true;
    }
  }

  move(direction) {
    if (direction === 'left') {
      this.x -= moveSpeed;
    } else if (direction === 'right') {
      this.x += moveSpeed;
    }
  }
}

class Enemy {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.width = 30;
    this.height = 50;
    this.speed = 2;
    this.direction = 1;
  }

  update() {
    this.x += this.speed * this.direction;

    if (this.x > 600 || this.x < 0) {
      this.direction *= -1;
    }
  }

  draw() {
    fill(255, 50, 50);
    rect(this.x, this.y, this.width, this.height);
  }
}

function setup() {
  createCanvas(800, 400);
  player = new Player();
  enemy = new Enemy();

  // Create platforms
  platforms.push({ x: 0, y: 350, width: 200, height: 50 });
  platforms.push({ x: 250, y: 300, width: 100, height: 50 });
  platforms.push({ x: 400, y: 250, width: 100, height: 50 });
  platforms.push({ x: 550, y: 300, width: 100, height: 50 });
  platforms.push({ x: 700, y: 350, width: 200, height: 50 });
}

function draw() {
  background(220);

  // Simple camera follow
  cameraOffset = player.x - width / 2;
  translate(-cameraOffset, 0);

  // Draw platforms
  for (let p of platforms) {
    fill(100);
    rect(p.x, p.y, p.width, p.height);
  }

  // Update and draw enemy
  enemy.update();
  enemy.draw();

  // Update and draw player
  player.update();
  player.draw();

  // Simple interaction check
  let d = dist(player.x, player.y, enemy.x, enemy.y);
  if (d < 50) {
    fill(255, 255, 0);
    ellipse(width / 2, height / 2, 100, 100);
  }
}

function mousePressed() {
  player.jump();
}

function mouseDragged() {
  if (mouseX < width / 2) {
    player.move('left');
  } else {
    player.move('right');
  }
}
