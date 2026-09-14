let circles = [];
let stars = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create floating circles
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(200, 260),
      alpha: random(0.05, 0.15)
    });
  }

  // Create stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      speed: random(0.001, 0.005),
      hue: random(40, 60),
      alpha: random(0.3, 1)
    });
  }
}

function draw() {
  background(230, 10, 10); // Deep blue background

  // Draw and update circles
  for (let circle of circles) {
    circle.x += circle.speed;
    if (circle.x > width + circle.size) {
      circle.x = -circle.size;
    }

    noFill();
    stroke(circle.hue, 50, 100, circle.alpha);
    strokeWeight(2);
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }

  // Draw and update stars
  for (let star of stars) {
    star.x -= star.speed; // Move opposite to the flow
    if (star.x < -star.size) {
      star.x = width + star.size;
    }

    noStroke();
    fill(star.hue, 100, 100, star.alpha);
    ellipse(star.x, star.y, star.size, star.size);
  }
}
