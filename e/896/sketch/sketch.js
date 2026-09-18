let books = [];
let gears = [];
let sparks = [];
let splinters = [];
let smoke = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a stack of books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: width / 2,
      y: height / 4 - i * 20,
      w: 100,
      h: 15,
      angle: 0
    });
  }

  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      x: width / 2 + i * 100,
      y: height / 2,
      r: 40 + i * 10,
      speed: 0.05 + i * 0.02,
      angle: 0
    });
  }

  // Initialize smoke particles
  for (let i = 0; i < 100; i++) {
    smoke.push({
      x: width / 2,
      y: height / 2,
      size: random(5, 20),
      speedX: random(-1, 1),
      speedY: random(-2, -0.5),
      life: random(30, 60)
    });
  }
}

function draw() {
  background(30, 20, 10);

  // Update and display books
  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    book.y += 0.5;
    if (book.y > height / 2 + 50) {
      book.y = height / 2 + 50;
    }
    fill(139, 69, 19);
    noStroke();
    rect(book.x - book.w/2, book.y, book.w, book.h);
  }

  // Update and display gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.angle += gear.speed;
    stroke(100);
    noFill();
    ellipse(gear.x, gear.y, gear.r * 2);

    // Draw gear teeth
    for (let j = 0; j < 12; j++) {
      let angle = gear.angle + j * TWO_PI / 12;
      let x1 = gear.x + cos(angle) * (gear.r - 5);
      let y1 = gear.y + sin(angle) * (gear.r - 5);
      let x2 = gear.x + cos(angle) * (gear.r + 5);
      let y2 = gear.y + sin(angle) * (gear.r + 5);
      line(x1, y1, x2, y2);
    }

    // Generate sparks and splinters
    if (random() < 0.3) {
      sparks.push({
        x: gear.x,
        y: gear.y,
        size: random(2, 5),
        speedX: random(-2, 2),
        speedY: random(-2, 2),
        life: random(10, 20)
      });
    }

    if (random() < 0.2) {
      splinters.push({
        x: gear.x,
        y: gear.y,
        size: random(3, 8),
        speedX: random(-3, 3),
        speedY: random(-3, 3),
        life: random(15, 30)
      });
    }
  }

  // Update and display sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.life--;
    if (s.life <= 0) {
      sparks.splice(i, 1);
    } else {
      fill(255, 200, 0);
      noStroke();
      ellipse(s.x, s.y, s.size);
    }
  }

  // Update and display splinters
  for (let i = splinters.length - 1; i >= 0; i--) {
    let s = splinters[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.life--;
    if (s.life <= 0) {
      splinters.splice(i, 1);
    } else {
      fill(200, 150, 100);
      noStroke();
      ellipse(s.x, s.y, s.size);
    }
  }

  // Update and display smoke
  for (let i = smoke.length - 1; i >= 0; i--) {
    let s = smoke[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.life--;
    if (s.life <= 0) {
      smoke.splice(i, 1);
    } else {
      fill(200, 200, 200, s.life * 2);
      noStroke();
      ellipse(s.x, s.y, s.size);
    }
  }

  // Occasionally add new smoke
  if (random() < 0.1) {
    smoke.push({
      x: width / 2,
      y: height / 2,
      size: random(5, 20),
      speedX: random(-1, 1),
      speedY: random(-2, -0.5),
      life: random(30, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
