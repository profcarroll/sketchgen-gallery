let player, enemy;
let platforms = [];
let gravity = 0.5;
let jumpStrength = -12;
let isJumping = false;

function setup() {
  createCanvas(800, 400);
  player = {
    x: 100,
    y: 300,
    width: 30,
    height: 50,
    speed: 5,
    velY: 0
  };
  
  enemy = {
    x: 400,
    y: 300,
    width: 30,
    height: 50,
    speed: 2,
    direction: 1
  };

  platforms.push({x: 0, y: 350, width: 800, height: 50});
  platforms.push({x: 200, y: 300, width: 100, height: 20});
  platforms.push({x: 400, y: 250, width: 100, height: 20});
  platforms.push({x: 600, y: 200, width: 100, height: 20});
}

function draw() {
  background(135, 206, 235);
  
  // Draw platforms
  fill(101, 67, 33);
  for (let platform of platforms) {
    rect(platform.x, platform.y, platform.width, platform.height);
  }

  // Update and draw player
  handlePlayerInput();
  updatePlayer();
  drawPlayer();

  // Update and draw enemy
  updateEnemy();
  drawEnemy();
}

function handlePlayerInput() {
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }
  if (keyIsDown(32) && !isJumping) { // spacebar
    player.velY = jumpStrength;
    isJumping = true;
  }
}

function updatePlayer() {
  player.velY += gravity;
  player.y += player.velY;

  // Check platform collisions
  let onGround = false;
  for (let platform of platforms) {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height <= platform.y &&
      player.y + player.height + player.velY >= platform.y
    ) {
      player.y = platform.y - player.height;
      player.velY = 0;
      isJumping = false;
      onGround = true;
    }
  }

  if (!onGround && player.y > height) {
    player.y = 300;
    player.x = 100;
    player.velY = 0;
  }
}

function drawPlayer() {
  fill(255, 0, 0);
  rect(player.x, player.y, player.width, player.height);
}

function updateEnemy() {
  enemy.x += enemy.speed * enemy.direction;

  // Reverse direction at edges
  if (enemy.x <= 0 || enemy.x + enemy.width >= width) {
    enemy.direction *= -1;
  }
}

function drawEnemy() {
  fill(0, 0, 255);
  rect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function mousePressed() {
  // Change state on click
  player.x += 100;
}
