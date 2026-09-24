let planes = [];
let lightPosition;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a set of planes representing building facade
  for (let i = 0; i < 15; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      w: random(80, 200),
      h: random(100, 300),
      depth: random(10, 50),
      color: color(random(40, 100), random(40, 100), random(100, 180)),
      angle: random(TWO_PI)
    });
  }
  lightPosition = createVector(width / 2, -100);
}

function draw() {
  background(10);

  // Animate light source
  time += 0.005;
  lightPosition.x = width / 2 + sin(time) * 300;

  // Draw planes with dynamic lighting
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y);
    rotate(plane.angle);

    // Fill with deep color
    fill(plane.color);
    noStroke();
    rect(0, 0, plane.w, plane.h);

    // Add shadow effect from moving light
    let shadowX = map(lightPosition.x, 0, width, -plane.w / 2, plane.w / 2);
    let shadowY = map(lightPosition.y, 0, height, -plane.h / 2, plane.h / 2);
    let shadowW = plane.w * 0.8;
    let shadowH = plane.h * 0.1;

    // Create a dynamic shadow
    fill(0, 50);
    rect(shadowX - shadowW / 2, shadowY + shadowH * 0.5, shadowW, shadowH);

    pop();
  }

  // Add a bright light wash
  blendMode(DIFFERENCE);
  noStroke();
  fill(255, 150);
  ellipse(lightPosition.x, lightPosition.y, 200, 200);
  blendMode(BLEND);
}
