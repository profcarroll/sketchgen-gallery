let fields = [];
let mountains = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Generate rolling green fields
  for (let i = 0; i < 100; i++) {
    fields.push({
      x: random(width),
      y: random(height * 0.4, height * 0.7),
      w: random(200, 600),
      h: random(50, 150),
      color: color(random(30, 80), random(100, 180), 30, 200)
    });
  }

  // Generate distant mountain range
  for (let i = 0; i < 20; i++) {
    mountains.push({
      x: i * (width / 20),
      h: random(height * 0.3, height * 0.5),
      w: width / 20 + random(-100, 100)
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue

  // Draw distant mountains
  fill(100, 149, 237);
  noStroke();
  for (let m of mountains) {
    beginShape();
    vertex(m.x, height);
    vertex(m.x + m.w / 2, height - m.h);
    vertex(m.x + m.w, height);
    endShape(CLOSE);
  }

  // Draw rolling fields
  for (let f of fields) {
    fill(f.color);
    noStroke();
    ellipse(f.x, f.y, f.w, f.h);
  }

  // Add some sunlit highlights
  fill(255, 255, 200, 100);
  noStroke();
  for (let i = 0; i < 30; i++) {
    ellipse(random(width), random(height * 0.2), random(50, 200), random(50, 200));
  }

  // Add some textured grass patches
  stroke(34, 139, 34);
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.5, height);
    line(x, y, x, y + random(5, 15));
  }
}
