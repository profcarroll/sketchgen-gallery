let lavaParticles = [];
let rockChunks = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create lava particles
  for (let i = 0; i < 2000; i++) {
    lavaParticles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hue: random(10, 30), // orange to yellow
      saturation: random(80, 100),
      brightness: random(80, 100),
      alpha: random(0.7, 1)
    });
  }

  // Create rock chunks
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 80);
    let hue = random(0, 10); // deep reds and blacks
    let saturation = random(0, 30);
    let brightness = random(0, 20);
    let points = floor(random(5, 15));
    let angles = [];
    for (let j = 0; j < points; j++) {
      angles.push(random(TWO_PI));
    }
    angles.sort((a, b) => a - b);
    rockChunks.push({
      x,
      y,
      size,
      hue,
      saturation,
      brightness,
      points,
      angles
    });
  }
}

function draw() {
  background(0);

  time += 0.01;

  // Draw lava rivers
  for (let i = 0; i < lavaParticles.length; i++) {
    let p = lavaParticles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Apply some turbulence
    p.x += sin(time + i * 0.01) * 0.5;
    p.y += cos(time + i * 0.01) * 0.5;

    // Boundary check and reset
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }

    fill(p.hue, p.saturation, p.brightness, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }

  // Draw rock chunks
  for (let i = 0; i < rockChunks.length; i++) {
    let r = rockChunks[i];
    
    push();
    translate(r.x, r.y);
    rotate(time * 0.01 + i * 0.02);
    
    fill(r.hue, r.saturation, r.brightness);
    noStroke();
    
    beginShape();
    for (let j = 0; j < r.points; j++) {
      let angle = r.angles[j];
      let dist = r.size * (0.7 + 0.3 * sin(time * 2 + j));
      let x = cos(angle) * dist;
      let y = sin(angle) * dist;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Add some dynamic lighting
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 100);
    let alpha = map(sin(time * 3 + i), -1, 1, 0.1, 0.4);
    fill(30, 50, 100, alpha);
    noStroke();
    ellipse(x, y, size);
  }
}
