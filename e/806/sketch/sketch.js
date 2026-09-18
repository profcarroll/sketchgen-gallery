let stripes = [];
const numStripes = 12;
const anchorPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize anchor points
  for (let i = 0; i < 8; i++) {
    anchorPoints.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      hue: random(360)
    });
  }

  // Initialize stripes
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      width: random(30, 100),
      hue: random(360),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement
  const time = millis() * 0.0005;
  const camX = sin(time * 0.3) * 300;
  const camY = cos(time * 0.2) * 100;
  const camZ = 500 + sin(time * 0.1) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw anchor points
  for (let anchor of anchorPoints) {
    push();
    translate(anchor.x, anchor.y, anchor.z);
    fill(anchor.hue, 100, 100, 0.8);
    sphere(15);
    pop();
  }

  // Update and draw stripes
  for (let i = 0; i < numStripes; i++) {
    const stripe = stripes[i];
    const time = millis() * 0.001;

    // Apply warping based on anchor points
    let warpX = 0;
    let warpY = 0;
    let warpZ = 0;
    let totalWeight = 0;

    for (let anchor of anchorPoints) {
      const dx = anchor.x - cos(stripe.angle) * width;
      const dy = anchor.y - sin(stripe.angle) * height;
      const dist = sqrt(dx*dx + dy*dy);
      const weight = 1000 / (dist + 10);
      totalWeight += weight;

      warpX += weight * anchor.x;
      warpY += weight * anchor.y;
      warpZ += weight * anchor.z;
    }

    if (totalWeight > 0) {
      warpX /= totalWeight;
      warpY /= totalWeight;
      warpZ /= totalWeight;
    }

    // Stripe position and rotation
    const angle = stripe.angle + time * stripe.speed;
    const phase = time * stripe.phase;

    push();
    rotateY(angle);
    translate(warpX, warpY, warpZ);

    // Create a warped plane
    const segments = 20;
    beginShape(TRIANGLES);
    for (let j = 0; j < segments; j++) {
      const t1 = map(j, 0, segments - 1, 0, TWO_PI);
      const t2 = map(j + 1, 0, segments - 1, 0, TWO_PI);

      const x1 = sin(t1) * stripe.width;
      const y1 = cos(t1) * stripe.width;
      const x2 = sin(t2) * stripe.width;
      const y2 = cos(t2) * stripe.width;

      // Apply some warping to the points
      const dx1 = (sin(t1 + phase) * 30);
      const dy1 = (cos(t1 + phase) * 30);
      const dx2 = (sin(t2 + phase) * 30);
      const dy2 = (cos(t2 + phase) * 30);

      fill(stripe.hue, 100, 100, 0.7);
      vertex(x1 + dx1, y1 + dy1, 0);
      vertex(x2 + dx2, y2 + dy2, 0);
      vertex(0, 0, 0);

      // Add a second triangle for more visual complexity
      fill(stripe.hue, 100, 80, 0.5);
      vertex(x1 + dx1, y1 + dy1, 0);
      vertex(0, 0, 0);
      vertex(x2 + dx2, y2 + dy2, 0);
    }
    endShape();
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
