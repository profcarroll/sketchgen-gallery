let shapes = [];
let noiseScale = 0.02;
let noiseStrength = 5;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create a grid of organic shapes
  for (let i = 0; i < 500; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      size: random(20, 80),
      speed: random(0.001, 0.005),
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);

  // Animate over time
  time += 0.01;

  // Center of interaction (cursor or center if not dragging)
  let centerX = width / 2;
  let centerY = height / 2;

  // Apply cursor interaction if mouse is pressed
  if (mouseIsPressed) {
    centerX = mouseX;
    centerY = mouseY;
  }

  // Draw each shape with dynamic movement and color
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];

    // Noise-based movement
    let nx = noise(s.x * noiseScale, s.y * noiseScale, time * s.speed) - 0.5;
    let ny = noise(s.x * noiseScale, s.y * noiseScale, time * s.speed + 1000) - 0.5;

    // Apply cursor interaction
    let dx = s.x - centerX;
    let dy = s.y - centerY;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance < 300) {
      let force = map(distance, 0, 300, 1, 0);
      nx *= (1 - force * 0.5);
      ny *= (1 - force * 0.5);
    }

    // Update position
    s.x += nx * noiseStrength;
    s.y += ny * noiseStrength;

    // Wrap around edges
    if (s.x < -100) s.x = width + 100;
    if (s.x > width + 100) s.x = -100;
    if (s.y < -100) s.y = height + 100;
    if (s.y > height + 100) s.y = -100;

    // Draw shape with dynamic color
    let hue = (s.hue + time * 20) % 360;
    fill(hue, 80, 90, 0.7);
    push();
    translate(s.x - width / 2, s.y - height / 2, s.z);
    sphere(s.size);
    pop();
  }

  // Create gradient background using noise
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      let n = noise(x * 0.005, y * 0.005, time);
      let hue = (n * 360 + time * 10) % 360;
      fill(hue, 70, 80, 0.1);
      rect(x, y, 10, 10);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
