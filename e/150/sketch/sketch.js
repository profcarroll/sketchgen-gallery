function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = lerp(100, 255, inter);
    stroke(0, 0, b);
    line(0, y, width, y);
  }

  // Draw distant mountains
  fill(180, 200, 220);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + random(-30, 30);
    vertex(x, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);

  // Draw midground hills
  fill(120, 180, 120);
  beginShape();
  vertex(0, height * 0.6);
  for (let x = 0; x < width; x += 15) {
    let y = height * 0.6 + sin(x * 0.02) * 50;
    vertex(x, y);
  }
  vertex(width, height * 0.6);
  endShape(CLOSE);

  // Draw foreground grass with rich green details
  stroke(0, 100, 0);
  for (let x = 0; x < width; x += 2) {
    let y = height * 0.5 + sin(x * 0.03) * 30;
    line(x, y, x, y - random(10, 30));
  }

  // Add radial warmth
  let r = min(width, height) * 0.7;
  for (let i = 0; i < r; i += 5) {
    let alpha = map(i, 0, r, 20, 0);
    let radius = i;
    fill(255, 200, 100, alpha);
    ellipse(width/2, height/2, radius * 2, radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
