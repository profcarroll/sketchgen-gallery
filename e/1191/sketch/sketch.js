let fibers = [];
let knots = [];
let fft;
let amplitude;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create fibers
  for (let i = 0; i < 200; i++) {
    fibers.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(20, 40)
    });
  }

  // Create knots
  for (let i = 0; i < 50; i++) {
    knots.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      hue: random(180, 240)
    });
  }

  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0, 0, 10);

  // Update and display fibers
  for (let fiber of fibers) {
    fiber.x += cos(fiber.angle) * fiber.speed * 2;
    fiber.y += sin(fiber.angle) * fiber.speed * 2;

    // Bounce off edges
    if (fiber.x < 0 || fiber.x > width) fiber.angle = PI - fiber.angle;
    if (fiber.y < 0 || fiber.y > height) fiber.angle = -fiber.angle;

    // Draw fiber
    noStroke();
    fill(fiber.hue, 80, 90, 0.7);
    ellipse(fiber.x, fiber.y, fiber.size);

    // Add subtle glow effect
    fill(fiber.hue, 100, 100, 0.2);
    ellipse(fiber.x, fiber.y, fiber.size * 1.5);
  }

  // Update and display knots
  for (let knot of knots) {
    knot.angle += knot.speed;
    knot.x += cos(knot.angle) * 0.5;
    knot.y += sin(knot.angle) * 0.5;

    // Draw knot as geometric shape
    stroke(255);
    strokeWeight(1);
    noFill();
    push();
    translate(knot.x, knot.y);
    rotate(knot.angle);
    rectMode(CENTER);
    rect(0, 0, knot.size, knot.size * 0.6);
    pop();
  }

  // Visualize audio
  let vol = amplitude.getLevel();
  let spectrum = fft.analyze();

  if (vol > 0.05) {
    for (let i = 0; i < spectrum.length; i += 20) {
      let amp = spectrum[i];
      let y = map(amp, 0, 255, height, 0);
      stroke(i % 360, 100, 80);
      line(i * (width / spectrum.length), height, i * (width / spectrum.length), y);
    }
  }
}

function mousePressed() {
  userStartAudio();
}
