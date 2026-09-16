let particles = [];
let lines = [];
let font;
let textMesh;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Create particles
  for (let i = 0; i < 800; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      ox: random(1000),
      oy: random(1000),
      oz: random(1000),
      size: random(2, 6),
      speed: random(0.001, 0.005)
    });
  }

  // Load font
  textFont('Courier New');
  textSize(32);
  textAlign(CENTER, CENTER);

  // Create text mesh for embedded typography
  let txt = "DATA FLOW";
  textMesh = createGraphics(width, height);
  textMesh.textSize(64);
  textMesh.textAlign(CENTER, CENTER);
  textMesh.background(0, 0);
  textMesh.fill(255);
  textMesh.text(txt, width/2, height/2);
}

function draw() {
  background(10, 10, 30);
  time += 0.01;

  // Draw embedded typography
  image(textMesh, 0, 0);
  noStroke();
  fill(255, 100);
  rectMode(CENTER);
  rect(width/2, height/2, width * 0.8, height * 0.3);

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Flow with gradient field
    let nx = noise(p.ox, p.oy, p.oz) * 2 - 1;
    let ny = noise(p.ox + 1000, p.oy + 1000, p.oz) * 2 - 1;
    let nz = noise(p.ox + 2000, p.oy + 2000, p.oz) * 2 - 1;

    p.x += nx * 0.5;
    p.y += ny * 0.5;
    p.z += nz * 0.5;

    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Update noise seeds
    p.ox += p.speed;
    p.oy += p.speed;
    p.oz += p.speed;

    // Draw particle
    let alpha = map(p.z, -100, 100, 50, 200);
    let size = map(p.z, -100, 100, 1, 4);

    fill(255, 200, 100, alpha);
    noStroke();
    ellipse(p.x, p.y, size);

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = dist(p.x, p.y, other.x, other.y);
      if (d < 80) {
        let alpha = map(d, 0, 80, 150, 0);
        stroke(255, 200, 100, alpha);
        line(p.x, p.y, other.x, other.y);
      }
    }
  }

  // Add subtle rotation counteraction
  rotate(time * 0.001);
  translate(width/2, height/2);

  // Draw pulsing field lines
  stroke(100, 150, 255, 50);
  noFill();
  beginShape();
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI * 4);
    let radius = 100 + sin(time + angle) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Reset transformation
  resetMatrix();
}
