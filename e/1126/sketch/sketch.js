let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(GRAY);
  // Initialize with one ring at center
  rings.push({
    x: width / 2,
    y: height / 2,
    radius: 0,
    alpha: 255
  });
}

function draw() {
  background(0); // Black background

  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    ring.radius += 2;
    ring.alpha -= 2;

    // Draw the ring as a stroke
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(ring.x, ring.y, ring.radius * 2);

    // Remove rings that fade out completely
    if (ring.alpha <= 0) {
      rings.splice(i, 1);
    }
  }

  // Add a new ring occasionally to keep the pattern going
  if (frameCount % 10 === 0) {
    rings.push({
      x: width / 2,
      y: height / 2,
      radius: 0,
      alpha: 255
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
