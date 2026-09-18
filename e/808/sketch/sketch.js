function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(240, 10, 95); // dull ivory base

  // Main mechanical head structure
  fill(200, 10, 30); // dull chrome
  noStroke();
  rectMode(CENTER);
  rect(400, 300, 300, 200);

  // Panel joints and seams
  stroke(0, 0, 0, 0.5);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    line(300 + i * 30, 200, 300 + i * 30, 400);
  }
  for (let i = 0; i < 7; i++) {
    line(250, 250 + i * 30, 550, 250 + i * 30);
  }

  // Degradation textures
  fill(0, 100, 20); // deep red corrosion
  noStroke();
  for (let i = 0; i < 50; i++) {
    const x = random(280, 520);
    const y = random(220, 380);
    const s = random(5, 15);
    ellipse(x, y, s, s);
  }

  // Oxidized green patches
  fill(100, 40, 20); // oxidized green
  noStroke();
  for (let i = 0; i < 30; i++) {
    const x = random(320, 480);
    const y = random(240, 360);
    const w = random(10, 30);
    const h = random(5, 15);
    ellipse(x, y, w, h);
  }

  // Operational wear marks
  stroke(0, 0, 0, 0.3);
  strokeWeight(0.5);
  for (let i = 0; i < 100; i++) {
    const x = random(280, 520);
    const y = random(220, 380);
    const l = random(2, 6);
    line(x, y, x + l, y);
  }

  // Grime accumulation
  fill(0, 0, 10); // dark grime
  noStroke();
  for (let i = 0; i < 80; i++) {
    const x = random(280, 520);
    const y = random(220, 380);
    const s = random(1, 3);
    ellipse(x, y, s, s);
  }

  // Structural seams with corrosion
  stroke(0, 100, 20); // red corrosion
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const x = 300 + i * 60;
    line(x, 200, x, 400);
  }

  // Central panel with slight texture
  fill(180, 10, 40); // slightly darker chrome
  rect(400, 300, 200, 150);

  // Inner details
  stroke(0, 0, 0, 0.7);
  strokeWeight(1);
  for (let i = 0; i < 20; i++) {
    const x = random(350, 450);
    const y = random(270, 330);
    line(x - 5, y, x + 5, y);
  }

  // Decorative elements
  fill(100, 50, 10); // brown
  noStroke();
  ellipse(400, 300, 20, 20);

  // Reflections
  fill(280, 10, 90);
  noStroke();
  ellipse(420, 280, 25, 10);
  ellipse(380, 320, 30, 15);
}
