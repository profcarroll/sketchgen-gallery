let particles = [];
const particleCount = 1500;
const gravity = 0.05;
const fadeRate = 0.98;
const flowSpeed = 0.02;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(-height, 0),
      size: random(2, 8),
      speed: random(0.5, 2),
      hue: random(120, 180), // emerald to cyan
      alpha: random(0.3, 1),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // semi-transparent black for trail effect

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Update position with gravity and sway
    p.y += p.speed;
    p.x += sin(p.sway) * p.speed * 0.5;
    p.sway += p.swaySpeed;

    // Apply fade
    p.alpha *= fadeRate;

    // Reset particle if it goes off screen or fades out
    if (p.y > height + 50 || p.alpha < 0.01) {
      p.x = random(width);
      p.y = random(-50, -10);
      p.alpha = random(0.3, 1);
      p.sway = random(TWO_PI);
    }

    // Draw particle
    fill(p.hue, 80, 90, p.alpha);
    ellipse(p.x, p.y, p.size);
  }
}
