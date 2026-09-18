function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Background gradient for sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 200), color(100, 150, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains with atmospheric mist
  drawMountains();

  // Midground fields with texture
  drawFields();

  // Foreground grass details
  drawGrass();
}

function drawMountains() {
  // Draw a series of mountains with varying heights and colors
  fill(100, 120, 140);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 30) {
    let h = map(noise(x * 0.005, 10), 0, 1, 200, 300);
    vertex(x, height - h);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Mist layer
  fill(200, 220, 240, 80);
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 30) {
    let h = map(noise(x * 0.005, 10), 0, 1, 220, 320);
    vertex(x, height - h);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function drawFields() {
  // Create rolling fields with varying green hues
  for (let y = height * 0.4; y < height * 0.7; y += 10) {
    let yoff = y * 0.02;
    for (let x = 0; x < width; x += 30) {
      let n = noise(x * 0.01, yoff);
      let greenValue = map(n, 0, 1, 80, 150);
      fill(greenValue, 160, 40);
      noStroke();
      ellipse(x, y, 20, 5);
    }
  }

  // Add some color variation and texture
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.4, height * 0.7);
    let n = noise(x * 0.01, y * 0.02);
    let greenValue = map(n, 0, 1, 60, 180);
    fill(greenValue, 150, 30);
    noStroke();
    ellipse(x, y, random(2, 8), random(2, 8));
  }
}

function drawGrass() {
  // Draw detailed grass in foreground
  stroke(30, 120, 40);
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let h = random(5, 15);
    line(x, y, x, y - h);
  }

  // Add some texture with small patches
  fill(20, 100, 30);
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    ellipse(x, y, random(2, 6), random(2, 6));
  }
}
