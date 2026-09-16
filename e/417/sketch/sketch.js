let shells = [];
let sandParticles = [];
let waterRipples = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);

  // Create sand particles
  for (let i = 0; i < 800; i++) {
    sandParticles.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(1, 3),
      hue: random(40, 60), // pale yellow
      saturation: random(20, 40),
      brightness: random(80, 95)
    });
  }

  // Create shells
  for (let i = 0; i < 150; i++) {
    shells.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 6),
      rotation: random(TWO_PI),
      hue: random(30, 40), // translucent shell color
      saturation: random(50, 70),
      brightness: random(80, 90),
      speed: random(0.001, 0.005)
    });
  }

  // Create water ripples
  for (let i = 0; i < 20; i++) {
    waterRipples.push({
      x: random(width),
      y: height - 20,
      radius: 0,
      maxRadius: random(10, 30),
      speed: random(0.5, 1.5),
      opacity: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(200, 10, 95); // sky blue background

  // Draw sand mound
  noStroke();
  fill(45, 20, 95);
  beginShape();
  for (let i = 0; i < width; i += 5) {
    let y = height * 0.7 + sin(i * 0.02) * 10;
    vertex(i, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw sand particles
  for (let p of sandParticles) {
    fill(p.hue, p.saturation, p.brightness);
    ellipse(p.x, p.y, p.size);
  }

  // Draw shells
  for (let s of shells) {
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    fill(s.hue, s.saturation, s.brightness, 0.7);
    noStroke();
    ellipse(0, 0, s.size, s.size * 0.6);
    // Add shimmer effect
    fill(240, 50, 100, 0.3);
    ellipse(0, 0, s.size * 0.8, s.size * 0.3);
    pop();
    
    // Animate shell rotation
    s.rotation += s.speed;
  }

  // Draw water ripples
  for (let r of waterRipples) {
    stroke(200, 30, 90, r.opacity);
    noFill();
    ellipse(r.x, r.y, r.radius * 2);
    r.radius += r.speed;
    if (r.radius > r.maxRadius) {
      r.radius = 0;
      r.x = random(width);
      r.y = height - 20;
      r.maxRadius = random(10, 30);
      r.opacity = random(0.1, 0.3);
    }
  }

  // Add subtle light refraction
  for (let s of shells) {
    if (random() < 0.05) { // occasional shimmer
      let x = s.x + random(-s.size * 0.5, s.size * 0.5);
      let y = s.y + random(-s.size * 0.5, s.size * 0.5);
      fill(240, 100, 100, 0.5);
      ellipse(x, y, s.size * 0.3);
    }
  }

  // Animate sand particles slightly
  for (let p of sandParticles) {
    if (random() < 0.01) { // occasional movement
      p.y += random(-0.5, 0.5);
      p.x += random(-0.5, 0.5);
    }
  }

  // Occasionally add a new ripple
  if (frameCount % 30 === 0) {
    waterRipples.push({
      x: random(width),
      y: height - 20,
      radius: 0,
      maxRadius: random(10, 30),
      speed: random(0.5, 1.5),
      opacity: random(0.1, 0.3)
    });
  }

  // Remove old ripples
  if (waterRipples.length > 25) {
    waterRipples.shift();
  }
}
