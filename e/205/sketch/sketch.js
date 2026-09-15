let satellites = [];
let planes = 8;
let satPerPlane = 36;
let orbitRadius = 150;
let rippleRadius = 0;
let rippleSpeed = 0.5;
let rippleMax = 300;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < planes; i++) {
    let plane = [];
    let inclination = map(i, 0, planes - 1, 0, PI / 2);
    for (let j = 0; j < satPerPlane; j++) {
      let angle = map(j, 0, satPerPlane - 1, 0, TWO_PI);
      let x = orbitRadius * cos(angle) * sin(inclination);
      let y = orbitRadius * sin(angle) * sin(inclination);
      let z = orbitRadius * cos(inclination);
      plane.push({ x, y, z, angle });
    }
    satellites.push(plane);
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.0005) * 0.1);

  // Draw Earth
  push();
  fill(0, 80, 70);
  sphere(50);
  pop();

  // Update and draw ripples
  rippleRadius += rippleSpeed;
  if (rippleRadius > rippleMax) rippleRadius = 0;

  for (let i = 0; i < planes; i++) {
    let plane = satellites[i];
    for (let j = 0; j < satPerPlane; j++) {
      let sat = plane[j];
      let angle = sat.angle + frameCount * 0.01;
      sat.x = orbitRadius * cos(angle) * sin(map(i, 0, planes - 1, 0, PI / 2));
      sat.y = orbitRadius * sin(angle) * sin(map(i, 0, planes - 1, 0, PI / 2));
      sat.z = orbitRadius * cos(map(i, 0, planes - 1, 0, PI / 2));

      // Draw satellite
      push();
      translate(sat.x, sat.y, sat.z);
      fill(240, 80, 90);
      sphere(3);
      pop();

      // Draw ripple effect
      if (i % 2 === 0) {
        push();
        stroke(240, 100, 100, 0.3);
        noFill();
        ellipse(sat.x, sat.y, rippleRadius);
        pop();
      }
    }
  }
}
