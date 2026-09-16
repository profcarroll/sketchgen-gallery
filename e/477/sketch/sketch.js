let pistons = [];
let rods = [];
let crankshaft;
let transaxle;
let sparkTimer = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  angleMode(RADIANS);

  // Initialize engine components
  for (let i = 0; i < 4; i++) {
    pistons.push({
      id: i,
      y: 0,
      speed: random(0.01, 0.03),
      phase: random(TWO_PI)
    });
    rods.push({
      id: i,
      length: 150
    });
  }

  crankshaft = {
    radius: 60,
    rotation: 0,
    speed: 0.02
  };

  transaxle = {
    radius: 40,
    rotation: 0,
    speed: 0.01
  };
}

function draw() {
  background(30);
  noStroke();

  // Center the scene
  translate(0, -50);

  // Draw engine block
  fill(80);
  push();
  rotateX(PI / 2);
  cylinder(100, 10);
  pop();

  // Draw cylinders
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i;
    let x = cos(angle) * 120;
    let z = sin(angle) * 120;
    push();
    translate(x, 0, z);
    rotateY(PI / 2);
    fill(60);
    cylinder(30, 10);
    pop();
  }

  // Update and draw pistons
  for (let i = 0; i < pistons.length; i++) {
    let piston = pistons[i];
    let angle = (TWO_PI / 4) * i;
    let x = cos(angle) * 120;
    let z = sin(angle) * 120;

    // Simulate spark
    if (frameCount % 100 === i * 25) {
      sparkTimer = 10;
    }

    // Update piston position with spark effect
    let phase = piston.phase + crankshaft.rotation;
    let y = sin(phase) * 80;

    // Apply spark explosion effect
    if (sparkTimer > 0) {
      y += random(-20, 20);
      sparkTimer--;
    }

    piston.y = y;

    // Draw piston
    push();
    translate(x, y - 100, z);
    fill(200);
    sphere(15);
    pop();

    // Draw connecting rod
    let rod = rods[i];
    let rodEndX = x;
    let rodEndY = y - 100;
    let rodEndZ = z;

    let crankX = cos(crankshaft.rotation + phase) * crankshaft.radius;
    let crankY = sin(crankshaft.rotation + phase) * crankshaft.radius;

    push();
    stroke(200);
    strokeWeight(3);
    line(rodEndX, rodEndY, rodEndZ, crankX, crankY, 0);
    pop();
  }

  // Update and draw crankshaft
  crankshaft.rotation += crankshaft.speed;
  fill(150);
  sphere(crankshaft.radius);

  // Update and draw transaxle
  transaxle.rotation += transaxle.speed;
  push();
  translate(0, -200, 0);
  rotateZ(transaxle.rotation);
  fill(100);
  sphere(transaxle.radius);
  pop();

  // Draw gear teeth
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + transaxle.rotation;
    let x = cos(angle) * transaxle.radius;
    let y = sin(angle) * transaxle.radius;
    push();
    translate(x, -200, y);
    fill(180);
    sphere(5);
    pop();
  }

  // Update crankshaft rotation based on pistons
  crankshaft.rotation += (pistons[0].y + pistons[1].y + pistons[2].y + pistons[3].y) * 0.0001;
}
