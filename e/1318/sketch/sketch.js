let structures = [];
let weeds = [];
let dronePos = { x: 0, y: 0, z: 0 };
let droneVel = { x: 0, y: 0, z: 0 };
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create brutalist concrete structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-1000, 1000),
      w: random(50, 200),
      h: random(100, 300),
      d: random(50, 200),
      color: color(120, 120, 120)
    });
  }

  // Create overgrown weeds
  for (let i = 0; i < 3000; i++) {
    weeds.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-1000, 1000),
      size: random(2, 8),
      color: color(random(50, 150), random(100, 255), random(50, 150))
    });
  }
}

function draw() {
  background(20);
  
  // Smooth drone movement
  time += 0.002;
  droneVel.x = sin(time * 0.3) * 0.5;
  droneVel.z = cos(time * 0.2) * 0.5;
  droneVel.y = sin(time * 0.1) * 0.2;

  dronePos.x += droneVel.x;
  dronePos.y += droneVel.y;
  dronePos.z += droneVel.z;

  // Camera setup
  camera(
    dronePos.x, dronePos.y + 50, dronePos.z + 200,
    dronePos.x, dronePos.y, dronePos.z,
    0, 1, 0
  );

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    fill(s.color);
    box(s.w, s.h, s.d);
    pop();
  }

  // Draw weeds as point cloud
  beginShape(POINTS);
  for (let w of weeds) {
    let dx = w.x - dronePos.x;
    let dz = w.z - dronePos.z;
    if (dx * dx + dz * dz < 1000000) { // Within view distance
      fill(w.color);
      vertex(w.x, w.y, w.z);
    }
  }
  endShape();
}
