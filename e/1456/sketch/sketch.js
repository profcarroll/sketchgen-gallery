let burners = [];
let dialAngle = 0;
let dialPressed = false;
let flameParticles = [];

class Burner {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.active = false;
    this.glowIntensity = 0;
    this.flameIntensity = 0;
  }

  update(active, intensity) {
    this.active = active;
    this.flameIntensity = intensity;
    this.glowIntensity = map(intensity, 0, 1, 0, 255);
  }

  display() {
    // Burner casing
    fill(50);
    stroke(30);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);

    // Glow effect when active
    if (this.active && this.glowIntensity > 0) {
      noStroke();
      for (let i = 0; i < 5; i++) {
        let alpha = map(i, 0, 4, this.glowIntensity, 0);
        fill(255, 50, 50, alpha);
        ellipse(this.x, this.y, this.radius * 2 + i * 3);
      }
    }

    // Flame effect
    if (this.active && this.flameIntensity > 0) {
      let flameHeight = map(this.flameIntensity, 0, 1, 0, 30);
      for (let i = 0; i < 50; i++) {
        let angle = random(TWO_PI);
        let distance = random(5, 10);
        let size = random(2, 6);
        let r = map(i, 0, 50, 100, 255);
        let g = map(i, 0, 50, 150, 100);
        let b = map(i, 0, 50, 255, 100);

        fill(r, g, b, 150);
        noStroke();
        ellipse(
          this.x + cos(angle) * distance,
          this.y - flameHeight + random(-3, 3),
          size
        );
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let centerX = width / 2;
  let centerY = height / 2;

  // Create burners in a circular arrangement
  let numBurners = 4;
  let radius = min(width, height) * 0.3;
  for (let i = 0; i < numBurners; i++) {
    let angle = map(i, 0, numBurners, 0, TWO_PI);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    burners.push(new Burner(x, y, 20));
  }
}

function draw() {
  background(30);

  // Draw dial
  let centerX = width / 2;
  let centerY = height / 2;
  let dialRadius = 50;

  stroke(100);
  strokeWeight(3);
  noFill();
  ellipse(centerX, centerY, dialRadius * 2);

  // Dial indicator line
  let indicatorAngle = dialAngle + PI / 2;
  stroke(255);
  strokeWeight(2);
  line(
    centerX,
    centerY,
    centerX + cos(indicatorAngle) * dialRadius,
    centerY + sin(indicatorAngle) * dialRadius
  );

  // Draw burners
  for (let burner of burners) {
    burner.display();
  }
}

function mousePressed() {
  let centerX = width / 2;
  let centerY = height / 2;
  let d = dist(mouseX, mouseY, centerX, centerY);
  if (d < 50) {
    dialPressed = true;
  }
}

function mouseReleased() {
  dialPressed = false;
}

function mouseDragged() {
  if (!dialPressed) return;

  let centerX = width / 2;
  let centerY = height / 2;
  let angle = atan2(mouseY - centerY, mouseX - centerX);
  dialAngle = angle;

  // Normalize to [0, 2π]
  if (dialAngle < 0) dialAngle += TWO_PI;

  // Update burners based on dial position
  let numBurners = burners.length;
  for (let i = 0; i < numBurners; i++) {
    let angleDiff = abs(angle - map(i, 0, numBurners, 0, TWO_PI));
    if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;

    // Map to flame intensity
    let intensity = map(angleDiff, 0, PI, 1, 0);
    intensity = constrain(intensity, 0, 1);

    burners[i].update(true, intensity);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
