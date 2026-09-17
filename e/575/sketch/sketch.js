let books = [];
let shredder;
let gears = [];
let plates = [];
let gravity = 0.2;
let collapseStart = 300;

class Book {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.angle = 0;
    this.leanSpeed = random(0.001, 0.005);
    this.collapse = false;
    this.fallSpeed = 0;
  }

  update() {
    if (frameCount > collapseStart) {
      this.collapse = true;
    }

    if (this.collapse) {
      this.fallSpeed += gravity;
      this.y += this.fallSpeed;

      // Rotate as it falls
      this.angle += 0.02;
    } else {
      // Lean back and forth slowly
      this.angle += sin(frameCount * this.leanSpeed) * 0.01;
    }

    // Check if book is in shredder
    if (this.y > shredder.y - 50 && this.x > shredder.x && this.x < shredder.x + shredder.w) {
      this.y = shredder.y - 50; // Stop at shredder opening
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    rect(-this.w/2, -this.h/2, this.w, this.h);
    pop();
  }
}

class Shredder {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.gearAngle = 0;
    this.plateAngle = 0;
  }

  update() {
    this.gearAngle += 0.05;
    this.plateAngle += 0.03;
  }

  display() {
    // Main body
    fill(100, 100, 100);
    rect(this.x, this.y, this.w, this.h);

    // Opening
    fill(200, 200, 200);
    rect(this.x + 20, this.y - 30, this.w - 40, 30);

    // Gears
    push();
    translate(this.x + 50, this.y + 20);
    rotate(this.gearAngle);
    fill(180);
    rect(-10, -10, 20, 20);
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i;
      let x = cos(angle) * 15;
      let y = sin(angle) * 15;
      fill(150);
      ellipse(x, y, 4, 4);
    }
    pop();

    // Plates
    push();
    translate(this.x + this.w - 50, this.y + 20);
    rotate(this.plateAngle);
    fill(160);
    rect(-8, -8, 16, 16);
    for (let i = 0; i < 4; i++) {
      let angle = TWO_PI / 4 * i;
      let x = cos(angle) * 12;
      let y = sin(angle) * 12;
      fill(130);
      ellipse(x, y, 3, 3);
    }
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create books
  let bookHeight = 40;
  let bookWidth = 30;
  let startY = height - 150;

  for (let i = 0; i < 8; i++) {
    let x = width/2 + random(-100, 100);
    let y = startY - i * (bookHeight + 5);
    let hue = random(20, 40); // Warm colors
    books.push(new Book(x, y, bookWidth, bookHeight, color(hue, 80, 90)));
  }

  // Create shredder
  shredder = new Shredder(width/2 - 100, height - 50, 200, 60);
}

function draw() {
  background(220, 20, 95);

  // Update and display shredder
  shredder.update();
  shredder.display();

  // Update and display books
  for (let book of books) {
    book.update();
    book.display();
  }

  // Add some visual effects to show the shredding
  if (frameCount > collapseStart + 20) {
    fill(255, 100);
    noStroke();
    ellipse(width/2, height - 20, 40, 40);
    ellipse(width/2, height - 20, 30, 30);
    ellipse(width/2, height - 20, 20, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
