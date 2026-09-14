let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);

  // Initialize lines with random positions and properties
  for (let i = 0; i < 500; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(360),
      size: random(50, 200)
    });
  }
}

function draw() {
  // Create a subtle fade effect to blend lines
  background(0, 0, 0, 0.05);

  time += 0.01;

  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];

    // Update position and angle based on time and noise
    l.x += cos(l.angle) * l.speed * 100;
    l.y += sin(l.angle) * l.speed * 100;

    // Change direction slowly over time
    l.angle += sin(time * 0.3 + i) * 0.02;

    // Update hue for color shifting
    l.hue = (l.hue + 0.2) % 360;

    // Draw the line with dynamic length and glow effect
    stroke(l.hue, 80, 90, 0.7);
    let endX = l.x + cos(l.angle) * l.size;
    let endY = l.y + sin(l.angle) * l.size;

    // Add some randomness to the line length for organic feel
    let lengthVariation = sin(time * 0.5 + i) * 20;
    endX += lengthVariation;
    endY += lengthVariation;

    line(l.x, l.y, endX, endY);

    // Reset position if out of bounds
    if (l.x < -100 || l.x > width + 100 || l.y < -100 || l.y > height + 100) {
      l.x = random(width);
      l.y = random(height);
      l.angle = random(TWO_PI);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
