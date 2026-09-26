let blocks = [];
const gravity = 0.2;
const friction = 0.98;
const bounceFactor = 0.7;
const maxBlocks = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Add new blocks occasionally
  if (frameCount % 5 === 0 && blocks.length < maxBlocks) {
    addBlock();
  }

  // Update and display blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    b.update();
    b.display();

    // Remove blocks that fall off screen
    if (b.y > height + 50 || b.x < -50 || b.x > width + 50) {
      blocks.splice(i, 1);
    }
  }

  // Draw center vortex
  drawVortex();
}

function addBlock() {
  const x = random(width);
  const y = -20;
  const w = random(8, 30);
  const h = random(15, 40);
  const angle = random(TWO_PI);
  const speed = random(0.5, 3);
  const hue = (frameCount * 2) % 360;
  const irregularity = random(0.8, 1.2);

  blocks.push({
    x: x,
    y: y,
    w: w,
    h: h,
    angle: angle,
    rotation: random(-0.05, 0.05),
    speed: speed,
    hue: hue,
    irregularity: irregularity,
    update: function() {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
      this.angle += this.rotation;
      this.speed *= friction;

      // Bounce off walls
      if (this.x < 0 || this.x > width) {
        this.angle = PI - this.angle;
        this.speed *= bounceFactor;
      }
    },
    display: function() {
      push();
      translate(this.x, this.y);
      rotate(this.angle);
      fill(this.hue, 80, 90);
      rect(-this.w/2, -this.h/2, this.w * this.irregularity, this.h * this.irregularity);
      pop();
    }
  });
}

function drawVortex() {
  const centerX = width / 2;
  const centerY = height / 2;
  const time = millis() * 0.001;

  // Draw spiral lines
  stroke(200, 50, 90, 0.3);
  noFill();
  beginShape();
  for (let i = 0; i < 100; i++) {
    const angle = i * 0.2 + time;
    const radius = 50 + i * 2;
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
