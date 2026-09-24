let particles1 = [];
let particles2 = [];
const numParticles = 100;
const streamRadius = 50;
const colorChangeDistance = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      x: random(width / 4),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      color: color(255, 100, 100, 200)
    });

    particles2.push({
      x: random(3 * width / 4, width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      color: color(100, 100, 255, 200)
    });
  }
}

function draw() {
  background(20);

  // Update and display particles for stream 1
  for (let i = 0; i < particles1.length; i++) {
    let p = particles1[i];
    p.x += p.vx;
    p.y += p.vy;

    // Boundary check for stream 1
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    fill(p.color);
    ellipse(p.x, p.y, 8, 8);

    // Check proximity to stream 2 particles
    for (let j = 0; j < particles2.length; j++) {
      let other = particles2[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < colorChangeDistance) {
        // Swap colors temporarily when close
        let tempColor = p.color;
        p.color = other.color;
        other.color = tempColor;
      }
    }
  }

  // Update and display particles for stream 2
  for (let i = 0; i < particles2.length; i++) {
    let p = particles2[i];
    p.x += p.vx;
    p.y += p.vy;

    // Boundary check for stream 2
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    fill(p.color);
    ellipse(p.x, p.y, 8, 8);

    // Check proximity to stream 1 particles
    for (let j = 0; j < particles1.length; j++) {
      let other = particles1[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < colorChangeDistance) {
        // Swap colors temporarily when close
        let tempColor = p.color;
        p.color = other.color;
        other.color = tempColor;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
