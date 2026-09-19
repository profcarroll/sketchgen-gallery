let sun, mountains, grass;
let shadowPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create a sun at the top right
  sun = { x: width * 0.8, y: height * 0.2, r: 60 };

  // Generate mountain range
  mountains = [];
  for (let i = 0; i < 15; i++) {
    mountains.push({
      x: i * (width / 15),
      h: random(80, 150),
      w: width / 15,
      color: color(60 + i * 3, 50 + i * 2, 40 + i)
    });
  }

  // Generate grass patches with varied colors
  grass = [];
  for (let i = 0; i < 100; i++) {
    grass.push({
      x: random(width),
      y: height * 0.6 + random(50),
      r: random(20, 80),
      color: color(
        random(30, 70),
        random(80, 120),
        random(30, 70)
      )
    });
  }

  // Generate shadow points for foreground grass
  for (let i = 0; i < 500; i++) {
    shadowPoints.push({
      x: random(width),
      y: height * 0.6 + random(height * 0.4),
      len: random(20, 100),
      angle: random(TWO_PI),
      thickness: random(1, 5)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(200, 230, 255), color(100, 180, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains
  for (let i = 0; i < mountains.length; i++) {
    let m = mountains[i];
    fill(m.color);
    noStroke();
    triangle(
      m.x,
      height * 0.6,
      m.x + m.w / 2,
      height * 0.6 - m.h,
      m.x + m.w,
      height * 0.6
    );
  }

  // Atmospheric haze in background
  for (let i = 0; i < 10; i++) {
    let alpha = map(i, 0, 10, 30, 0);
    fill(200, 220, 255, alpha);
    noStroke();
    rect(0, height * 0.4 + i * 10, width, 10);
  }

  // Grass patches
  for (let g of grass) {
    fill(g.color);
    noStroke();
    ellipse(g.x, g.y, g.r * 2, g.r);
  }

  // Foreground shadows
  stroke(0, 30);
  strokeWeight(1);
  for (let p of shadowPoints) {
    let endX = p.x + cos(p.angle) * p.len;
    let endY = p.y + sin(p.angle) * p.len;
    line(p.x, p.y, endX, endY);
  }

  // Sun
  fill(255, 240, 100);
  noStroke();
  ellipse(sun.x, sun.y, sun.r * 2);

  // Sun glow
  for (let i = 0; i < 10; i++) {
    let r = sun.r + i * 5;
    fill(255, 240, 100, 30 - i * 3);
    ellipse(sun.x, sun.y, r * 2);
  }

  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
