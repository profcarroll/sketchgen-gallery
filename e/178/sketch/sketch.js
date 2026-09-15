let marble;
let funnel;
let slope;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    x: 0,
    y: -200,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    radius: 15
  };

  funnel = {
    baseRadius: 200,
    topRadius: 100,
    height: 300,
    slopeAngle: PI / 6
  };

  slope = {
    length: 400,
    angle: PI / 4
  };
}

function draw() {
  background(20);

  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);
  pointLight(255, 255, 255, 300, 300, 300);

  // Funnel
  push();
  rotateX(PI);
  noStroke();
  fill(100, 100, 150, 180);
  cone(funnel.baseRadius, funnel.height, 32);
  pop();

  // Slope
  push();
  translate(0, 0, -funnel.height / 2);
  rotateX(-funnel.slopeAngle);
  fill(150, 100, 100, 200);
  plane(slope.length, 30);
  pop();

  // Marble physics
  updateMarble();
  drawMarble();
}

function updateMarble() {
  // Gravity
  marble.vy += 0.2;

  // Update position
  marble.x += marble.vx;
  marble.y += marble.vy;
  marble.z += marble.vz;

  // Funnel collision
  if (marble.y > -funnel.height / 2 && marble.y < funnel.height / 2) {
    const r = map(marble.y, -funnel.height / 2, funnel.height / 2, funnel.topRadius, funnel.baseRadius);
    const distFromCenter = sqrt(marble.x * marble.x + marble.z * marble.z);

    if (distFromCenter > r - marble.radius) {
      // Bounce
      const angle = atan2(marble.z, marble.x);
      marble.vx = -marble.vx * 0.8;
      marble.vz = -marble.vz * 0.8;
      marble.x = cos(angle) * (r - marble.radius);
      marble.z = sin(angle) * (r - marble.radius);
    }
  }

  // Slope collision
  if (marble.y > funnel.height / 2) {
    const slopeY = funnel.height / 2 + marble.z * tan(funnel.slopeAngle);
    if (marble.y > slopeY - marble.radius && marble.y < slopeY + marble.radius) {
      marble.vy = -abs(marble.vy) * 0.7;
      marble.y = slopeY - marble.radius;
    }

    // Floor bounce
    if (marble.z > slope.length / 2 - marble.radius || marble.z < -slope.length / 2 + marble.radius) {
      marble.vz = -marble.vz * 0.8;
      if (marble.z > slope.length / 2 - marble.radius) marble.z = slope.length / 2 - marble.radius;
      else marble.z = -slope.length / 2 + marble.radius;
    }
  }

  // Keep within bounds
  if (marble.y > funnel.height / 2 + 100) {
    marble.y = funnel.height / 2 + 100;
    marble.vy = 0;
  }
}

function drawMarble() {
  push();
  translate(marble.x, marble.y, marble.z);
  noStroke();
  fill(255, 100, 100);
  sphere(marble.radius);
  pop();
}
