let scanlines = [];
let interferenceBursts = [];

function setup() {
  createCanvas(400, 300);
  pixelDensity(1);

  // Initialize scanlines
  for (let y = 0; y < height; y += 2) {
    scanlines.push(y);
  }

  noLoop();
  frameRate(30);
}

function draw() {
  background(0);

  // Draw scanlines
  stroke(50, 50, 50);
  strokeWeight(1);
  for (let y of scanlines) {
    line(0, y, width, y);
  }

  // Add interference bursts occasionally
  if (frameCount % 30 === 0) {
    interferenceBursts.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      duration: random(10, 30)
    });
  }

  // Update and draw bursts
  for (let i = interferenceBursts.length - 1; i >= 0; i--) {
    let burst = interferenceBursts[i];
    burst.duration--;
    
    if (burst.duration <= 0) {
      interferenceBursts.splice(i, 1);
      continue;
    }

    // Distort scanlines around the burst
    for (let y of scanlines) {
      let d = dist(burst.x, burst.y, width/2, y);
      if (d < burst.size) {
        let angle = atan2(y - burst.y, width/2 - burst.x);
        let force = map(d, 0, burst.size, 10, 0);
        let offsetX = cos(angle) * force;
        let offsetY = sin(angle) * force;

        // Draw distorted scanline segment
        stroke(255, 255, 255, 100);
        strokeWeight(1);
        line(0 + offsetX, y + offsetY, width + offsetX, y + offsetY);
      }
    }

    // Draw a glowing burst effect
    noStroke();
    fill(255, 255, 255, 30);
    ellipse(burst.x, burst.y, burst.size * 2);
  }

  // Occasionally jitter the whole view
  if (frameCount % 100 === 0) {
    translate(random(-2, 2), random(-2, 2));
  }
}
