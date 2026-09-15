let particles = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.2, 0.8)),
      size: random(2, 6),
      hue: random(240, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.3) * 200;
  let cy = cos(time * 0.2) * 100;
  let cz = sin(time * 0.1) * 150;
  camera(0, 0, (height / 2) / tan(PI / 6), cx, cy, cz, 0, 1, 0);

  // Draw particles
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    fill(p.hue, 80, 90, 0.8);
    sphere(p.size);
    pop();

    // Update position
    p.pos.add(p.vel);
    if (p.pos.mag() > 500) {
      p.pos = p5.Vector.random3D().mult(400);
    }
  }

  // Draw connections
  stroke(200, 60, 80, 0.2);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = p5.Vector.dist(particles[i].pos, particles[j].pos);
      if (d < 150) {
        vertex(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z);
        vertex(particles[j].pos.x, particles[j].pos.y, particles[j].pos.z);
      }
    }
  }
  endShape();
}
