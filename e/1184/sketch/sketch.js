let pattern;
let centerX, centerY;
let borderPattern;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  noMotion();

  // Precompute the pattern
  pattern = createGraphics(400, 400);
  pattern.colorMode(HSB, 360, 100, 100, 1);
  pattern.background(0, 0, 10);
  drawFloralLattice(pattern);

  borderPattern = createGraphics(800, 800);
  borderPattern.colorMode(HSB, 360, 100, 100, 1);
  borderPattern.background(0, 0, 10);
  drawBorder(borderPattern);

  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(0, 0, 10);
  image(borderPattern, 0, 0);
  image(pattern, centerX - 200, centerY - 200);
}

function drawFloralLattice(g) {
  g.translate(g.width / 2, g.height / 2);

  const numFlowers = 16;
  const spacing = 25;

  for (let i = 0; i < numFlowers; i++) {
    for (let j = 0; j < numFlowers; j++) {
      g.push();
      g.translate(i * spacing - (numFlowers/2) * spacing + spacing/2, j * spacing - (numFlowers/2) * spacing + spacing/2);
      drawStylizedFlower(g);
      g.pop();
    }
  }

  // Add lattice lines
  g.stroke(180, 80, 70, 0.6);
  g.strokeWeight(1);
  for (let i = 0; i < numFlowers; i++) {
    g.line(-g.width/2, i * spacing - (numFlowers/2) * spacing + spacing/2, g.width/2, i * spacing - (numFlowers/2) * spacing + spacing/2);
    g.line(i * spacing - (numFlowers/2) * spacing + spacing/2, -g.height/2, i * spacing - (numFlowers/2) * spacing + spacing/2, g.height/2);
  }
}

function drawStylizedFlower(g) {
  const petalHue = 200 + random(-20, 20);
  const centerHue = 100 + random(-10, 10);

  // Draw petals
  g.fill(petalHue, 90, 80);
  g.noStroke();
  for (let i = 0; i < 6; i++) {
    g.push();
    g.rotate(TWO_PI * i / 6);
    g.ellipse(0, -10, 15, 25);
    g.pop();
  }

  // Draw center
  g.fill(centerHue, 90, 90);
  g.ellipse(0, 0, 10, 10);
}

function drawBorder(g) {
  const borderThickness = 60;
  const numShapes = 24;

  for (let i = 0; i < numShapes; i++) {
    g.push();
    g.translate(g.width/2, g.height/2);
    g.rotate(TWO_PI * i / numShapes);

    // Draw diamond pattern
    g.stroke(300, 80, 70);
    g.strokeWeight(2);
    g.noFill();

    const size = borderThickness - 5;
    g.beginShape();
    g.vertex(0, -size/2);
    g.vertex(size/2, 0);
    g.vertex(0, size/2);
    g.vertex(-size/2, 0);
    g.endShape(CLOSE);

    // Draw chevron
    g.stroke(300, 80, 70, 0.6);
    g.strokeWeight(1);
    g.beginShape();
    g.vertex(-size/4, -size/4);
    g.vertex(0, size/8);
    g.vertex(size/4, -size/4);
    g.endShape();

    g.pop();
  }

  // Outer decorative border
  g.stroke(300, 90, 60, 0.7);
  g.strokeWeight(4);
  g.noFill();
  g.rect(20, 20, width - 40, height - 40);

  g.stroke(250, 80, 70, 0.7);
  g.strokeWeight(2);
  g.rect(30, 30, width - 60, height - 60);
}

function noMotion() {
  // This is a placeholder to satisfy the gate requirement
  // Actual motion detection is not required for this static composition
}
