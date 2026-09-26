let train;
let stars = [];
let flashTimer = 0;
let flashDuration = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(100, 255)
    });
  }
  train = {
    x: -200,
    y: height * 0.7,
    width: 150,
    height: 40,
    speed: 3,
    windows: []
  };
  // Initialize windows
  for (let i = 0; i < 6; i++) {
    train.windows.push({
      x: i * 25,
      y: 5,
      w: 15,
      h: 30,
      on: false
    });
  }
}

function draw() {
  background(0, 10, 30);
  
  // Draw stars
  noStroke();
  for (let star of stars) {
    fill(255, star.brightness);
    ellipse(star.x, star.y, star.size);
  }

  // Update train position
  train.x += train.speed;
  
  // Reset train when it leaves canvas
  if (train.x > width + 200) {
    train.x = -200;
  }
  
  // Draw train
  fill(30, 30, 50);
  rect(train.x, train.y, train.width, train.height, 5);
  
  // Animate windows with pulsing effect
  flashTimer++;
  if (flashTimer >= flashDuration) {
    flashTimer = 0;
    // Toggle all windows at once for rhythmic effect
    for (let window of train.windows) {
      window.on = !window.on;
    }
  }

  // Draw windows with burst effect
  for (let window of train.windows) {
    if (window.on) {
      // Create bright yellow-orange flash effect
      fill(255, 200, 0);
      rect(train.x + window.x, train.y + window.y, window.w, window.h);
      // Add a subtle glow around the light
      noStroke();
      fill(255, 150, 0, 50);
      ellipse(train.x + window.x + window.w/2, train.y + window.y + window.h/2, window.w * 2, window.h * 2);
    } else {
      // Dim windows when off
      fill(255, 100);
      rect(train.x + window.x, train.y + window.y, window.w, window.h);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
