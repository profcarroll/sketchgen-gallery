let pulses = [];
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0);

  // Draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.alpha -= 0.01;
    fill(t.hue, 100, 100, t.alpha);
    ellipse(t.x, t.y, t.size);
    if (t.alpha <= 0) {
      trails.splice(i, 1);
    }
  }

  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    p.radius += p.speed;
    p.alpha -= 0.02;

    if (p.alpha <= 0) {
      pulses.splice(i, 1);
      continue;
    }

    // Add some jitter to make it asymmetric
    let jitter = sin(frameCount * 0.05 + p.id) * 0.3;
    fill(p.hue, 100, 100, p.alpha);
    ellipse(p.x, p.y, p.radius + jitter * 20);

    // Add trail
    if (frameCount % 3 === 0) {
      trails.push({
        x: p.x,
        y: p.y,
        size: p.radius * 0.3,
        hue: p.hue,
        alpha: 0.7
      });
    }
  }

  // Occasionally add new pulse
  if (frameCount % 40 === 0) {
    pulses.push({
      x: random(width),
      y: random(height),
      radius: 0,
      speed: random(1, 3),
      alpha: 1,
      hue: random(0, 360),
      id: frameCount
    });
  }

  // Occasionally distort pulse
  if (frameCount % 150 === 0 && pulses.length > 0) {
    let idx = floor(random(pulses.length));
    pulses[idx].distort = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
