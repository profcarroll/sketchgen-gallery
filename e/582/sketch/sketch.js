let pistons = [];
let connectingRods = [];
let crankshaft;
let gears = [];
let intakeFluids = [];
let exhaustFluids = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      y: 0,
      direction: 1,
      angle: i * PI / 2,
      id: i
    });
  }

  // Create connecting rods
  for (let i = 0; i < 4; i++) {
    connectingRods.push({
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 }
    });
  }

  // Crankshaft
  crankshaft = {
    radius: 80,
    angle: 0
  };

  // Gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      radius: 60 + i * 20,
      angle: 0,
      rotationSpeed: 0.01 + i * 0.005
    });
  }

  // Fluids
  for (let i = 0; i < 20; i++) {
    intakeFluids.push({
      x: 0,
      y: 0,
      z: 0,
      speed: random(0.5, 1.5),
      size: random(2, 6)
    });
    exhaustFluids.push({
      x: 0,
      y: 0,
      z: 0,
      speed: random(0.5, 1.5),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(220);
  noStroke();

  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 300);

  // Camera position
  camera(0, -200, 400, 0, 0, 0, 0, 1, 0);

  // Update crankshaft angle
  crankshaft.angle += 0.05;

  // Update pistons and connecting rods
  for (let i = 0; i < pistons.length; i++) {
    let p = pistons[i];
    let angle = p.angle + crankshaft.angle;
    let rodLength = 120;
    let cylinderHeight = 200;

    // Piston movement
    p.y = sin(angle) * rodLength - cylinderHeight / 2;
    
    // Update connecting rods
    let x = cos(angle) * 60;
    let y = p.y + cylinderHeight / 2;
    connectingRods[i].from = { x: x, y: -cylinderHeight / 2 };
    connectingRods[i].to = { x: x, y: y };

    // Simulate spark
    if (abs(angle) > PI * 0.4 && abs(angle) < PI * 0.6) {
      fill(255, 80, 100);
      push();
      translate(x, y - 30);
      sphere(15);
      pop();
    }
  }

  // Draw cylinders
  for (let i = 0; i < 4; i++) {
    let angle = pistons[i].angle + crankshaft.angle;
    let x = cos(angle) * 60;
    let y = pistons[i].y;

    push();
    translate(x, y);
    rotateY(angle);
    fill(180, 20, 50);
    cylinder(40, 20);
    pop();
  }

  // Draw connecting rods
  stroke(0);
  strokeWeight(3);
  for (let i = 0; i < connectingRods.length; i++) {
    let r = connectingRods[i];
    line(r.from.x, r.from.y, r.to.x, r.to.y);
  }

  // Draw crankshaft
  noStroke();
  fill(100, 50, 80);
  push();
  translate(0, 0);
  rotateZ(crankshaft.angle);
  sphere(crankshaft.radius);
  pop();

  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.angle += gear.rotationSpeed;
    
    push();
    translate(0, 0);
    rotateZ(gear.angle);
    fill(100, 50, 80);
    sphere(gear.radius);
    pop();
  }

  // Draw intake and exhaust fluid flows
  for (let i = 0; i < intakeFluids.length; i++) {
    let f = intakeFluids[i];
    f.x += sin(f.y * 0.01) * f.speed;
    f.y += f.speed;

    if (f.y > height / 2) {
      f.y = -height / 2;
      f.x = random(-100, 100);
    }

    fill(120, 80, 100); // Blue
    noStroke();
    push();
    translate(f.x, f.y, f.z);
    sphere(f.size);
    pop();
  }

  for (let i = 0; i < exhaustFluids.length; i++) {
    let f = exhaustFluids[i];
    f.x += cos(f.y * 0.01) * f.speed;
    f.y -= f.speed;

    if (f.y < -height / 2) {
      f.y = height / 2;
      f.x = random(-100, 100);
    }

    fill(0, 80, 100); // Red
    noStroke();
    push();
    translate(f.x, f.y, f.z);
    sphere(f.size);
    pop();
  }
}
