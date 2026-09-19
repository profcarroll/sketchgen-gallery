function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  noLoop();
}

function draw() {
  // Background gradient for sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = lerp(25, 35, inter);
    stroke(30, 10, b);
    line(0, y, width, y);
  }

  // Draw distant mountains
  drawMountains();

  // Draw rolling fields in foreground
  drawFields();

  // Add atmospheric haze
  drawHaze();
}

function drawMountains() {
  fill(240, 15, 20); // Dark blue-gray
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height * 0.6 + sin(x / 100) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Add some more distant peaks
  fill(245, 10, 15);
  beginShape();
  for (let x = 0; x < width; x += 15) {
    let y = height * 0.6 + sin(x / 150) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawFields() {
  // Draw grassy patches
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height * 0.6, height * 0.85);
    let w = random(10, 40);
    let h = random(20, 80);

    // Color variation for grass
    let hue = 90 + random(-10, 10); // Green range
    let sat = 60 + random(-10, 10);
    let bri = 40 + random(-10, 20);

    fill(hue, sat, bri);
    rect(x, y, w, h, 5); // Rounded corners for patchy grass

    // Add some longer shadows
    stroke(0, 0, 0, 30);
    strokeWeight(2);
    line(x + w * 0.5, y, x + w * 0.7, y - h * 0.8);
  }

  // Draw detailed patches of varying tones
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = height * 0.7;
    let size = random(10, 40);

    let hue = 80 + random(-20, 20); // Varying green tones
    let sat = 50 + random(-10, 10);
    let bri = 30 + random(-10, 20);

    fill(hue, sat, bri);
    ellipse(x, y, size, size * 0.8); // Elliptical patches

    // Cast shadow
    noFill();
    stroke(0, 0, 0, 20);
    strokeWeight(1);
    line(x + size * 0.3, y + size * 0.4, x + size * 0.8, y + size * 0.9);
  }
}

function drawHaze() {
  // Add atmospheric haze effect
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height * 0.6;
    let w = random(100, 300);
    let h = random(20, 80);

    // Soft, hazy color
    fill(240, 5, 50, 10);
    noStroke();
    ellipse(x, y, w, h);
  }
}
