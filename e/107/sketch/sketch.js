let player;
let platforms = [];
let gravity = 0.5;
let isJumping = false;

function setup() {
  createCanvas(800, 400);
  player = {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocityY: 0,
    speed: 5
  };

  platforms.push({
    x: 0,
    y: 350,
    width: 800,
    height: 50
  });

  platforms.push({
    x: 200,
    y: 300,
    width: 100,
    height: 20
  });

  platforms.push({
    x: 400,
    y: 250,
    width: 100,
    height: 20
  });

  platforms.push({
    x: 600,
    y: 200,
    width: 100,
    height: 20
  });
}

function draw() {
  background(220);

  player.velocityY += gravity;
  player.y += player.velocityY;

  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      player.x -= player.speed;
    } else if (keyCode === RIGHT_ARROW) {
      player.x += player.speed;
    } else if (keyCode === UP_ARROW && !isJumping) {
      player.velocityY = -12;
      isJumping = true;
    }
  }

  // Platform collision
  let onGround = false;
  for (let platform of platforms) {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height <= platform.y &&
      player.y + player.height + player.velocityY >= platform.y
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      isJumping = false;
      onGround = true;
    }
  }

  if (!onGround && player.y + player.height < height) {
    isJumping = true;
  }

  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > width) player.x = width - player.width;

  // Draw platforms
  for (let platform of platforms) {
    fill(100);
    rect(platform.x, platform.y, platform.width, platform.height);
  }

  // Draw player
  fill(255, 0, 0);
  rect(player.x, player.y, player.width, player.height);

  // Prevent motion if not moving
  noLoop();
}
