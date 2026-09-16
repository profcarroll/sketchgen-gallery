let pistons = [];
let gears = [];
let crankshaft;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      angle: i * PI / 2,
      position: createVector(0, 0),
      length: 100,
      stroke: color(200, 80, 90)
    });
  }

  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      radius: 40 + i * 20,
      angle: i * PI / 3,
      rotationSpeed: 0.01 + i * 0.005,
      stroke: color(60, 80, 90)
    });
  }

  // Crankshaft
  crankshaft = {
    radius: 20,
    stroke: color(30, 80, 80)
  };
}

function draw() {
  background(220, 5, 10);

  // Rotate the whole scene for better view
  rotateY(time * 0.002);
  rotateX(PI / 6);

  // Draw engine block
  push();
  fill(200, 30, 40);
  noStroke();
  translate(0, 0, -100);
  box(300, 200, 200);
  pop();

  // Update and draw pistons
  for (let i = 0; i < pistons.length; i++) {
    let piston = pistons[i];
    piston.angle += time * 0.01;
    let x = 80 * cos(piston.angle);
    let y = 80 * sin(piston.angle);

    // Piston rod
    push();
    stroke(piston.stroke);
    strokeWeight(3);
    line(x, y, 0, x, y, -piston.length);
    pop();

    // Piston head
    push();
    fill(piston.stroke);
    noStroke();
    translate(x, y, -piston.length);
    sphere(15);
    pop();
  }

  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.angle += time * gear.rotationSpeed;

    push();
    stroke(gear.stroke);
    strokeWeight(2);
    noFill();
    translate(0, 0, -50);
    rotateZ(gear.angle);
    circle(0, 0, gear.radius * 2);
    pop();

    // Gear teeth
    for (let j = 0; j < 12; j++) {
      let toothAngle = j * TWO_PI / 12 + gear.angle;
      let toothX = cos(toothAngle) * gear.radius;
      let toothY = sin(toothAngle) * gear.radius;

      push();
      stroke(gear.stroke);
      strokeWeight(2);
      line(toothX, toothY, 0, toothX, toothY, -10);
      pop();
    }
  }

  // Draw crankshaft
  push();
  fill(crankshaft.stroke);
  noStroke();
  translate(0, 0, -50);
  sphere(crankshaft.radius);
  pop();

  time++;
}
