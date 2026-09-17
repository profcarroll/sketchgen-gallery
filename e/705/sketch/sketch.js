let particles = [];
let conduits = [];
let time = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create molecular shards
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(
        random(-width, width),
        random(-height, height),
        random(-200, 200)
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 6),
      hue: random(180, 300)
    });
  }

  // Create energy conduits
  for (let i = 0; i < 10; i++) {
    let points = [];
    for (let j = 0; j < 20; j++) {
      points.push(createVector(
        random(-width, width),
        random(-height, height),
        random(-200, 200)
      ));
    }
    conduits.push(points);
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.3) * 500;
  let camY = cos(time * 0.2) * 500;
  let camZ = sin(time * 0.1) * 500;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Lighting
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 0);
  pointLight(255, 255, 255, camX, camY, camZ);

  // Draw conduits
  stroke(180, 80, 90, 0.3);
  strokeWeight(1);
  noFill();
  for (let conduit of conduits) {
    beginShape();
    for (let p of conduit) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }

  // Draw particles
  noStroke();
  for (let p of particles) {
    let hue = (p.hue + time * 20) % 360;
    fill(hue, 100, 90, 0.8);
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    sphere(p.size);
    pop();

    // Update position
    p.pos.add(p.vel);
    if (p.pos.x > width / 2 + 100) p.pos.x = -width / 2 - 100;
    if (p.pos.x < -width / 2 - 100) p.pos.x = width / 2 + 100;
    if (p.pos.y > height / 2 + 100) p.pos.y = -height / 2 - 100;
    if (p.pos.y < -height / 2 - 100) p.pos.y = height / 2 + 100;
    if (p.pos.z > 200 + 100) p.pos.z = -200 - 100;
    if (p.pos.z < -200 - 100) p.pos.z = 200 + 100;
  }

  // Draw tunnel walls
  noFill();
  stroke(240, 50, 80, 0.1);
  for (let i = 0; i < 20; i++) {
    let scale = 1 + i * 0.1;
    push();
    rotateY(time * 0.05 + i * 0.2);
    rotateX(time * 0.03 + i * 0.1);
    box(400 * scale, 400 * scale, 400 * scale);
    pop();
  }
}
