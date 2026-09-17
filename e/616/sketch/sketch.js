let buildings = [];
let cars = [];
let streetlights = [];
let cameraAngle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  pixelDensity(1);

  // Generate buildings
  for (let x = -300; x < 300; x += 60) {
    for (let z = -300; z < 300; z += 60) {
      if (random() > 0.3) {
        let height = random(50, 200);
        buildings.push({ x, z, height });
      }
    }
  }

  // Generate streetlights
  for (let x = -300; x < 300; x += 40) {
    for (let z = -300; z < 300; z += 40) {
      if (random() > 0.7) {
        streetlights.push({ x, z });
      }
    }
  }

  // Generate cars
  for (let i = 0; i < 20; i++) {
    cars.push({
      x: random(-300, 300),
      z: random(-300, 300),
      speed: random(0.5, 2),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 30);
  noStroke();

  // Camera movement
  cameraAngle += 0.002;
  let camX = sin(cameraAngle) * 500;
  let camZ = cos(cameraAngle) * 500;
  camera(camX, 200, camZ, 0, 100, 0, 0, 1, 0);

  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, 300, 0);

  // Draw ground
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  fill(80, 80, 90);
  plane(600, 600);
  pop();

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, b.height / 2 - 100, b.z);
    fill(50, 50, 70);
    box(40, b.height, 40);
    pop();
  }

  // Draw streetlights
  for (let l of streetlights) {
    push();
    translate(l.x, -90, l.z);
    fill(200, 150, 50);
    cylinder(3, 100);
    pop();
  }

  // Draw cars
  for (let c of cars) {
    push();
    translate(c.x, -80, c.z);
    rotateY(c.angle);
    fill(200, 50, 50);
    box(10, 5, 20);
    // Headlights
    fill(255, 255, 200);
    ellipse(-7, -2, 3, 3);
    ellipse(7, -2, 3, 3);
    pop();

    // Update car position
    c.x += cos(c.angle) * c.speed;
    c.z += sin(c.angle) * c.speed;

    // Wrap around edges
    if (c.x > 350) c.x = -350;
    if (c.x < -350) c.x = 350;
    if (c.z > 350) c.z = -350;
    if (c.z < -350) c.z = 350;

    // Randomly change direction occasionally
    if (random() < 0.01) {
      c.angle += random(-0.2, 0.2);
    }
  }

  // Draw roads
  push();
  fill(40, 40, 40);
  plane(600, 10);
  pop();

  // Draw road lines
  for (let x = -300; x < 300; x += 30) {
    push();
    translate(x, -99, 0);
    fill(255, 255, 255);
    plane(10, 2);
    pop();
  }
}
