let layers = [];
let mechanisms = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create sedimentary layers
  for (let i = 0; i < 12; i++) {
    layers.push({
      y: map(i, 0, 11, -180, 180),
      thickness: random(8, 25),
      color: color(random(15, 35), random(25, 50), random(35, 65))
    });
  }

  // Create interlocking mechanisms
  for (let i = 0; i < 8; i++) {
    mechanisms.push({
      x: random(-150, 150),
      y: random(-100, 100),
      z: random(-100, 100),
      size: random(20, 40),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.04),
      type: i % 3
    });
  }
}

function draw() {
  background(22, 25, 18);
  time += 0.01;

  // Camera movement for cross-section effect
  let camX = sin(time * 0.2) * 80;
  let camY = cos(time * 0.15) * 40;
  camera(camX, camY, 350, camX, camY, 0, 0, 1, 0);

  // Draw layers
  for (let layer of layers) {
    fill(layer.color);
    noStroke();
    push();
    translate(0, layer.y, 0);
    box(500, layer.thickness, 300);
    pop();
  }

  // Draw mechanisms
  for (let mech of mechanisms) {
    mech.rotation += mech.speed;
    drawMechanism(mech.x, mech.y, mech.z, mech.size, mech.rotation, mech.type);
  }
}

function drawMechanism(x, y, z, size, rotation, type) {
  push();
  translate(x, y, z);
  rotateZ(rotation);

  // Base
  fill(80, 50, 40);
  noStroke();
  sphere(size * 0.8, 6, 4);

  if (type === 0) { // Gear
    stroke(70, 40, 30);
    strokeWeight(1.5);
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI * i / 12;
      let toothX = cos(angle) * size * 0.8;
      let toothY = sin(angle) * size * 0.8;
      let nextAngle = TWO_PI * (i + 1) / 12;
      let nextToothX = cos(nextAngle) * size * 0.8;
      let nextToothY = sin(nextAngle) * size * 0.8;

      line(toothX, toothY, 0, nextToothX, nextToothY, 0);
    }
  } else if (type === 1) { // Cam
    stroke(90, 60, 50);
    strokeWeight(1);
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let pointX = cos(angle) * size * 0.7;
      let pointY = sin(angle) * size * 0.7;
      line(0, 0, 0, pointX, pointY, 0);
    }
  } else { // Ratchet
    stroke(60, 45, 35);
    strokeWeight(1);
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let pointX = cos(angle) * size * 0.7;
      let pointY = sin(angle) * size * 0.7;
      line(0, 0, 0, pointX, pointY, 0);
    }
  }

  pop();
}
