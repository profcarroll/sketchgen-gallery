let splines = [];
let core;
let framework;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Central glowing core with liquid fire currents
  core = {
    radius: 40,
    hue: 20,
    saturation: 80,
    brightness: 90,
    currentAngle: 0,
    currentSpeed: 0.02
  };

  // Create multiple splines orbiting the core
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let distance = 120 + random(80);
    let radius = 15 + random(15);
    splines.push({
      angle: angle,
      distance: distance,
      radius: radius,
      rotationSpeed: random(-0.005, 0.005),
      hue: 10 + random(20), // oxidized copper
      saturation: 60 + random(20),
      brightness: 40 + random(30),
      segments: 50,
      points: []
    });
  }

  // Framework cube
  framework = {
    size: 300,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    rotationSpeed: 0.001
  };
}

function draw() {
  background(0);
  noStroke();

  // Animate framework cube
  framework.rotationX += framework.rotationSpeed;
  framework.rotationY += framework.rotationSpeed * 0.5;
  framework.rotationZ += framework.rotationSpeed * 0.3;

  // Draw the rotating cubic framework
  push();
  rotateX(framework.rotationX);
  rotateY(framework.rotationY);
  rotateZ(framework.rotationZ);

  stroke(200, 50, 80);
  strokeWeight(1);
  noFill();
  box(framework.size);

  // Draw internal frame lines
  stroke(180, 40, 70);
  for (let i = 0; i < 4; i++) {
    beginShape(LINES);
    vertex(-framework.size/2, -framework.size/2, -framework.size/2 + i * framework.size/4);
    vertex(framework.size/2, -framework.size/2, -framework.size/2 + i * framework.size/4);
    vertex(-framework.size/2, framework.size/2, -framework.size/2 + i * framework.size/4);
    vertex(framework.size/2, framework.size/2, -framework.size/2 + i * framework.size/4);
    endShape();
  }

  pop();

  // Draw splines
  for (let s of splines) {
    s.angle += s.rotationSpeed;

    // Update spline points
    let points = [];
    for (let i = 0; i < s.segments; i++) {
      let t = map(i, 0, s.segments - 1, 0, TWO_PI * 2);
      let x = cos(t) * s.radius;
      let y = sin(t * 1.5) * s.radius * 0.7;
      let z = sin(t * 2) * s.radius * 0.3;

      // Rotate spline in space
      let rotatedX = x * cos(s.angle) - z * sin(s.angle);
      let rotatedZ = x * sin(s.angle) + z * cos(s.angle);

      points.push(createVector(
        rotatedX,
        y,
        rotatedZ
      ));
    }

    // Draw the spline path
    push();
    translate(cos(s.angle) * s.distance, 0, sin(s.angle) * s.distance);
    rotateY(s.angle);

    stroke(s.hue, s.saturation, s.brightness, 0.8);
    strokeWeight(2);

    beginShape();
    for (let p of points) {
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);

    pop();

    // Add sea glass patches
    if (random() > 0.7) {
      let patch = random(points);
      fill(s.hue + 60, s.saturation, s.brightness * 0.8, 0.5);
      noStroke();
      push();
      translate(cos(s.angle) * s.distance, 0, sin(s.angle) * s.distance);
      rotateY(s.angle);
      sphere(2);
      pop();
    }
  }

  // Draw central core with molten glow and internal currents
  push();
  translate(0, 0, 0);

  // Glow effect
  fill(core.hue, core.saturation, core.brightness, 0.9);
  noStroke();
  sphere(core.radius * 1.5);

  // Internal currents
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI) + core.currentAngle;
    let x1 = cos(angle) * core.radius * 0.5;
    let y1 = sin(angle) * core.radius * 0.5;
    let z1 = 0;

    let x2 = cos(angle + PI/4) * core.radius * 1.2;
    let y2 = sin(angle + PI/4) * core.radius * 1.2;
    let z2 = 0;

    stroke(30, 90, 100, 0.7);
    line(x1, y1, z1, x2, y2, z2);
  }

  core.currentAngle += core.currentSpeed;

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
