let rings = [];
const maxRings = 200;
const expansionRate = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Update and display rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    ring.update();
    ring.display();

    // Remove rings that are too large or faded out
    if (ring.radius > width * 1.5 || ring.alpha < 0) {
      rings.splice(i, 1);
    }
  }

  // Add new rings periodically
  if (frameCount % 3 === 0 && rings.length < maxRings) {
    rings.push(new Ring());
  }
}

class Ring {
  constructor() {
    this.radius = 0;
    this.angle = random(TWO_PI);
    this.speed = random(0.5, 1.5); // Initial speed
    this.alpha = 255;
    this.hue = (frameCount * 2) % 360; // Color cycling
    this.wavePhase = random(TWO_PI);
  }

  update() {
    // Accelerate the expansion rate over time
    this.radius += this.speed + (this.radius / 1000);

    // Add wave-like motion
    let waveEffect = sin(this.wavePhase + frameCount * 0.05) * 20;
    this.angle += map(waveEffect, -20, 20, -0.01, 0.01);

    // Fade out over time
    this.alpha -= 0.8;

    // Adjust speed based on radius to create acceleration
    this.speed = expansionRate + (this.radius / 500);
  }

  display() {
    push();
    translate(width / 2, height / 2);
    rotate(this.angle);
    
    // Draw the ring with a subtle glow effect
    fill(this.hue, 80, 90, this.alpha / 255);
    noStroke();
    ellipse(0, 0, this.radius * 2, this.radius * 2);

    // Add inner ring for more visual depth
    fill(this.hue, 60, 70, this.alpha / 255);
    ellipse(0, 0, this.radius * 1.8, this.radius * 1.8);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
