let roadSegments = [];
let playerX = 0;
let playerY = 0;
let speed = 5;
let segmentHeight = 100;
let numSegments = 20;
let roadWidth = 400;
let obstacleFrequency = 0.3;
let obstacles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = width / 2;
  playerY = height - 100;

  // Create road segments
  for (let i = 0; i < numSegments; i++) {
    roadSegments.push({
      y: i * segmentHeight,
      width: roadWidth + (i * 20),
      color: color(50, 50, 50, 150)
    });
  }

  // Generate initial obstacles
  for (let i = 0; i < 50; i++) {
    if (random() < obstacleFrequency) {
      obstacles.push({
        x: random(-roadWidth/2 + 20, roadWidth/2 - 20),
        y: random(-height, height),
        width: random(10, 30),
        height: random(20, 50),
        color: color(random(100, 255), random(100, 255), 0)
      });
    }
  }
}

function draw() {
  background(0);

  // Move road segments
  for (let segment of roadSegments) {
    segment.y += speed;
    if (segment.y > height) {
      segment.y = -segmentHeight;
    }
  }

  // Move obstacles
  for (let obstacle of obstacles) {
    obstacle.y += speed;
    if (obstacle.y > height + 50) {
      obstacle.y = -50;
      obstacle.x = random(-roadWidth/2 + 20, roadWidth/2 - 20);
    }
  }

  // Draw road segments
  for (let segment of roadSegments) {
    fill(segment.color);
    noStroke();
    rectMode(CENTER);
    rect(width/2, segment.y, segment.width, segmentHeight);
  }

  // Draw lane markers
  stroke(255);
  strokeWeight(3);
  line(width/2 - roadWidth/2 + 10, 0, width/2 - roadWidth/2 + 10, height);
  line(width/2 + roadWidth/2 - 10, 0, width/2 + roadWidth/2 - 10, height);

  // Draw obstacles
  noStroke();
  for (let obstacle of obstacles) {
    fill(obstacle.color);
    rectMode(CENTER);
    rect(width/2 + obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }

  // Draw player vehicle
  fill(255, 0, 0);
  rectMode(CENTER);
  rect(playerX, playerY, 30, 60);

  // Simple movement controls (just for visual effect)
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      playerX -= 5;
    } else if (keyCode === RIGHT_ARROW) {
      playerX += 5;
    }
  }

  // Keep player within bounds
  playerX = constrain(playerX, width/2 - roadWidth/2 + 15, width/2 + roadWidth/2 - 15);
}
