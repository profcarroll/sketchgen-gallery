let balloons = [];
const glowSegments = 8;
const balloonCount = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < balloonCount; i++) {
    balloons.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      speed: random(0.2, 0.5),
      hue: random(360),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03),
      glow: []
    });
  }
}

function draw() {
  background(220, 10, 95); // Sky blue

  for (let balloon of balloons) {
    // Gentle drift
    balloon.y -= balloon.speed;
    balloon.x += sin(balloon.sway) * 0.3;
    balloon.sway += balloon.swaySpeed;

    // Wrap around screen
    if (balloon.y < -50) balloon.y = height + 50;
    if (balloon.x < -50) balloon.x = width + 50;
    if (balloon.x > width + 50) balloon.x = -50;

    // Draw glow
    noFill();
    strokeWeight(2);
    for (let i = 0; i < glowSegments; i++) {
      const angle = map(i, 0, glowSegments, 0, TWO_PI);
      const offsetX = cos(angle) * balloon.size * 1.5;
      const offsetY = sin(angle) * balloon.size * 1.5;
      stroke(balloon.hue, 80, 100, 0.2);
      ellipse(balloon.x + offsetX, balloon.y + offsetY, balloon.size * 3);
    }

    // Draw balloon
    fill(balloon.hue, 90, 95);
    noStroke();
    ellipse(balloon.x, balloon.y, balloon.size);
    
    // Draw basket
    fill(30, 20, 20);
    rect(balloon.x - 10, balloon.y + balloon.size/2, 20, 20, 5);
    
    // Draw string
    stroke(0, 0, 0, 0.5);
    strokeWeight(1);
    line(balloon.x, balloon.y - balloon.size/2, balloon.x, balloon.y + balloon.size/2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
