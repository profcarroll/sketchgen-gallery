function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 204, 153), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw distant mountains
  fill(100, 100, 120);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 20) {
    let y = height - 150 + sin(x * 0.01) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Draw rolling green fields
  fill(34, 139, 34);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 10) {
    let y = height - 100 + sin(x * 0.02) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Add patches of varied color and contrast
  fill(0, 100, 0);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height - 100 + random(-20, 20);
    let sz = random(20, 60);
    ellipse(x, y, sz, sz);
  }

  // Add atmospheric haze to mountains
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height - 180 + random(-30, 30);
    let sz = random(200, 400);
    fill(100, 100, 120, 50);
    noStroke();
    ellipse(x, y, sz, sz);
  }
}
