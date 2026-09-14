let player;
let platforms = [];
let cameraOffset = 0;
let gravity = 0.5;
let isJumping = false;

function setup() {
  createCanvas(800, 400);
  player = {
    x: 100,
    y: 200,
    width: 30,
    height: 30,
    speed: 5,
    jumpForce: -12,
    velocityY: 0,
    color: [255, 100, 100]
  };

  // Create initial platforms
  for (let i = 0; i < 20; i++) {
    platforms.push({
      x: i * 150,
      y: height - 50,
      width: 100,
      height: 30,
      color: [random(100, 255), random(100, 255), random(100, 255)]
    });
  }
  
  // Add some floating platforms
  platforms.push({x: 300, y: height - 150, width: 80, height: 20, color: [100, 200, 100]});
  platforms.push({x: 500, y: height - 250, width: 120, height: 20, color: [100, 100, 200]});
  platforms.push({x: 700, y: height - 180, width: 90, height: 20, color: [200, 100, 100]});
}

function draw() {
  background(50);
  
  // Update camera based on player position
  cameraOffset = player.x - width/2;
  
  // Apply gravity
  player.velocityY += gravity;
  player.y += player.velocityY;
  
  // Check platform collisions
  let onGround = false;
  for (let platform of platforms) {
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height + 10 &&
      player.velocityY > 0
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      onGround = true;
    }
  }
  
  // Update character position with scrolling camera
  translate(-cameraOffset, 0);
  
  // Draw platforms
  for (let platform of platforms) {
    fill(platform.color);
    noStroke();
    rect(platform.x, platform.y, platform.width, platform.height);
  }
  
  // Draw player
  fill(player.color);
  noStroke();
  rect(player.x, player.y, player.width, player.height);
  
  // Reset camera
  translate(cameraOffset, 0);
  
  // Handle controls
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }
  if (keyIsDown(UP_ARROW) && onGround) {
    player.velocityY = player.jumpForce;
    onGround = false;
  }
  
  // Keep player within bounds
  if (player.y > height) {
    player.y = 200;
    player.x = 100;
    player.velocityY = 0;
  }
}

function mousePressed() {
  // Change player color on click
  player.color = [random(100, 255), random(100, 255), random(100, 255)];
}
