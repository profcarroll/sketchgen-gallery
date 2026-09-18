let books = [];
let sparks = [];
let dust = [];
let gears = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: random(-200, 200),
      y: -300 - i * 40,
      z: random(-50, 50),
      width: random(60, 80),
      height: random(10, 20),
      depth: random(5, 15),
      color: color(random(100, 255), random(50, 200), random(50, 200))
    });
  }

  // Create gears
  for (let i = 0; i < 5; i++) {
    gears.push({
      x: 0,
      y: 0,
      z: -100 + i * 30,
      radius: random(20, 40),
      rotation: random(TWO_PI),
      speed: random(0.02, 0.05)
    });
  }
}

function draw() {
  background(0);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);

  // Move books
  for (let book of books) {
    book.y += 1;
    if (book.y > 200) {
      book.y = -300;
      book.x = random(-200, 200);
      book.z = random(-50, 50);
    }
  }

  // Create sparks when books fall through shredder
  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    if (book.y > -100 && book.y < 0) {
      if (random() < 0.2) {
        sparks.push({
          x: book.x + random(-book.width/2, book.width/2),
          y: book.y,
          z: book.z + random(-book.depth/2, book.depth/2),
          vx: random(-1, 1),
          vy: random(-2, -0.5),
          vz: random(-1, 1),
          life: 30
        });
      }
    }
  }

  // Update sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.z += s.vz;
    s.life--;
    if (s.life <= 0) {
      sparks.splice(i, 1);
    }
  }

  // Create dust
  for (let i = 0; i < 2; i++) {
    if (random() < 0.3) {
      dust.push({
        x: random(-50, 50),
        y: -50,
        z: random(-50, 50),
        size: random(1, 5),
        life: random(60, 120)
      });
    }
  }

  // Update dust
  for (let i = dust.length - 1; i >= 0; i--) {
    let d = dust[i];
    d.y -= 0.2;
    d.life--;
    if (d.life <= 0) {
      dust.splice(i, 1);
    }
  }

  // Update gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
  }

  // Draw shredder mechanism
  push();
  translate(0, -100, 0);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.02);

  // Gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    stroke(150);
    noFill();
    sphere(gear.radius, 16, 8);
    
    // Gear teeth
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI * i / 12;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      stroke(200);
      line(x, y, 0, x + cos(angle) * 5, y + sin(angle) * 5, 0);
    }
    pop();
  }

  // Shredding plates
  for (let i = 0; i < 4; i++) {
    push();
    translate(0, -30 + i * 15, 0);
    rotateX(PI/2);
    stroke(180);
    fill(100);
    rect(-100, -20, 200, 40);
    pop();
  }

  // Steam plumes
  for (let i = 0; i < 3; i++) {
    push();
    translate(random(-20, 20), -120 + random(0, 20), random(-10, 10));
    stroke(200, 150);
    noFill();
    beginShape();
    for (let j = 0; j < 20; j++) {
      let angle = map(j, 0, 20, 0, TWO_PI);
      let x = sin(angle) * 5;
      let y = -j * 3;
      let z = cos(angle) * 5;
      vertex(x, y, z);
    }
    endShape();
    pop();
  }

  pop();

  // Draw books
  for (let book of books) {
    push();
    translate(book.x, book.y, book.z);
    fill(book.color);
    noStroke();
    box(book.width, book.height, book.depth);
    pop();
  }

  // Draw sparks
  for (let s of sparks) {
    push();
    translate(s.x, s.y, s.z);
    fill(255, 200, 0);
    noStroke();
    sphere(2, 4, 4);
    pop();
  }

  // Draw dust
  for (let d of dust) {
    push();
    translate(d.x, d.y, d.z);
    fill(150);
    noStroke();
    sphere(d.size, 4, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
