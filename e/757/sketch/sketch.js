function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 200), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw distant mountains
  drawMountains();

  // Draw foreground fields
  drawFields();

  // Draw sun
  drawSun();
}

function drawMountains() {
  fill(100, 120, 140);
  noStroke();
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x * 0.01) * 50 + noise(x * 0.005) * 30;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Add haze effect
  fill(180, 200, 220, 80);
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.6 + sin(x * 0.01) * 30 + noise(x * 0.005) * 20;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);
}

function drawFields() {
  // Draw rolling green fields
  for (let y = height * 0.6; y < height; y += 10) {
    let offset = sin(y * 0.01) * 5;
    stroke(30, 120, 30);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let x = 0; x < width; x += 5) {
      let yoff = sin(x * 0.01 + frameCount * 0.001) * 2;
      vertex(x, y + yoff);
    }
    endShape();
  }

  // Add some variation with different green tones
  for (let y = height * 0.6; y < height; y += 15) {
    let offset = sin(y * 0.01) * 8;
    stroke(20, 100, 20);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let x = 0; x < width; x += 7) {
      let yoff = sin(x * 0.01 + frameCount * 0.001 + 3) * 3;
      vertex(x, y + yoff);
    }
    endShape();
  }

  // Add some texture with small patches
  fill(25, 110, 25);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height * 0.6 + random(height * 0.4);
    let size = random(2, 8);
    ellipse(x, y, size, size);
  }
}

function drawSun() {
  fill(255, 255, 200);
  noStroke();
  ellipse(width - 100, 100, 60, 60);

  // Add glow effect
  for (let i = 0; i < 10; i++) {
    let radius = 60 + i * 5;
    let alpha = 30 - i * 3;
    fill(255, 255, 200, alpha);
    ellipse(width - 100, 100, radius, radius);
  }
}
