function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Sky background
  background(200, 80, 90);

  // Draw distant mountains
  fill(180, 40, 30);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + random(-30, 30);
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw rolling fields
  for (let y = height * 0.7; y < height; y += 20) {
    let hue = map(y, height * 0.7, height, 100, 80);
    let sat = map(y, height * 0.7, height, 60, 40);
    let bri = map(y, height * 0.7, height, 50, 30);
    fill(hue, sat, bri);
    noStroke();
    beginShape();
    vertex(0, y);
    for (let x = 0; x < width; x += 10) {
      let yOff = sin(x * 0.02 + frameCount * 0.01) * 15;
      vertex(x, y + yOff);
    }
    vertex(width, y);
    endShape(CLOSE);
  }

  // Add some texture to fields
  stroke(100, 30, 20, 0.3);
  strokeWeight(1);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    point(x, y);
  }

  // Add exaggerated shadows
  noStroke();
  fill(0, 0, 0, 0.3);
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + random(-10, 10);
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Add distant haze
  blendMode(ADD);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height * 0.5, height * 0.7);
    let size = random(50, 200);
    let alpha = map(y, height * 0.5, height * 0.7, 0.1, 0.02);
    fill(200, 30, 80, alpha);
    ellipse(x, y, size, size * 0.6);
  }
  blendMode(BLEND);

  // Sun
  noStroke();
  fill(60, 100, 100);
  ellipse(width * 0.8, height * 0.2, 100, 100);
}
