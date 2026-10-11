let stoneFacades = [];
let fallingParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create stone facade segments
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height * 0.7);
    let w = random(80, 200);
    let h = random(100, 300);
    stoneFacades.push({ x, y, w, h });
  }

  // Initialize some particles
  for (let i = 0; i < 100; i++) {
    fallingParticles.push({
      x: random(width),
      y: random(-50, -10),
      size: random(1, 4),
      speed: random(0.5, 2),
      hue: random(20, 40), // stone brown
      saturation: random(20, 40),
      lightness: random(30, 60),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.01;

  // Draw background with dark gray
  background(0, 0, 10);

  // Draw stone facades
  noStroke();
  for (let facade of stoneFacades) {
    fill(20, 30, 40); // dark stone color
    rect(facade.x, facade.y, facade.w, facade.h);
    
    // Add some weathering details
    fill(15, 25, 25);
    for (let i = 0; i < 5; i++) {
      let x = random(facade.x, facade.x + facade.w);
      let y = random(facade.y, facade.y + facade.h);
      let w = random(3, 10);
      let h = random(2, 8);
      rect(x, y, w, h);
    }
  }

  // Update and draw falling particles
  for (let i = fallingParticles.length - 1; i >= 0; i--) {
    let p = fallingParticles[i];
    
    // Apply gravity
    p.y += p.speed;
    p.x += sin(time * 0.5 + p.y * 0.01) * 0.2;

    // Update size and fade out
    p.size *= 0.98;
    
    // Draw particle
    noStroke();
    fill(p.hue, p.saturation, p.lightness, 0.7);
    ellipse(p.x, p.y, p.size);

    // Remove if off screen or too small
    if (p.y > height || p.size < 0.5) {
      fallingParticles.splice(i, 1);
    }
  }

  // Occasionally spawn new particles to simulate ongoing dissolution
  if (frameCount % 3 === 0 && fallingParticles.length < 200) {
    let x = random(width);
    let y = -10;
    fallingParticles.push({
      x,
      y,
      size: random(1, 4),
      speed: random(0.5, 2),
      hue: random(20, 40),
      saturation: random(20, 40),
      lightness: random(30, 60),
      angle: random(TWO_PI)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
