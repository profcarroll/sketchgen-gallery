let particles = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);
}

function draw() {
  background(0, 0, 0, 10); // Semi-transparent background for trail effect

  // Add new particles at cursor position
  if (mouseIsPressed) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: mouseX,
        y: mouseY,
        size: random(2, 6),
        hue: (frameCount * 2 + i * 10) % 255,
        alpha: 255,
        vx: random(-1, 1),
        vy: random(-1, 1)
      });
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 2;
    p.size *= 0.97;

    if (p.alpha <= 0 || p.size <= 0.5) {
      particles.splice(i, 1);
      continue;
    }

    noStroke();
    fill(p.hue, 255, 255, p.alpha);
    ellipse(p.x, p.y, p.size);
  }
}
