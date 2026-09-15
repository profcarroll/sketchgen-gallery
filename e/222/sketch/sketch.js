let tendrils = [];
let gridLines = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize tendrils
  for (let i = 0; i < 200; i++) {
    tendrils.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      hue: random(180, 240),
      size: random(1, 3)
    });
  }

  // Initialize grid lines
  for (let i = 0; i < 50; i++) {
    gridLines.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.3) * 200;
  let cy = cos(time * 0.2) * 150;
  let cz = sin(time * 0.1) * 100;
  camera(0, 0, (height/2) / tan(PI/6), cx, cy, cz, 0, 1, 0);

  // Draw grid
  stroke(180, 80, 90, 0.3);
  noFill();
  for (let i = 0; i < gridLines.length; i++) {
    let line = gridLines[i];
    line.angle += line.speed;
    push();
    translate(line.x, line.y, line.z);
    rotateZ(line.angle);
    box(200, 10, 10);
    pop();
  }

  // Draw tendrils
  for (let i = 0; i < tendrils.length; i++) {
    let t = tendrils[i];
    t.pos.add(t.vel);
    
    // Bounce off bounds
    if (abs(t.pos.x) > width/2 + 100) t.vel.x *= -1;
    if (abs(t.pos.y) > height/2 + 100) t.vel.y *= -1;
    if (abs(t.pos.z) > 300) t.vel.z *= -1;

    // Draw glow
    noStroke();
    fill(t.hue, 100, 90, 0.7);
    push();
    translate(t.pos.x, t.pos.y, t.pos.z);
    sphere(t.size);
    pop();

    // Draw trail
    stroke(t.hue, 100, 90, 0.3);
    noFill();
    beginShape();
    for (let j = 0; j < 10; j++) {
      let idx = (i + j) % tendrils.length;
      let p = tendrils[idx].pos;
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }

  // Draw intersecting planes
  for (let i = 0; i < 10; i++) {
    let z = map(i, 0, 9, -300, 300);
    stroke(200, 80, 90, 0.2);
    noFill();
    push();
    translate(0, 0, z);
    rotateX(time * 0.1 + i);
    rotateY(time * 0.05 + i);
    box(400, 400, 10);
    pop();
  }
}
