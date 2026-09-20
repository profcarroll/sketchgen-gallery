let crankAngle = 0;
let piston1Y, piston2Y;
let valve1Open, valve2Open, valve3Open, valve4Open;

function setup() {
  createCanvas(600, 400);
  noStroke();
}

function draw() {
  background(50);

  crankAngle += 0.05;

  // Piston positions based on crank angle
  piston1Y = 180 + sin(crankAngle) * 80;
  piston2Y = 180 + sin(crankAngle + PI) * 80;

  // Valve timing (simplified)
  valve1Open = (crankAngle > 0 && crankAngle < PI/3);
  valve2Open = (crankAngle > PI/3 && crankAngle < 2*PI/3);
  valve3Open = (crankAngle > 2*PI/3 && crankAngle < PI);
  valve4Open = (crankAngle > PI && crankAngle < 4*PI/3);

  // Engine block
  fill(100);
  rect(100, 100, 400, 200);

  // Cylinders
  fill(80);
  rect(150, 100, 80, 200);  // Cylinder 1
  rect(370, 100, 80, 200);  // Cylinder 2

  // Pistons
  fill(200);
  ellipse(190, piston1Y, 40, 60);  // Piston 1
  ellipse(410, piston2Y, 40, 60);  // Piston 2

  // Crankshaft
  fill(150);
  ellipse(300, 200, 30, 30);
  stroke(150);
  strokeWeight(8);
  line(300, 200, 300 + cos(crankAngle) * 40, 200 + sin(crankAngle) * 40);

  // Valves
  fill(220);
  if (valve1Open) {
    rect(185, 90, 10, 20);  // Intake valve cylinder 1
  }
  if (valve2Open) {
    rect(385, 90, 10, 20);  // Intake valve cylinder 2
  }
  if (valve3Open) {
    rect(185, 290, 10, 20);  // Exhaust valve cylinder 1
  }
  if (valve4Open) {
    rect(385, 290, 10, 20);  // Exhaust valve cylinder 2
  }

  // Combustion chamber
  fill(255, 100, 0);
  ellipse(190, piston1Y - 30, 30, 30);  // Chamber 1
  ellipse(410, piston2Y - 30, 30, 30);  // Chamber 2

  // Connecting rods
  stroke(150);
  strokeWeight(6);
  line(190, piston1Y, 300, 200);
  line(410, piston2Y, 300, 200);

  // Decorative elements
  fill(180);
  rect(150, 300, 80, 10);  // Exhaust manifold
  rect(370, 300, 80, 10);  // Intake manifold
}
