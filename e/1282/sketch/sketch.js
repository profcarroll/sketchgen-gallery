let rings = [];
const numRings = 20;
const baseRadius = 50;
const maxRadius = 300;
const oscillationSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings with different properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: baseRadius + i * (maxRadius - baseRadius) / numRings,
      phase: i * 0.5, // Different phase for each ring
      color: color(
        map(i, 0, numRings - 1, 255, 0),
        map(i, 0, numRings - 1, 0, 255),
        map(i, 0, numRings - 1, 255, 0),
        200
      )
    });
  }
}

function draw() {
  background(0);
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;

  // Draw each ring with oscillating radius
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    const time = millis() * oscillationSpeed;
    const oscillation = sin(time + ring.phase) * 30;
    const currentRadius = ring.radius + oscillation;

    // Draw the ring
    noFill();
    stroke(ring.color);
    strokeWeight(2);
    ellipse(cx, cy, currentRadius * 2, currentRadius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
