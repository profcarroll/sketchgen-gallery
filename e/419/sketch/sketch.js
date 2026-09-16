let shapes = [];
let isShattered = false;
let collapseProgress = 0;

class Shape {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.originalX = x;
    this.originalY = y;
    this.originalW = w;
    this.originalH = h;
  }

  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  update() {
    if (isShattered) {
      // Simulate collapse and reformation
      this.x += (this.originalX - this.x) * 0.05;
      this.y += (this.originalY - this.y) * 0.05;
      this.w += (this.originalW - this.w) * 0.05;
      this.h += (this.originalH - this.h) * 0.05;
    } else {
      // Subtle movement
      this.x += sin(frameCount * 0.01 + this.originalX) * 0.2;
      this.y += cos(frameCount * 0.01 + this.originalY) * 0.2;
    }
  }

  isCollapsing() {
    return isShattered;
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create shapes
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(30, 100);
    let h = random(30, 100);
    let hue = random(180, 240); // Deep oceanic blues and slate greys
    let saturation = random(30, 60);
    let brightness = random(20, 50);
    let c = color(hue, saturation, brightness);

    shapes.push(new Shape(x, y, w, h, c));
  }
}

function draw() {
  background(220, 10, 95); // Muted background

  for (let shape of shapes) {
    shape.update();
    shape.display();
  }

  if (isShattered) {
    collapseProgress += 0.05;
    if (collapseProgress > 1) {
      collapseProgress = 0;
      isShattered = false;
    }
  }
}

function mousePressed() {
  if (!isShattered) {
    isShattered = true;
    // Add sharp bursts of primary color
    for (let i = 0; i < 5; i++) {
      let hue = random(0, 360);
      let saturation = 100;
      let brightness = 100;
      let c = color(hue, saturation, brightness);
      shapes.push(new Shape(random(width), random(height), random(20, 50), random(20, 50), c));
    }
  }
}
