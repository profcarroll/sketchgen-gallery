let shapes = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 255);

  // Initialize grid of shapes
  for (let i = 0; i < 50; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      hue: random(255),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      type: floor(random(3)), // 0: circle, 1: square, 2: triangle
    });
  }
}

function draw() {
  background(0, 0, 0, 20); // Semi-transparent black for trail effect

  // Update and display shapes
  for (let shape of shapes) {
    shape.x += cos(shape.angle) * shape.speed;
    shape.y += sin(shape.angle) * shape.speed;
    shape.angle += random(-0.05, 0.05);

    // Bounce off edges
    if (shape.x < 0 || shape.x > width) shape.angle = PI - shape.angle;
    if (shape.y < 0 || shape.y > height) shape.angle = -shape.angle;

    // Draw shape
    fill(shape.hue, 255, 255, 180);
    push();
    translate(shape.x, shape.y);
    rotate(frameCount * 0.01 + shape.angle);

    switch (shape.type) {
      case 0: ellipse(0, 0, shape.size); break;
      case 1: rectMode(CENTER); rect(0, 0, shape.size, shape.size); break;
      case 2: triangle(0, -shape.size/2, shape.size/2, shape.size/2, -shape.size/2, shape.size/2); break;
    }
    pop();

    // Occasionally create a particle burst
    if (random() < 0.02) {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: shape.x,
          y: shape.y,
          size: random(2, 8),
          hue: shape.hue,
          speed: random(2, 5),
          angle: random(TWO_PI),
          life: 255
        });
      }
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.life -= 5;

    fill(p.hue, 255, 255, p.life);
    noStroke();
    ellipse(p.x, p.y, p.size);

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Create a ripple effect on click
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: mouseX,
      y: mouseY,
      size: random(5, 20),
      hue: random(255),
      speed: random(3, 7),
      angle: random(TWO_PI),
      life: 255
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
