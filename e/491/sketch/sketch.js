let rings = [];
const numRings = 20;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Initialize rings with varying properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: random(50, maxRadius),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(80, 100),
      alpha: random(0.3, 0.7),
      ripplePhase: random(TWO_PI),
      expansionPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);

  // Center of canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw each ring with ripple and expansion effects
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];

    // Update phase for ripple effect
    ring.ripplePhase += ring.speed * 0.5;
    ring.expansionPhase += ring.speed;

    // Ripple effect: radius oscillates
    const rippleRadius = ring.radius + sin(ring.ripplePhase) * 20;

    // Expansion effect: grows over time
    const expansionFactor = 1 + sin(ring.expansionPhase) * 0.5;
    const finalRadius = rippleRadius * expansionFactor;

    // Color shift over time
    const hueShift = (frameCount * 0.3 + i * 10) % 360;
    ring.hue = (ring.hue + 0.2) % 360;

    fill(hueShift, ring.saturation, ring.brightness, ring.alpha);

    // Draw the ring as a circle
    ellipse(centerX, centerY, finalRadius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
