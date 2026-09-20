let lightPosition;
let lightRadius;
let flashIntensity;
let flashTimer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize light at center top
  lightPosition = createVector(width / 2, height * 0.2);
  lightRadius = width * 0.4;
  flashIntensity = 0;
  flashTimer = 0;
}

function draw() {
  background(30, 100, 30); // Dark green field

  // Draw corn stalks
  drawCornfield();

  // Update and draw light
  updateLight();
  drawLight();
}

function drawCornfield() {
  // Draw grass
  fill(20, 80, 20);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Draw corn stalks
  stroke(100, 60, 20);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let h = random(50, 150);
    line(x, height * 0.7, x, height * 0.7 - h);
  }
}

function updateLight() {
  flashTimer += 0.1;
  // Random flashes with varying intensity
  if (random() < 0.05) {
    flashIntensity = random(0.5, 1.0);
  } else {
    flashIntensity *= 0.95; // Fade out
  }
}

function drawLight() {
  // Draw semicircular glow
  noStroke();
  fill(0, 255, 255, 30 * flashIntensity); // Cyan with transparency

  // Draw a large semicircle under the light
  beginShape();
  for (let i = 0; i <= 180; i += 5) {
    let angle = radians(i);
    let x = lightPosition.x + cos(angle) * lightRadius;
    let y = lightPosition.y + sin(angle) * lightRadius * 0.5;
    vertex(x, y);
  }
  // Close the shape
  vertex(lightPosition.x + lightRadius, lightPosition.y);
  vertex(lightPosition.x - lightRadius, lightPosition.y);
  endShape(CLOSE);

  // Draw core light
  fill(0, 255, 255, 100 * flashIntensity);
  noStroke();
  ellipse(lightPosition.x, lightPosition.y, 40, 40);

  // Add some pulsing effect
  let pulse = sin(flashTimer * 5) * 0.3 + 0.7;
  fill(0, 255, 255, 80 * flashIntensity * pulse);
  ellipse(lightPosition.x, lightPosition.y, 60, 60);
}
