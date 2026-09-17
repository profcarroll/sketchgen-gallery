let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Add new particle at mouse position
  if (mouseIsPressed) {
    particles.push({
      x: mouseX,
      y: mouseY,
      size: 2,
      age: 0,
      maxAge: 100,
      hue: random(360),
      saturation: 100,
      brightness: 100
    });
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Grow particle
    p.size += 0.2;
    
    // Fade out particle
    p.age++;
    let alpha = map(p.age, 0, p.maxAge, 1, 0);
    
    // Shift hue towards pastel (lower saturation and brightness)
    let sat = map(p.age, 0, p.maxAge, p.saturation, 30);
    let bright = map(p.age, 0, p.maxAge, p.brightness, 70);
    
    // Draw particle
    noStroke();
    fill(p.hue, sat, bright, alpha);
    ellipse(p.x, p.y, p.size);
    
    // Remove old particles
    if (p.age > p.maxAge) {
      particles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
