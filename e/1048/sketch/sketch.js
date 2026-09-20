let pulses = [];
let grid;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  grid = createGraphics(width, height);
  grid.colorMode(HSB, 360, 100, 100, 1);
  grid.background(0, 0, 0, 1);
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      grid.stroke(0, 0, 100, 0.05);
      grid.line(x, y, x + 20, y + 20);
      grid.line(x + 20, y, x, y + 20);
    }
  }
}

function draw() {
  background(0, 0, 0, 1);
  image(grid, 0, 0);

  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    p.update();
    p.display();
    if (p.isFinished()) {
      pulses.splice(i, 1);
    }
  }

  // Add new pulse occasionally
  if (frameCount % 30 === 0) {
    pulses.push(new Pulse());
  }

  // Shift the entire field slightly
  translate(sin(frameCount * 0.01) * 2, cos(frameCount * 0.01) * 2);
}

class Pulse {
  constructor() {
    this.x = width / 2 + random(-50, 50);
    this.y = height / 2 + random(-50, 50);
    this.radius = 0;
    this.maxRadius = random(50, 100);
    this.alpha = random(0.7, 1);
    this.hue = random(0, 30); // Red range
  }

  update() {
    this.radius += 2;
  }

  display() {
    if (this.radius > this.maxRadius) return;

    noFill();
    stroke(this.hue, 100, 100, this.alpha * (1 - this.radius / this.maxRadius));
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.radius > this.maxRadius;
  }
}
