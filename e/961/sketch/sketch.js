let particles = [];
let grid = [];
let gridSize = 20;
let cols, rows;
let flowField = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = width / gridSize;
  rows = height / gridSize;
  flowField = new Array(cols * rows);

  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(1, 3),
      color: color(random(50, 200), random(100, 255), random(200, 255), 150),
      life: random(100, 300)
    });
  }

  // Initialize grid
  for (let i = 0; i < cols * rows; i++) {
    grid.push([]);
  }
}

function draw() {
  background(10, 20, 30);

  // Update flow field based on time
  let time = millis() * 0.0005;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * 0.02, y * 0.02, time) * TWO_PI * 2;
      flowField[index] = p5.Vector.fromAngle(angle);
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Get the flow field vector at particle's position
    let col = floor(p.x / gridSize);
    let row = floor(p.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      let index = col + row * cols;
      let force = flowField[index];
      p.vx += force.x * 0.1;
      p.vy += force.y * 0.1;
    }

    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;

    // Add some random movement for eddies
    p.vx += random(-0.1, 0.1);
    p.vy += random(-0.1, 0.1);

    // Dampen velocity
    p.vx *= 0.95;
    p.vy *= 0.95;

    // Boundary check
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      particles.splice(i, 1);
      particles.push({
        x: random(width),
        y: random(height),
        vx: 0,
        vy: 0,
        size: random(1, 3),
        color: color(random(50, 200), random(100, 255), random(200, 255), 150),
        life: random(100, 300)
      });
    }

    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size);

    // Reduce life and remove if needed
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      particles.push({
        x: random(width),
        y: random(height),
        vx: 0,
        vy: 0,
        size: random(1, 3),
        color: color(random(50, 200), random(100, 255), random(200, 255), 150),
        life: random(100, 300)
      });
    }
  }

  // Connect nearby particles to form filaments
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 50) {
        stroke(255, 50);
        strokeWeight(0.5);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = width / gridSize;
  rows = height / gridSize;
}
