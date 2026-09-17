let grass = [];
let mountains = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Generate grass patches
  for (let i = 0; i < 300; i++) {
    grass.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 8),
      angle: random(TWO_PI)
    });
  }

  // Generate mountain range
  for (let i = 0; i < 15; i++) {
    mountains.push({
      x: map(i, 0, 14, 0, width),
      height: random(height * 0.3, height * 0.5),
      width: random(200, 400)
    });
  }

  // Generate clouds
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.1, height * 0.3),
      size: random(30, 70)
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

  // Distant mountains with haze
  noStroke();
  fill(100, 100, 100, 150);
  for (let i = 0; i < mountains.length; i++) {
    let m = mountains[i];
    triangle(
      m.x, height,
      m.x + m.width * 0.5, height - m.height,
      m.x + m.width, height
    );
  }

  // Foreground grass
  noStroke();
  fill(34, 139, 34);
  for (let i = 0; i < grass.length; i++) {
    let g = grass[i];
    push();
    translate(g.x, g.y);
    rotate(g.angle);
    rectMode(CENTER);
    rect(0, 0, g.size, g.size * 2);
    pop();
  }

  // Clouds
  fill(255, 255, 255, 200);
  noStroke();
  for (let i = 0; i < clouds.length; i++) {
    let c = clouds[i];
    ellipse(c.x, c.y, c.size, c.size * 0.6);
    ellipse(c.x + c.size * 0.4, c.y - c.size * 0.2, c.size * 0.8, c.size * 0.5);
    ellipse(c.x - c.size * 0.4, c.y + c.size * 0.1, c.size * 0.7, c.size * 0.4);
  }

  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
