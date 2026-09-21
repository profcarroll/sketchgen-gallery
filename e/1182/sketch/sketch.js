function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Background gradient for sunset
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(20, 90, 80), color(30, 100, 60), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric mist
  fill(240, 20, 20);
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.6 + sin(x / 100) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Foreground fields with rolling hills
  stroke(120, 50, 40);
  noFill();
  for (let y = height * 0.7; y < height; y += 3) {
    beginShape();
    for (let x = 0; x < width; x += 5) {
      let yoff = map(y, height * 0.7, height, 0, 1);
      let n = noise(x * 0.01, yoff * 0.01) * 30;
      vertex(x, y + n);
    }
    endShape();
  }

  // Plant tufts in foreground
  noStroke();
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = height * 0.8 + random(30);
    let sz = random(2, 6);
    fill(100, 70, 60);
    ellipse(x, y, sz, sz * 1.5);
    fill(120, 80, 70);
    ellipse(x, y - sz/2, sz * 0.8, sz * 0.8);
  }

  // Dramatic shadows
  for (let x = 0; x < width; x += 5) {
    let yoff = map(x, 0, width, 0, 1);
    let n = noise(yoff * 0.01) * 20;
    let shadowHeight = height * 0.7 + n;
    stroke(0, 0, 0, 0.1);
    line(x, height * 0.8, x, shadowHeight);
  }

  // Sun
  fill(30, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 80, 80);

  // Sun glow
  for (let i = 0; i < 5; i++) {
    let r = 80 + i * 10;
    fill(30, 100, 100, 0.1 - i * 0.02);
    ellipse(width * 0.8, height * 0.2, r, r);
  }
}
