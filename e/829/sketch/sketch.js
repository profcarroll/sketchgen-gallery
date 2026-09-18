let moldParticles = [];
let substrate;
let sediment = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize substrate
  substrate = createGraphics(600, 600);
  substrate.colorMode(HSB, 360, 100, 100, 1);
  substrate.background(240, 10, 90);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(0.5, 3);
    substrate.noStroke();
    substrate.fill(240, 15, 80);
    substrate.ellipse(x, y, sz, sz);
  }

  // Initialize mold particles
  for (let i = 0; i < 200; i++) {
    moldParticles.push({
      x: random(width),
      y: random(height),
      z: 0,
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      age: 0,
      life: random(200, 500),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(0, 0, 10);
  translate(-width / 2, -height / 2);

  // Draw substrate
  image(substrate, 0, 0);

  // Update and draw mold particles
  for (let i = moldParticles.length - 1; i >= 0; i--) {
    let p = moldParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.age++;

    if (p.age > p.life) {
      // Add sediment at this point
      sediment.push({
        x: p.x,
        y: p.y,
        z: 0,
        size: random(0.5, 2),
        age: 0,
        maxAge: random(100, 300)
      });
      moldParticles.splice(i, 1);
    }

    // Draw particle
    push();
    translate(p.x, p.y, p.z);
    fill(120, 90, 95);
    noStroke();
    sphere(p.size);
    pop();
  }

  // Add new particles occasionally
  if (random() < 0.05) {
    moldParticles.push({
      x: random(width),
      y: random(height),
      z: 0,
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      age: 0,
      life: random(200, 500),
      size: random(1, 3)
    });
  }

  // Update and draw sediment
  for (let i = sediment.length - 1; i >= 0; i--) {
    let s = sediment[i];
    s.age++;
    if (s.age > s.maxAge) {
      sediment.splice(i, 1);
    } else {
      push();
      translate(s.x, s.y, s.z);
      fill(240, 15, 60);
      noStroke();
      sphere(s.size);
      pop();
    }
  }

  time++;
}
