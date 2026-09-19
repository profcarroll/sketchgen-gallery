let particles1 = [];
let particles2 = [];
const numParticles = 200;
const streamWidth = 100;
const interactionRadius = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      x: random(width / 4 - streamWidth / 2, width / 4 + streamWidth / 2),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(0.5, 1.5),
      color: color(random(255), random(100, 255), random(200, 255)),
      size: random(4, 8)
    });

    particles2.push({
      x: random(3 * width / 4 - streamWidth / 2, 3 * width / 4 + streamWidth / 2),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-1.5, -0.5),
      color: color(random(200, 255), random(100, 255), random(255)),
      size: random(4, 8)
    });
  }
}

function draw() {
  background(10);

  // Update and display particles
  for (let i = 0; i < numParticles; i++) {
    let p1 = particles1[i];
    let p2 = particles2[i];

    // Move particles
    p1.x += p1.vx;
    p1.y += p1.vy;
    p2.x += p2.vx;
    p2.y += p2.vy;

    // Boundary check and reset
    if (p1.y > height + 20) {
      p1.y = -20;
      p1.x = random(width / 4 - streamWidth / 2, width / 4 + streamWidth / 2);
    }
    if (p2.y < -20) {
      p2.y = height + 20;
      p2.x = random(3 * width / 4 - streamWidth / 2, 3 * width / 4 + streamWidth / 2);
    }

    // Interaction between particles
    let d = dist(p1.x, p1.y, p2.x, p2.y);
    if (d < interactionRadius) {
      // Blend colors when close
      let blendedColor = lerpColor(p1.color, p2.color, 0.5);
      fill(blendedColor);
    } else {
      fill(p1.color);
    }

    ellipse(p1.x, p1.y, p1.size);

    if (d < interactionRadius) {
      // Blend colors when close
      let blendedColor = lerpColor(p2.color, p1.color, 0.5);
      fill(blendedColor);
    } else {
      fill(p2.color);
    }

    ellipse(p2.x, p2.y, p2.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
