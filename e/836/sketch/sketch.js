let particles = [];
let tunnelRotation = 0;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a set of particles in a tunnel-like structure
  for (let i = 0; i < 2000; i++) {
    let angle = random(TWO_PI);
    let radius = random(50, 300);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = random(-1000, 1000);
    particles.push({ x, y, z });
  }
}

function draw() {
  background(0);
  time += 0.005;
  tunnelRotation += 0.002;

  // Camera movement
  let camX = sin(time * 0.3) * 100;
  let camY = cos(time * 0.2) * 50;
  let camZ = sin(time * 0.1) * 100;
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);

  // Rotate the tunnel
  rotateY(tunnelRotation);

  // Pulsing bioluminescent background
  let hue = (time * 20) % 360;
  let saturation = 50 + sin(time * 2) * 20;
  let brightness = 10 + sin(time * 1.5) * 5;

  // Draw tunnel particles
  stroke(hue, saturation, brightness, 0.8);
  noFill();
  beginShape(POINTS);
  for (let p of particles) {
    // Animate particle positions in a tunnel-like motion
    let speed = 0.01;
    let offset = time * speed + p.z * 0.002;
    p.x += sin(offset) * 0.5;
    p.y += cos(offset) * 0.5;
    p.z -= 3;

    // Wrap around the tunnel
    if (p.z < -1000) p.z = 1000;
    if (p.z > 1000) p.z = -1000;

    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw crystalline structures
  push();
  rotateX(time * 0.2);
  rotateY(time * 0.3);
  for (let i = 0; i < 20; i++) {
    let angle = (i / 20) * TWO_PI + time;
    let radius = 150 + sin(time + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.5 + i) * 200;

    push();
    translate(x, y, z);
    rotateX(time * 2 + i);
    rotateY(time * 1.5 + i);
    stroke(hue, saturation, brightness, 0.7);
    fill(hue, saturation, brightness * 0.3, 0.3);
    box(20 + sin(time + i) * 10);
    pop();
  }
  pop();
}
