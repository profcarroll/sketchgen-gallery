let waves = [];
let time = 0;
let mouseForce = { x: 0, y: 0, radius: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize waves
  for (let i = 0; i < 500; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: random(20, 80),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10);
  time += 0.01;

  // Apply mouse force if active
  if (mouseForce.radius > 0) {
    mouseForce.radius -= 2;
  }

  // Draw waves
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i];
    let d = dist(mouseX, mouseY, w.x, w.y);
    
    // Mouse interaction
    let force = 0;
    if (d < mouseForce.radius + w.radius) {
      force = map(d, 0, mouseForce.radius + w.radius, 1, 0);
    }

    // Calculate wave value
    let val = sin(time * w.speed + w.phase) * (1 - force * 0.5);
    
    // Color based on value and position
    let hue = map(val, -1, 1, 240, 10); // Blue to red
    let sat = 80 + val * 20;
    let bright = 60 + val * 30;

    fill(hue, sat, bright, 0.7);
    
    // Draw wave with interaction effect
    push();
    translate(w.x, w.y);
    scale(1 + val * 0.5);
    ellipse(0, 0, w.radius * (1 + val * 0.3), w.radius * (1 + val * 0.3));
    pop();
  }
}

function mousePressed() {
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
  mouseForce.radius = 200;
}

function mouseDragged() {
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
  mouseForce.radius = 200;
}
