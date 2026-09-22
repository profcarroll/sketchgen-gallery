function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Background gradient for sunset
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = map(inter, 0, 1, 80, 20);
    stroke(30, 50, b);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric mist
  fill(240, 20, 30);
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.6 + sin(x / 100) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Foreground grass tufts with texture
  strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let h = random(10, 30);
    let s = random(20, 40);
    stroke(80, s, 60);
    line(x, y, x, y - h);

    // Add tuft texture
    strokeWeight(0.5);
    for (let j = 0; j < 3; j++) {
      let tx = x + random(-2, 2);
      let ty = y - random(5, h * 0.8);
      line(tx, ty, tx, ty - random(3, 6));
    }
  }

  // Dramatic shadows
  noStroke();
  fill(0, 0, 0, 0.1);
  beginShape();
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x / 80) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Sun
  fill(30, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 60, 60);
}
