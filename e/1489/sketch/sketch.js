let train;
let stars = [];

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
  
  // Animate windows
  for (let window of train.windows) {
    window.on = !window.on;
    if (window.on) {
      fill(255, 255, 0); // Yellow
    } else {
      fill(255); // White
    }
    rect(train.x + window.x, train.y + window.y, window.w, window.h);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
