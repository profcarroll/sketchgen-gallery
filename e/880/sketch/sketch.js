let particles = [];
let trail = [];
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 5, 20);
  noCursor();
}

function draw() {
  // Create a subtle background animation that responds to mouse
  background(bgColor);

  // Mouse position affects the overall scene
  let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
  let hueOffset = (mouseX / width) * 30;
  let saturation = map(mouseY, 0, height, 20, 60);

  // Add new particles at mouse position
  if (mouseIsPressed) {
    for (let i = 0; i < 3; i++) {
      let p = {
        x: mouseX,
        y: mouseY,
        size: random(2, 8),
        maxLife: random(40, 80),
        life: random(40, 80),
        hue: (hueOffset + random(-10, 10)) % 360,
        sat: saturation,
        bri: 100,
        alpha: 255,
        ringSize: random(5, 20)
      };
      particles.push(p);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // Move particle
    p.x += random(-1, 1);
    p.y += random(-1, 1);

    // Fade out and shrink
    p.life--;
    p.alpha = map(p.life, 0, p.maxLife, 0, 255);
    p.size = map(p.life, 0, p.maxLife, 0, p.size);

    // Create ring effect
    if (p.life > p.maxLife * 0.7) {
      fill(p.hue, p.sat, p.bri, p.alpha * 0.7);
      noStroke();
      ellipse(p.x, p.y, p.ringSize * 2);
    }

    // Transition to pastel
    let pastelHue = (p.hue + 180) % 360;
    fill(pastelHue, p.sat * 0.5, 80, p.alpha * 0.3);
    noStroke();
    ellipse(p.x, p.y, p.size);

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Create a trail effect behind the cursor
  trail.push({ x: mouseX, y: mouseY });
  if (trail.length > 30) {
    trail.shift();
  }

  // Draw the trail with fading opacity
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i];
    let alpha = map(i, 0, trail.length, 0, 150);
    fill(255, alpha);
    noStroke();
    ellipse(pos.x, pos.y, map(i, 0, trail.length, 3, 0.5));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
