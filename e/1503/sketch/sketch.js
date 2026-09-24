let patches = [];
let time = 0;
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Precompute color palette for day cycle
  colors = [];
  for (let i = 0; i < 256; i++) {
    let t = i / 255;
    let r, g, b;

    // Interpolate through HSV to RGB
    if (t < 0.25) {
      r = 0;
      g = t * 4 * 255;
      b = 255;
    } else if (t < 0.5) {
      r = 0;
      g = 255;
      b = (1 - t * 2) * 255;
    } else if (t < 0.75) {
      r = (t * 4 - 2) * 255;
      g = 255;
      b = 0;
    } else {
      r = 255;
      g = (1 - (t - 0.75) * 4) * 255;
      b = 0;
    }

    colors.push(color(r, g, b));
  }

  // Initialize patches
  for (let i = 0; i < 100; i++) {
    patches.push({
      x: random(width),
      y: random(height),
      size: random(30, 150),
      angle: random(TWO_PI),
      colorIndex: floor(random(colors.length)),
      speed: random(0.001, 0.005),
      targetColorIndex: floor(random(colors.length))
    });
  }
}

function draw() {
  time += 0.002;

  // Background transition
  let bgIndex = (time * 0.5) % colors.length;
  background(colors[floor(bgIndex)]);

  // Draw patches
  for (let i = 0; i < patches.length; i++) {
    let p = patches[i];
    
    // Update color slowly
    p.colorIndex = lerp(p.colorIndex, p.targetColorIndex, 0.01);
    if (abs(p.colorIndex - p.targetColorIndex) < 1) {
      p.targetColorIndex = floor(random(colors.length));
    }

    push();
    translate(p.x, p.y);
    rotate(p.angle + time * p.speed);
    
    // Draw a geometric patch
    fill(colors[floor(p.colorIndex)]);
    rectMode(CENTER);
    rect(0, 0, p.size, p.size * 0.6);

    // Add stitching lines
    stroke(255, 100);
    strokeWeight(1);
    line(-p.size/2, 0, p.size/2, 0);
    line(0, -p.size/3, 0, p.size/3);
    
    pop();

    // Move patches
    p.x += sin(time * 0.5 + i) * 0.1;
    p.y += cos(time * 0.3 + i) * 0.1;

    // Wrap around canvas
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
