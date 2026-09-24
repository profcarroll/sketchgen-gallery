let dominoes = [];
const gravity = 0.2;
const friction = 0.98;
const bounceFactor = 0.7;
const maxDominoes = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Add new dominoes occasionally
  if (frameCount % 10 === 0 && dominoes.length < maxDominoes) {
    addDomino();
  }

  // Update and display dominoes
  for (let i = dominoes.length - 1; i >= 0; i--) {
    const d = dominoes[i];
    d.update();
    d.display();

    // Remove dominoes that fall off screen
    if (d.y > height + 50 || d.x < -50 || d.x > width + 50) {
      dominoes.splice(i, 1);
    }
  }

  // Draw center vortex
  drawVortex();
}

function addDomino() {
  const x = random(width);
  const y = -20;
  const w = random(8, 16);
  const h = random(30, 50);
  const angle = random(TWO_PI);
  const speed = random(0.5, 2);
  const hue = (frameCount * 2) % 360;

  dominoes.push({
    x: x,
    y: y,
    w: w,
    h: h,
    angle: angle,
    rotation: random(-0.05, 0.05),
    speed: speed,
    hue: hue,
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
      rect(-this.w/2, -this.h/2, this.w, this.h);
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
