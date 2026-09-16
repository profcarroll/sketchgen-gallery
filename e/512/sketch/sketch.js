let particles = [];
let blobs = [];
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 5, 20);
  noStroke();

  // Create initial blobs
  for (let i = 0; i < 5; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(60, 120),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      color: color(random(0, 100), random(150, 255), random(200, 255), 200),
      age: 0,
      maxAge: random(300, 600)
    });
  }
}

function draw() {
  background(bgColor);

  // Update and display blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    let blob = blobs[i];
    
    // Move blob
    blob.x += blob.speedX;
    blob.y += blob.speedY;

    // Bounce off edges
    if (blob.x < 0 || blob.x > width) blob.speedX *= -1;
    if (blob.y < 0 || blob.y > height) blob.speedY *= -1;

    // Age the blob
    blob.age++;
    
    // Break apart when mature
    if (blob.age > blob.maxAge) {
      createParticles(blob.x, blob.y, blob.size);
      blobs.splice(i, 1);
      continue;
    }

    // Draw blob
    fill(blob.color);
    ellipse(blob.x, blob.y, blob.size);

    // Add some glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = blob.color;
    ellipse(blob.x, blob.y, blob.size);
    drawingContext.shadowBlur = 0;
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    
    // Fade out
    let alpha = map(p.life, 0, 100, 0, 255);
    fill(red(p.color), green(p.color), blue(p.color), alpha);
    
    // Draw particle
    ellipse(p.x, p.y, p.size);

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Occasionally add new blobs
  if (frameCount % 120 === 0 && blobs.length < 8) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(60, 120),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      color: color(random(0, 100), random(150, 255), random(200, 255), 200),
      age: 0,
      maxAge: random(300, 600)
    });
  }
}

function createParticles(x, y, size) {
  let particleCount = map(size, 60, 120, 20, 50);
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: x,
      y: y,
      size: random(2, 8),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      color: color(random(0, 100), random(150, 255), random(200, 255), 200),
      life: random(80, 120)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
