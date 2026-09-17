let particles = [];
let connections = [];
let grid = [];
let gridSize = 20;
let gridCellSize = 400 / gridSize;
let time = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      origPos: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      hue: random(360),
      size: random(1, 4)
    });
  }

  // Initialize grid
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  time += 0.01;

  // Update and display particles
  let allPoints = [];
  let allLines = [];

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Apply force based on grid position
    let gridX = floor((p.pos.x + 200) / gridCellSize);
    let gridY = floor((p.pos.y + 200) / gridCellSize);

    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      let force = createVector(
        sin(time * 0.5 + p.pos.x * 0.01) * 0.2,
        cos(time * 0.3 + p.pos.y * 0.01) * 0.2,
        sin(time * 0.4 + p.pos.z * 0.01) * 0.2
      );

      p.vel.add(force);
    }

    // Update position with velocity
    p.pos.add(p.vel);

    // Boundary check and wraparound
    if (p.pos.x > 200) p.pos.x = -200;
    if (p.pos.x < -200) p.pos.x = 200;
    if (p.pos.y > 200) p.pos.y = -200;
    if (p.pos.y < -200) p.pos.y = 200;
    if (p.pos.z > 200) p.pos.z = -200;
    if (p.pos.z < -200) p.pos.z = 200;

    // Store points for batch drawing
    allPoints.push(p.pos);
  }

  // Draw points in one batch
  push();
  beginShape(POINTS);
  for (let i = 0; i < allPoints.length; i++) {
    let p = allPoints[i];
    fill((time * 10 + p.x) % 360, 80, 90, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];

      let d = dist(p1.pos.x, p1.pos.y, p1.pos.z, p2.pos.x, p2.pos.y, p2.pos.z);
      
      if (d < 60) {
        allLines.push({p1: p1.pos, p2: p2.pos});
      }
    }
  }

  // Draw lines in one batch
  beginShape(LINES);
  for (let i = 0; i < allLines.length; i++) {
    let l = allLines[i];
    stroke((time * 10 + l.p1.x) % 360, 80, 90, 0.5);
    vertex(l.p1.x, l.p1.y, l.p1.z);
    vertex(l.p2.x, l.p2.y, l.p2.z);
  }
  endShape();

  pop();
}
