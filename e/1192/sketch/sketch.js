let bricks = [];
let roots = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create bricks
  for (let i = 0; i < 150; i++) {
    bricks.push({
      x: random(width),
      y: random(height),
      w: random(60, 120),
      h: random(30, 60),
      color: color(
        random(100, 180),
        random(50, 100),
        random(20, 60),
        255
      ),
      highlight: color(
        random(200, 255),
        random(100, 150),
        random(50, 100),
        255
      ),
      decay: random(0.99, 1),
    });
  }

  // Create roots
  for (let i = 0; i < 30; i++) {
    roots.push({
      x: random(width),
      y: random(height),
      len: random(50, 200),
      angle: random(TWO_PI),
      segments: floor(random(5, 15)),
      color: color(
        random(80, 120),
        random(60, 90),
        random(30, 50),
        200
      ),
    });
  }

  // Create particles for flaking
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(0.5, 2),
      color: color(
        random(100, 180),
        random(50, 100),
        random(20, 60),
        200
      ),
      life: random(30, 100),
    });
  }
}

function draw() {
  background(30, 20, 10);

  // Draw bricks
  for (let brick of bricks) {
    fill(brick.color);
    rect(brick.x, brick.y, brick.w, brick.h, 5);

    // Add highlights to simulate texture
    fill(brick.highlight);
    rect(brick.x + 5, brick.y + 5, brick.w - 10, 5, 2);
    rect(brick.x + 5, brick.y + 5, 5, brick.h - 10, 2);

    // Simulate decay
    if (random() < 0.005) {
      brick.decay *= 0.99;
      if (brick.decay < 0.8) {
        brick.decay = random(0.99, 1);
      }
    }

    // Draw cracks and spalling
    if (random() < 0.02) {
      fill(0, 0, 0, 150);
      ellipse(
        brick.x + random(brick.w),
        brick.y + random(brick.h),
        random(5, 15)
      );
    }
  }

  // Draw roots
  for (let root of roots) {
    push();
    translate(root.x, root.y);
    rotate(root.angle);

    let segmentLength = root.len / root.segments;
    for (let i = 0; i < root.segments; i++) {
      let x = i * segmentLength;
      let y = sin(i * 0.5) * 3;

      fill(root.color);
      ellipse(x, y, random(3, 8), random(1, 4));
    }
    pop();
  }

  // Draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;

    if (p.life <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.life = random(30, 100);
    }

    fill(p.color);
    ellipse(p.x, p.y, p.size);

    // Occasionally flake
    if (random() < 0.002) {
      p.speedX = random(-1, 1);
      p.speedY = random(0, 1);
    }
  }

  // Simulate continuous movement
  for (let brick of bricks) {
    brick.x += random(-0.1, 0.1);
    brick.y += random(-0.1, 0.1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
