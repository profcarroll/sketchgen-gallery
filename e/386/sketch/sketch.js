let dustDevils = [];
let cracks = [];
let skyColor;
let groundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Sky colors: pale beige
  skyColor = color(245, 240, 230);

  // Ground colors: terracotta earth tones
  groundColor = color(180, 90, 60);

  // Create initial cracks in the ground
  for (let i = 0; i < 100; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.3, height),
      len: random(20, 80),
      angle: random(TWO_PI)
    });
  }

  // Create initial dust devils
  for (let i = 0; i < 5; i++) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7,
      size: random(5, 20),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      life: random(100, 300)
    });
  }
}

function draw() {
  // Draw sky
  background(skyColor);

  // Draw ground with terracotta tones
  fill(groundColor);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Draw cracks
  stroke(120, 60, 40);
  strokeWeight(2);
  for (let crack of cracks) {
    push();
    translate(crack.x, crack.y);
    rotate(crack.angle);
    line(0, 0, crack.len, 0);
    pop();
  }

  // Update and draw dust devils
  for (let i = dustDevils.length - 1; i >= 0; i--) {
    let devil = dustDevils[i];

    // Move dust devil
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;

    // Randomly change direction
    devil.angle += random(-0.1, 0.1);

    // Slowly fade out
    devil.life--;
    if (devil.life <= 0) {
      dustDevils.splice(i, 1);
      continue;
    }

    // Draw the dust devil
    noFill();
    stroke(200, 180, 160, 150);
    strokeWeight(devil.size / 4);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let xoff = cos(a) * devil.size;
      let yoff = sin(a) * devil.size;
      vertex(devil.x + xoff, devil.y + yoff);
    }
    endShape(CLOSE);

    // Occasionally spawn new smaller dust devils
    if (random() < 0.02 && dustDevils.length < 15) {
      dustDevils.push({
        x: devil.x,
        y: devil.y,
        size: random(2, 8),
        speed: random(0.5, 1.5),
        angle: random(TWO_PI),
        life: random(100, 200)
      });
    }
  }

  // Occasionally add new dust devils
  if (random() < 0.05 && dustDevils.length < 20) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7,
      size: random(10, 30),
      speed: random(0.8, 2.5),
      angle: random(TWO_PI),
      life: random(150, 400)
    });
  }

  // Occasionally add new cracks
  if (random() < 0.01) {
    cracks.push({
      x: random(width),
      y: random(height * 0.3, height),
      len: random(20, 80),
      angle: random(TWO_PI)
    });
  }

  // Remove old cracks
  if (cracks.length > 150) {
    cracks.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
