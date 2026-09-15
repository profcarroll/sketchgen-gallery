let shapes = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create many pixelated shapes
  for (let i = 0; i < 200; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speed: random(0.5, 3),
      hue: random(360),
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark background with low opacity for trail fading

  let mouse = { x: mouseX, y: mouseY };

  for (let shape of shapes) {
    // Move towards mouse
    let dx = mouse.x - shape.x;
    let dy = mouse.y - shape.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      shape.x += (dx / dist) * shape.speed;
      shape.y += (dy / dist) * shape.speed;
    }

    // Add current position to trail
    shape.trail.push({ x: shape.x, y: shape.y });
    if (shape.trail.length > 10) {
      shape.trail.shift();
    }

    // Draw trail
    noFill();
    stroke(shape.hue, 80, 100, 0.5);
    strokeWeight(2);
    beginShape();
    for (let p of shape.trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw shape itself
    fill(shape.hue, 80, 100);
    noStroke();
    rectMode(CENTER);
    rect(shape.x, shape.y, shape.size, shape.size);
  }
}
