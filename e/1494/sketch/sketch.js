let corals = [];
let time = 0;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create initial coral structures
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 80);
    let segments = floor(random(3, 7));
    corals.push(new Coral(x, y, size, segments));
  }
}

function draw() {
  background(10, 20, 30);

  time += 0.005;
  hueOffset = (time * 0.5) % 360;

  // Update and display corals
  for (let coral of corals) {
    coral.update();
    coral.display();
  }
}

class Coral {
  constructor(x, y, size, segments) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.segments = segments;
    this.angle = random(TWO_PI);
    this.growth = random(0.5, 1.5);
    this.colorHue = random(20, 60); // Initial vibrant hues
    this.colorSaturation = random(80, 100);
    this.colorBrightness = random(70, 100);
    this.baseColor = color(this.colorHue, this.colorSaturation, this.colorBrightness);
    this.pulse = random(0.5, 2.0);
  }

  update() {
    this.angle += 0.01 * this.growth;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    let hueCycle = (hueOffset + this.colorHue) % 360;
    let satCycle = map(sin(time * 0.5 + this.size), -1, 1, 30, 100); // Fading effect
    let brightCycle = map(cos(time * 0.3 + this.size), -1, 1, 20, 100);

    // Cycle through color states
    let currentHue = hueCycle;
    let currentSat = satCycle;
    let currentBright = brightCycle;

    fill(currentHue, currentSat, currentBright);
    noStroke();

    for (let i = 0; i < this.segments; i++) {
      let angleStep = TWO_PI / this.segments;
      let a = i * angleStep;
      let b = (i + 1) * angleStep;

      let r1 = this.size * 0.5;
      let r2 = this.size * 0.8;
      let r3 = this.size * 1.2;

      beginShape();
      vertex(0, 0);
      vertex(r1 * cos(a), r1 * sin(a));
      vertex(r2 * cos(b), r2 * sin(b));
      vertex(r3 * cos(b), r3 * sin(b));
      vertex(r3 * cos(a), r3 * sin(a));
      endShape(CLOSE);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
