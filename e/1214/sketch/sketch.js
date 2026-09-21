let sun, clouds = [];
let groundLevel, horizon;

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundLevel = height * 0.6;
  horizon = height * 0.4;

  // Create sun
  sun = {
    x: width * 0.8,
    y: height * 0.2,
    radius: 50
  };

  // Create clouds
  for (let i = 0; i < 10; i++) {
    clouds.push({
      x: random(width),
      y: random(horizon * 0.3, horizon * 0.7),
      size: random(30, 60),
      speed: random(0.2, 0.5)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains
  fill(100, 100, 120);
  noStroke();
  beginShape();
  vertex(0, groundLevel);
  for (let x = 0; x < width; x += 20) {
    let y = groundLevel + sin(x * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, groundLevel);
  endShape(CLOSE);

  // Midground fields
  fill(34, 139, 34);
  noStroke();
  beginShape();
  vertex(0, groundLevel);
  for (let x = 0; x < width; x += 10) {
    let y = groundLevel + sin(x * 0.02) * 20;
    vertex(x, y);
  }
  vertex(width, groundLevel);
  endShape(CLOSE);

  // Foreground grass details
  stroke(0, 100, 0);
  strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(groundLevel - 20, groundLevel);
    line(x, y, x, y - random(5, 15));
  }

  // Sun
  fill(255, 255, 0);
  noStroke();
  ellipse(sun.x, sun.y, sun.radius * 2);

  // Shadows from grass patches
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(groundLevel - 50, groundLevel);
    let w = random(20, 50);
    let h = random(10, 20);
    fill(0, 0, 0, 50);
    noStroke();
    ellipse(x, y, w, h);
  }

  // Clouds
  fill(255, 255, 255, 200);
  noStroke();
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(cloud.x + cloud.size * 0.4, cloud.y - cloud.size * 0.2, cloud.size * 0.7, cloud.size * 0.5);
    ellipse(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.6, cloud.size * 0.4);
  }

  // Move clouds
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) {
      cloud.x = -cloud.size;
    }
  }

  noLoop();
}
