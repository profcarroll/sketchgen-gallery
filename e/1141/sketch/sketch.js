function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Background gradient for sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = lerp(255, 100, inter);
    stroke(b);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric perspective
  fill(80, 70, 60);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 20) {
    let y = height - 150 + sin(x * 0.01) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Mist effect
  blendMode(ADD);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height / 2, height);
    let sz = random(10, 30);
    fill(255, 255, 255, 30);
    ellipse(x, y, sz, sz);
  }
  blendMode(BLEND);

  // Rolling hills in foreground
  stroke(0);
  noFill();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height / 2 + random(-50, 50);
    let r = random(300, 600);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let px = x + cos(a) * r;
      let py = y + sin(a) * r;
      vertex(px, py);
    }
    endShape(CLOSE);
  }

  // Textured field patches
  noStroke();
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height / 2);
    let sz = random(5, 30);
    let r = random(50, 150);
    fill(r, r + 30, r + 10);
    ellipse(x, y, sz, sz);
  }

  // Long shadows
  stroke(0, 0, 0, 100);
  strokeWeight(2);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height / 2);
    let len = random(300, 600);
    let angle = PI * 0.75;
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }
}
