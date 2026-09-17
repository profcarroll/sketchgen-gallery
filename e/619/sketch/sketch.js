let cubeRotation = 0;
let glassOrbits = [];
let copperSplines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create glass orbits
  for (let i = 0; i < 8; i++) {
    glassOrbits.push({
      angle: i * TWO_PI / 8,
      radius: 150 + i * 20,
      color: color(120, 80, 60, 0.7),
      segments: 64
    });
  }

  // Create copper splines
  for (let i = 0; i < 3; i++) {
    copperSplines.push({
      points: [],
      color: color(30, 80, 50, 0.9),
      radius: 120 + i * 40,
      segments: 64
    });
  }

  // Initialize splines with circular paths
  for (let s = 0; s < copperSplines.length; s++) {
    const spline = copperSplines[s];
    for (let i = 0; i < spline.segments; i++) {
      const angle = map(i, 0, spline.segments, 0, TWO_PI);
      const x = cos(angle) * spline.radius;
      const y = sin(angle) * spline.radius;
      spline.points.push(createVector(x, y, 0));
    }
  }

  frameRate(30);
}

function draw() {
  background(0);

  // Rotate the entire scene
  cubeRotation += 0.01;
  rotateY(cubeRotation);

  // Draw central glowing sphere (molten bronze)
  push();
  noStroke();
  fill(30, 100, 80, 1);
  sphere(40);
  pop();

  // Draw glass orbits with internal glowing seams
  for (let i = 0; i < glassOrbits.length; i++) {
    const orbit = glassOrbits[i];
    push();
    rotateX(PI / 2); // Align to XY plane
    stroke(orbit.color);
    noFill();

    beginShape();
    for (let j = 0; j < orbit.segments; j++) {
      const angle = map(j, 0, orbit.segments, 0, TWO_PI) + orbit.angle;
      const x = cos(angle) * orbit.radius;
      const y = sin(angle) * orbit.radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);

    // Draw internal glowing seams
    stroke(200, 100, 90, 0.6);
    strokeWeight(1);
    for (let j = 0; j < orbit.segments; j += 4) {
      const angle = map(j, 0, orbit.segments, 0, TWO_PI) + orbit.angle;
      const x = cos(angle) * orbit.radius;
      const y = sin(angle) * orbit.radius;
      point(x, y, 0);
    }
    pop();
  }

  // Draw copper splines
  for (let s = 0; s < copperSplines.length; s++) {
    const spline = copperSplines[s];
    push();
    rotateX(PI / 2);
    stroke(spline.color);
    noFill();
    strokeWeight(1.5);

    beginShape();
    for (let i = 0; i < spline.points.length; i++) {
      const v = spline.points[i];
      vertex(v.x, v.y, v.z);
    }
    endShape(CLOSE);
    pop();
  }

  // Animate splines slightly
  for (let s = 0; s < copperSplines.length; s++) {
    const spline = copperSplines[s];
    for (let i = 0; i < spline.points.length; i++) {
      const v = spline.points[i];
      v.z = sin(cubeRotation * 0.5 + i * 0.1) * 20;
    }
  }

  // Add ambient glow around the core
  push();
  noStroke();
  fill(30, 100, 70, 0.1);
  sphere(50);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
