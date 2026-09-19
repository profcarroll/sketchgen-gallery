let bricks = [];
let roots = [];
let particles = [];
let mortarColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a weathered brick wall pattern
  for (let y = 0; y < height; y += 40) {
    for (let x = 0; x < width; x += 60) {
      let brick = {
        x: x + random(-2, 2),
        y: y + random(-2, 2),
        w: 50 + random(-3, 3),
        h: 30 + random(-2, 2),
        hue: 10 + random(-2, 2),
        sat: 20 + random(-5, 5),
        bri: 40 + random(-10, 10)
      };
      bricks.push(brick);
    }
  }

  // Create initial root tendrils
  for (let i = 0; i < 8; i++) {
    roots.push({
      x: random(width),
      y: random(height),
      length: random(50, 150),
      angle: random(TWO_PI),
      segments: []
    });
  }

  mortarColor = color(30, 10, 20);

  // Initialize particles for erosion
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      speed: random(0.1, 0.5),
      opacity: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark background to emphasize textures
  
  // Draw mortar lines
  noStroke();
  fill(mortarColor);
  for (let y = 0; y < height; y += 40) {
    rect(0, y, width, 5);
  }
  
  // Draw bricks with weathering
  for (let brick of bricks) {
    fill(brick.hue, brick.sat, brick.bri);
    stroke(0, 0, 0, 0.2);
    rect(brick.x, brick.y, brick.w, brick.h, 3);
    
    // Add some random weathering details
    for (let i = 0; i < 3; i++) {
      fill(brick.hue + random(-5, 5), brick.sat + random(-10, 10), brick.bri + random(-20, 10));
      rect(brick.x + random(brick.w), brick.y + random(brick.h), random(3, 8), random(2, 6));
    }
  }

  // Update and draw root tendrils
  for (let root of roots) {
    updateRoot(root);
    drawRoot(root);
  }

  // Draw particles for erosion effect
  for (let p of particles) {
    updateParticle(p);
    drawParticle(p);
  }
}

function updateRoot(root) {
  // Roots grow slowly and randomly
  root.angle += random(-0.02, 0.02);
  root.length += random(0.01, 0.05);

  // Add new segment to root
  if (root.segments.length > 50 || random() < 0.01) {
    root.segments.push({x: root.x, y: root.y});
  }

  // Move root tip
  root.x += cos(root.angle) * 0.5;
  root.y += sin(root.angle) * 0.5;

  // Keep within canvas bounds
  if (root.x < 0 || root.x > width || root.y < 0 || root.y > height) {
    root.x = random(width);
    root.y = random(height);
    root.length = 0;
    root.segments = [];
  }
}

function drawRoot(root) {
  stroke(20, 50, 30);
  strokeWeight(1.5);
  noFill();
  
  beginShape();
  vertex(root.x, root.y);
  
  for (let i = 0; i < root.segments.length; i++) {
    let seg = root.segments[i];
    vertex(seg.x, seg.y);
  }
  
  endShape();
  
  // Draw root tip with subtle glow
  fill(30, 60, 40);
  noStroke();
  ellipse(root.x, root.y, 3, 3);
}

function updateParticle(p) {
  // Particles move downward and fade out
  p.y += p.speed;
  p.opacity -= 0.002;

  // Reset particles that fall off screen or fade out
  if (p.y > height || p.opacity <= 0) {
    p.x = random(width);
    p.y = -5;
    p.opacity = random(0.3, 0.8);
  }
}

function drawParticle(p) {
  noStroke();
  fill(20, 20, 50, p.opacity);
  ellipse(p.x, p.y, p.size, p.size);
}
