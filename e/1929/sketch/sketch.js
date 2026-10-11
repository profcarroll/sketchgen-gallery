let layers = [];
let gears = [];
let camPaths = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create sedimentary layers
  for (let i = 0; i < 15; i++) {
    layers.push({
      y: map(i, 0, 14, -200, 200),
      thickness: random(10, 30),
      color: color(random(20, 40), random(30, 60), random(40, 70))
    });
  }

  // Create gears
  for (let i = 0; i < 5; i++) {
    gears.push({
      x: random(-200, 200),
      y: random(-100, 100),
      z: random(-100, 100),
      radius: random(30, 60),
      teeth: floor(random(8, 16)),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }

  // Create cam paths
  for (let i = 0; i < 3; i++) {
    camPaths.push({
      x: random(-200, 200),
      y: random(-100, 100),
      z: random(-100, 100),
      radius: random(80, 150),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.015)
    });
  }
}

function draw() {
  background(20, 30, 20);
  time += 0.01;

  // Camera movement for cross-section effect
  let camX = sin(time * 0.3) * 100;
  let camY = cos(time * 0.2) * 50;
  camera(camX, camY, 400, camX, camY, 0, 0, 1, 0);

  // Draw layers
  for (let layer of layers) {
    fill(layer.color);
    noStroke();
    push();
    translate(0, layer.y, 0);
    box(600, layer.thickness, 400);
    pop();
  }

  // Draw gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    drawGear(gear.x, gear.y, gear.z, gear.radius, gear.teeth, gear.rotation);
  }

  // Draw cams
  for (let cam of camPaths) {
    cam.rotation += cam.speed;
    let x = cam.x + cos(cam.rotation) * cam.radius;
    let y = cam.y + sin(cam.rotation) * cam.radius;
    drawCam(x, y, cam.z, 20, cam.rotation);
  }
}

function drawGear(x, y, z, radius, teeth, rotation) {
  push();
  translate(x, y, z);
  rotateZ(rotation);

  // Gear body
  fill(80, 60, 50);
  noStroke();
  sphere(radius, 12, 8);

  // Gear teeth
  stroke(70, 50, 40);
  strokeWeight(2);
  for (let i = 0; i < teeth; i++) {
    let angle = TWO_PI * i / teeth;
    let toothX = cos(angle) * radius;
    let toothY = sin(angle) * radius;
    let nextAngle = TWO_PI * (i + 1) / teeth;
    let nextToothX = cos(nextAngle) * radius;
    let nextToothY = sin(nextAngle) * radius;

    line(toothX, toothY, 0, nextToothX, nextToothY, 0);
  }

  pop();
}

function drawCam(x, y, z, size, rotation) {
  push();
  translate(x, y, z);
  rotateZ(rotation);

  // Cam body
  fill(100, 70, 60);
  noStroke();
  sphere(size, 8, 6);

  // Cam surface
  stroke(90, 60, 50);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let pointX = cos(angle) * size;
    let pointY = sin(angle) * size;
    line(0, 0, 0, pointX, pointY, 0);
  }

  pop();
}
