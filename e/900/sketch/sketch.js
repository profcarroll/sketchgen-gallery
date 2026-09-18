let pistons = [];
let connectingRods = [];
let crankshaft;
let valves = [];
let intakeFluids = [];
let exhaustFluids = [];
let engineRotation = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      position: createVector(0, 0, 0),
      height: 80,
      radius: 30,
      angle: i * PI / 2,
      stroke: color(150, 150, 150),
      fill: color(200, 200, 200)
    });
  }

  // Create connecting rods
  for (let i = 0; i < 4; i++) {
    connectingRods.push({
      from: createVector(0, 0, 0),
      to: createVector(0, 0, 0),
      stroke: color(100, 100, 100)
    });
  }

  // Crankshaft
  crankshaft = {
    radius: 40,
    stroke: color(200, 100, 100),
    fill: color(255, 150, 150)
  };

  // Valves
  for (let i = 0; i < 8; i++) {
    valves.push({
      position: createVector(0, 0, 0),
      open: false,
      stroke: color(255, 255, 255),
      fill: color(100, 100, 255)
    });
  }

  // Fluids
  for (let i = 0; i < 8; i++) {
    intakeFluids.push({
      position: createVector(0, 0, 0),
      size: random(5, 10),
      speed: random(0.5, 2)
    });
    exhaustFluids.push({
      position: createVector(0, 0, 0),
      size: random(5, 10),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(30, 30, 40);
  engineRotation += 0.02;

  // Center the scene
  translate(0, 0, -200);

  // Draw cylinders (cutaway view)
  for (let i = 0; i < 4; i++) {
    let angle = pistons[i].angle + engineRotation;
    let x = cos(angle) * 150;
    let y = sin(angle) * 150;

    // Cylinder wall
    push();
    translate(x, y, 0);
    rotateZ(-angle);
    stroke(200);
    noFill();
    cylinder(35, 100, 4, false);
    pop();

    // Piston
    let pistonY = sin(angle) * 100;
    push();
    translate(x, y + pistonY, 0);
    rotateZ(-angle);
    fill(pistons[i].fill);
    stroke(pistons[i].stroke);
    cylinder(30, pistons[i].height, 4, false);
    pop();

    // Connecting rod
    let rodEndX = x;
    let rodEndY = y + pistonY;
    connectingRods[i].from.set(rodEndX, rodEndY, 0);
    connectingRods[i].to.set(0, 0, 0);

    stroke(connectingRods[i].stroke);
    line(rodEndX, rodEndY, 0, 0, 0, 0);
  }

  // Draw crankshaft
  push();
  rotateZ(engineRotation);
  fill(crankshaft.fill);
  stroke(crankshaft.stroke);
  sphere(crankshaft.radius);
  pop();

  // Update and draw valves
  for (let i = 0; i < 8; i++) {
    let valveAngle = i * PI / 4 + engineRotation;
    let x = cos(valveAngle) * 120;
    let y = sin(valveAngle) * 120;

    // Valve timing
    if (i % 2 === 0) {
      valves[i].open = sin(engineRotation * 2) > 0;
    } else {
      valves[i].open = sin(engineRotation * 2 + PI) > 0;
    }

    push();
    translate(x, y, 0);
    rotateZ(-valveAngle);
    fill(valves[i].fill);
    stroke(valves[i].stroke);
    if (valves[i].open) {
      box(10, 20, 5);
    } else {
      box(10, 10, 5);
    }
    pop();
  }

  // Draw intake and exhaust fluids
  for (let i = 0; i < intakeFluids.length; i++) {
    let fluid = intakeFluids[i];
    let angle = engineRotation + i * PI / 4;
    fluid.position.x = cos(angle) * 130;
    fluid.position.y = sin(angle) * 130;

    fill(100, 200, 255);
    noStroke();
    ellipse(fluid.position.x, fluid.position.y, fluid.size, fluid.size);

    // Move fluid forward
    fluid.position.x += fluid.speed;
    if (fluid.position.x > width / 2) {
      fluid.position.x = -width / 2;
    }
  }

  for (let i = 0; i < exhaustFluids.length; i++) {
    let fluid = exhaustFluids[i];
    let angle = engineRotation + PI + i * PI / 4;
    fluid.position.x = cos(angle) * 130;
    fluid.position.y = sin(angle) * 130;

    fill(255, 100, 100);
    noStroke();
    ellipse(fluid.position.x, fluid.position.y, fluid.size, fluid.size);

    // Move fluid forward
    fluid.position.x -= fluid.speed;
    if (fluid.position.x < -width / 2) {
      fluid.position.x = width / 2;
    }
  }

  // Add a subtle ambient light for depth
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 0);
}
