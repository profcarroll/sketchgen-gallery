function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  noLoop();
}

function draw() {
  // Background gradient from sky to ground
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = lerp(25, 85, inter);
    let s = lerp(60, 90, inter);
    fill(30, s, b);
    rect(0, y, width, 1);
  }

  // Distant mountains
  drawMountains();

  // Mid-ground hills
  drawHills();

  // Foreground fields with detailed grass tufts
  drawForeground();
}

function drawMountains() {
  fill(20, 30, 40);
  noStroke();
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Misty layer
  fill(20, 20, 30, 0.2);
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);
}

function drawHills() {
  // Soft undulating hills
  for (let i = 0; i < 5; i++) {
    let yStart = height * 0.4 + i * 30;
    fill(30, 25, 50 + i * 5);
    noStroke();
    beginShape();
    vertex(0, yStart);
    for (let x = 0; x < width; x += 10) {
      let y = yStart + sin(x * 0.01 + i * 0.5) * 30;
      vertex(x, y);
    }
    vertex(width, yStart);
    endShape(CLOSE);
  }
}

function drawForeground() {
  // Detailed foreground fields
  for (let y = height * 0.6; y < height; y += 2) {
    for (let x = 0; x < width; x += 5) {
      let noiseVal = noise(x * 0.01, y * 0.01);
      let hue = map(noiseVal, 0, 1, 100, 130);
      let sat = map(noiseVal, 0, 1, 40, 70);
      let bri = map(noiseVal, 0, 1, 60, 90);
      fill(hue, sat, bri);
      rect(x, y, 5, 2);
    }
  }

  // Grass tufts
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let size = random(2, 6);
    let hue = map(noise(x * 0.01, y * 0.01), 0, 1, 100, 130);
    fill(hue, 60, 80);
    ellipse(x, y, size, size * 2);
  }

  // Shadows
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.4, height);
    let w = random(10, 30);
    let h = random(20, 60);
    fill(0, 0, 0, 0.2);
    rect(x, y, w, h);
  }
}
