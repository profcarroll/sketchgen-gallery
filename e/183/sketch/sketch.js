// sketch.js
let vehicles = [];
let characters = [];
let roads = [];
let cameraOffset = { x: 0, y: 0 };
let player;
let attackEffect;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create roads
  for (let i = 0; i < 5; i++) {
    roads.push({
      x: random(-400, 400),
      y: random(-300, 300),
      width: 60,
      height: 200 + random(100),
      angle: random(TWO_PI)
    });
  }

  // Create vehicles
  for (let i = 0; i < 15; i++) {
    vehicles.push({
      x: random(-400, 400),
      y: random(-300, 300),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random(360), 80, 80)
    });
  }

  // Create characters
  for (let i = 0; i < 10; i++) {
    characters.push({
      x: random(-400, 400),
      y: random(-300, 300),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      color: color(random(360), 80, 80)
    });
  }

  // Player character
  player = {
    x: 0,
    y: 0,
    speed: 1.5,
    size: 20,
    color: color(200, 100, 100)
  };

  attackEffect = null;
}

function draw() {
  background(220, 30, 90);

  // Camera follows player
  cameraOffset.x = -player.x;
  cameraOffset.y = -player.y;

  // Draw roads
  push();
  translate(cameraOffset.x, cameraOffset.y);
  for (let road of roads) {
    push();
    translate(road.x, road.y);
    rotate(road.angle);
    fill(30, 50, 30);
    rectMode(CENTER);
    rect(0, 0, road.width, road.height);
    pop();
  }
  pop();

  // Draw vehicles
  for (let v of vehicles) {
    push();
    translate(v.x + cameraOffset.x, v.y + cameraOffset.y);
    rotate(v.angle);
    fill(v.color);
    rectMode(CENTER);
    rect(0, 0, 20, 8);
    pop();

    // Update vehicle position
    v.x += cos(v.angle) * v.speed;
    v.y += sin(v.angle) * v.speed;

    // Wrap around screen
    if (v.x > 450) v.x = -450;
    if (v.x < -450) v.x = 450;
    if (v.y > 350) v.y = -350;
    if (v.y < -350) v.y = 350;
  }

  // Draw characters
  for (let c of characters) {
    push();
    translate(c.x + cameraOffset.x, c.y + cameraOffset.y);
    fill(c.color);
    ellipse(0, 0, 12, 12);
    pop();

    // Update character position
    c.x += cos(c.angle) * c.speed;
    c.y += sin(c.angle) * c.speed;

    // Wrap around screen
    if (c.x > 450) c.x = -450;
    if (c.x < -450) c.x = 450;
    if (c.y > 350) c.y = -350;
    if (c.y < -350) c.y = 350;

    // Random direction change
    if (random() < 0.01) {
      c.angle += random(-0.2, 0.2);
    }
  }

  // Draw player
  push();
  translate(player.x + cameraOffset.x, player.y + cameraOffset.y);
  fill(player.color);
  ellipse(0, 0, player.size, player.size);
  pop();

  // Player movement
  if (keyIsPressed) {
    if (keyCode === UP_ARROW) player.y -= player.speed;
    if (keyCode === DOWN_ARROW) player.y += player.speed;
    if (keyCode === LEFT_ARROW) player.x -= player.speed;
    if (keyCode === RIGHT_ARROW) player.x += player.speed;
  }

  // Attack with spacebar
  if (keyIsPressed && key === ' ') {
    attackEffect = {
      x: player.x,
      y: player.y,
      size: 0,
      maxsize: 60,
      color: color(0, 100, 100)
    };
  }

  // Draw attack effect
  if (attackEffect) {
    push();
    translate(attackEffect.x + cameraOffset.x, attackEffect.y + cameraOffset.y);
    noFill();
    stroke(attackEffect.color);
    strokeWeight(3);
    ellipse(0, 0, attackEffect.size, attackEffect.size);
    pop();

    attackEffect.size += 5;
    if (attackEffect.size > attackEffect.maxsize) {
      attackEffect = null;
    }
  }

  // Wrap around screen for player
  if (player.x > 450) player.x = -450;
  if (player.x < -450) player.x = 450;
  if (player.y > 350) player.y = -350;
  if (player.y < -350) player.y = 350;
}
