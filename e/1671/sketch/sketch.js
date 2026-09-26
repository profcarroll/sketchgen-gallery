let terrain = [];
let flashTimer = 0;
let flashDuration = 60;
let flashIntensity = 0;
let stars = [];
let cameraOffset = 0;

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
  
  // Create terrain
  for (let i = 0; i < 2000; i++) {
    terrain.push({
      x: i * 5,
      y: height * 0.7 + noise(i * 0.1) * 40 - 20,
      w: 5,
      h: random(2, 10)
    });
  }
}

function draw() {
  background(0, 5, 20);
  
  // Draw stars
  noStroke();
  for (let star of stars) {
    fill(255, star.brightness);
    ellipse(star.x, star.y, star.size);
  }

  // Update flash effect
  flashTimer++;
  if (flashTimer >= flashDuration) {
    flashTimer = 0;
    flashIntensity = 1;
  }
  
  if (flashIntensity > 0) {
    flashIntensity -= 0.02;
  }

  // Draw terrain with flash effect
  noStroke();
  for (let t of terrain) {
    let flash = map(flashIntensity, 0, 1, 0, 100);
    fill(60, 40, 20 + flash);
    rect(t.x - cameraOffset, t.y, t.w, t.h);
  }
  
  // Scroll the camera
  cameraOffset += 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
