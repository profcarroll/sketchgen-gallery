let forms = [];
let particles = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create crystalline forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      pos: createVector(random(width), random(height)),
      size: random(50, 150),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(180, 240)
    });
  }

  // Create particles for light field
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      speed: random(0.2, 1),
      size: random(0.5, 3),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(200, 10, 5);

  // Draw light field
  for (let p of particles) {
    p.pos.x += sin(frameCount * p.speed * 0.01) * 0.5;
    p.pos.y += cos(frameCount * p.speed * 0.01) * 0.5;

    if (p.pos.x < 0 || p.pos.x > width || p.pos.y < 0 || p.pos.y > height) {
      p.pos.x = random(width);
      p.pos.y = random(height);
    }

    noStroke();
    fill(p.hue, 80, 90, 0.2);
    ellipse(p.pos.x, p.pos.y, p.size);
  }

  // Draw crystalline forms
  for (let f of forms) {
    f.pos.x += sin(frameCount * f.speed) * 0.5;
    f.pos.y += cos(frameCount * f.speed) * 0.5;
    f.rotation += 0.002;

    push();
    translate(f.pos.x, f.pos.y);
    rotate(f.rotation);

    noStroke();
    fill(f.hue, 80, 90, 0.3);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let x = cos(angle) * f.size;
      let y = sin(angle) * f.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Inner crystal
    fill(f.hue, 80, 100, 0.5);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI) + PI/6;
      let x = cos(angle) * f.size * 0.5;
      let y = sin(angle) * f.size * 0.5;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Add subtle glow effect
  blendMode(ADD);
  noStroke();
  fill(190, 30, 80, 0.02);
  ellipse(width/2, height/2, width * 1.5, height * 1.5);
  blendMode(BLEND);
}
