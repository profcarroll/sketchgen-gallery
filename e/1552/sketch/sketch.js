let keys = [];
let ripples = [];

// Keyboard key class
class Key {
  constructor(x, y, w, h, isBlack) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isBlack = isBlack;
    this.pressed = false;
    this.pressDepth = 0;
    this.pressSpeed = 0.2;
    this.releaseSpeed = 0.1;
  }

  display() {
    fill(this.isBlack ? 0 : 255);
    stroke(0);
    rect(this.x, this.y, this.w, this.h, 3);

    if (this.pressed) {
      fill(this.isBlack ? 30 : 220);
      rect(this.x, this.y + this.pressDepth, this.w, this.h, 3);
    }
  }

  press() {
    this.pressed = true;
    this.pressDepth = 0;
  }

  release() {
    this.pressed = false;
  }

  update() {
    if (this.pressed) {
      this.pressDepth += this.pressSpeed;
      if (this.pressDepth > 10) this.pressDepth = 10;
    } else {
      if (this.pressDepth > 0) {
        this.pressDepth -= this.releaseSpeed;
        if (this.pressDepth < 0) this.pressDepth = 0;
      }
    }
  }

  isPointInside(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }
}

// Ripple class
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 300;
    this.alpha = 255;
    // Start with bright color, transition to emerald green
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  update() {
    this.radius += 3;
    this.alpha -= 1.5;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
    
    // Transition to emerald green as ripple expands
    if (this.radius > 50) {
      let emerald = color(0, 128, 0, this.alpha);
      stroke(emerald);
      ellipse(this.x, this.y, (this.radius - 30) * 2);
    }
  }

  isFinished() {
    return this.alpha <= 0 || this.radius > this.maxRadius;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create keyboard keys
  const keyWidth = width / 20;
  const whiteKeyHeight = height * 0.6;
  const blackKeyHeight = height * 0.4;

  for (let i = 0; i < 12; i++) {
    const x = i * keyWidth;
    // White keys
    keys.push(new Key(x, height - whiteKeyHeight, keyWidth, whiteKeyHeight, false));

    // Black keys
    if (i !== 3 && i !== 7) { // Skip positions where black keys would overlap
      const blackKeyWidth = keyWidth * 0.6;
      const blackKeyX = x + keyWidth * 0.2;
      keys.push(new Key(blackKeyX, height - whiteKeyHeight, blackKeyWidth, blackKeyHeight, true));
    }
  }
}

function draw() {
  background(50);

  // Update and display keys
  for (let key of keys) {
    key.update();
    key.display();
  }

  // Update and display ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Check if any key was pressed
  for (let k of keys) {
    if (k.isPointInside(mouseX, mouseY)) {
      k.press();
      // Create ripple effect
      ripples.push(new Ripple(k.x + k.w / 2, k.y + k.h / 2));
      break;
    }
  }
}

function mouseReleased() {
  for (let k of keys) {
    k.release();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
