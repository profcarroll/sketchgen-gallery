let fields = [];
let mountains = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Generate fields with varied green patches
  for (let i = 0; i < 500; i++) {
    fields.push({
      x: random(width),
      y: random(height * 0.4, height * 0.7),
      w: random(20, 100),
      h: random(10, 50),
      c: color(
        random(30, 80),
        random(100, 200),
        random(30, 90),
        random(150, 255)
      )
    });
  }

  // Generate mountains
  for (let i = 0; i < 10; i++) {
    mountains.push({
      x: random(width),
      y: height * 0.6,
      w: random(300, 800),
      h: random(200, 400),
      c: color(random(50, 100), random(50, 100), random(50, 100))
    });
  }

  // Generate clouds
  for (let i = 0; i < 20; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.1, height * 0.3),
      w: random(40, 100),
      h: random(20, 50)
    });
  }
}

function draw() {
  // Sky background
  background(135, 206, 235);

  // Draw mountains
  for (let m of mountains) {
    fill(m.c);
    noStroke();
    triangle(
      m.x - m.w / 2,
      m.y,
      m.x + m.w / 2,
      m.y,
      m.x,
      m.y - m.h
    );
  }

  // Draw fields
  for (let f of fields) {
    fill(f.c);
    noStroke();
    rect(f.x, f.y, f.w, f.h);
  }

  // Draw clouds
  fill(255);
  noStroke();
  for (let c of clouds) {
    ellipse(c.x, c.y, c.w, c.h);
    ellipse(c.x + c.w * 0.3, c.y - c.h * 0.2, c.w * 0.8, c.h * 0.7);
    ellipse(c.x - c.w * 0.3, c.y - c.h * 0.1, c.w * 0.6, c.h * 0.6);
  }

  // Sun
  fill(255, 255, 0);
  noStroke();
  ellipse(width * 0.8, height * 0.15, 60, 60);
}
