let rings = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 100);

  // Add a new ring every 5 frames
  if (frameCount % 5 === 0) {
    rings.push({
      radius: 0,
      alpha: 1,
      hue: frameCount % 360
    });
  }

  // Update and display rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    ring.radius += 2;
    ring.alpha -= 0.01;

    if (ring.alpha <= 0) {
      rings.splice(i, 1);
      continue;
    }

    // Draw the ring as a transparent ellipse
    fill(ring.hue, 80, 70, ring.alpha);
    ellipse(width/2, height/2, ring.radius * 2, ring.radius * 2);
  }
}
