let shapes = [];
let colorOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < 200; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 100),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  background(10, 10, 20);
  colorOffset += 0.001;

  for (let shape of shapes) {
    // Update position
    shape.x += shape.speedX;
    shape.y += shape.speedY;

    // Bounce off edges
    if (shape.x < 0 || shape.x > width) shape.speedX *= -1;
    if (shape.y < 0 || shape.y > height) shape.speedY *= -1;

    // Apply subtle color shift
    let shiftedHue = (hue(shape.color) + sin(colorOffset + shape.size * 0.01) * 2) % 360;
    fill(shiftedHue, 80, 90, 150);

    // Draw the shape
    ellipse(shape.x, shape.y, shape.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  for (let shape of shapes) {
    let dx = shape.x - mouseX;
    let dy = shape.y - mouseY;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      shape.speedX += (dx / distance) * 0.05;
      shape.speedY += (dy / distance) * 0.05;
    }
  }
}
