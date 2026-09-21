let sun, mountains, fields, foreground;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Create sun at sunset position
  sun = {
    x: width / 2,
    y: height * 0.8,
    radius: 60,
    color: color(255, 150, 50)
  };

  // Create mountain range in background
  mountains = [];
  for (let i = 0; i < 15; i++) {
    mountains.push({
      x: i * (width / 15),
      height: random(80, 200),
      width: width / 15 + random(-10, 10),
      color: color(100, 120, 130)
    });
  }

  // Create field patches
  fields = [];
  for (let i = 0; i < 100; i++) {
    fields.push({
      x: random(width),
      y: height * 0.6 + random(-50, 50),
      size: random(30, 100),
      color: color(30, random(120, 180), 30)
    });
  }

  // Create foreground tufts with rich textures
  foreground = [];
  for (let i = 0; i < 500; i++) {
    foreground.push({
      x: random(width),
      y: height * 0.7 + random(-20, 20),
      size: random(2, 8),
      angle: random(360),
      color: color(20, random(100, 150), 20)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 200, 100), color(50, 30, 80), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw sun
  noStroke();
  fill(sun.color);
  ellipse(sun.x, sun.y, sun.radius * 2);

  // Draw mountains
  for (let m of mountains) {
    fill(m.color);
    noStroke();
    triangle(
      m.x - m.width / 2,
      height * 0.6,
      m.x + m.width / 2,
      height * 0.6,
      m.x,
      height * 0.6 - m.height
    );
  }

  // Draw field patches
  for (let f of fields) {
    fill(f.color);
    noStroke();
    ellipse(f.x, f.y, f.size);
  }

  // Draw foreground tufts
  for (let t of foreground) {
    push();
    translate(t.x, t.y);
    rotate(t.angle);
    fill(t.color);
    noStroke();
    rect(0, 0, t.size, t.size * 2);
    pop();
  }

  // Add dramatic shadows
  noLoop();
}
