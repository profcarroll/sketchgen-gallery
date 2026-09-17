let orbits = [];
let core;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  core = {
    pos: createVector(0, 0, 0),
    radius: 40,
    hue: 10,
    sat: 90,
    bri: 95
  };

  for (let i = 0; i < 8; i++) {
    orbits.push({
      angle: random(TWO_PI),
      distance: random(150, 300),
      speed: random(0.005, 0.02),
      size: random(20, 40),
      hue: random(20, 40),
      sat: random(70, 90),
      bri: random(60, 80),
      segments: floor(random(5, 10)),
      twist: random(-0.1, 0.1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 400);

  // Draw core
  push();
  translate(core.pos.x, core.pos.y, core.pos.z);
  noStroke();
  fill(core.hue, core.sat, core.bri, 1);
  sphere(core.radius);
  pop();

  // Draw orbits and splines
  for (let i = 0; i < orbits.length; i++) {
    let orbit = orbits[i];
    let x = cos(orbit.angle + time * orbit.speed) * orbit.distance;
    let y = sin(orbit.angle + time * orbit.speed) * orbit.distance;
    let z = sin(time * 0.1 + orbit.angle) * 50;

    orbit.angle += orbit.speed;

    push();
    translate(x, y, z);

    // Twist the spline
    rotateZ(time * orbit.twist);

    // Draw a metallic spline
    stroke(orbit.hue, orbit.sat, orbit.bri, 1);
    noFill();
    beginShape();
    for (let j = 0; j < orbit.segments; j++) {
      let angle = map(j, 0, orbit.segments - 1, 0, TWO_PI * 2);
      let radius = orbit.size * (0.5 + 0.5 * sin(time + angle));
      let px = cos(angle) * radius;
      let py = sin(angle) * radius;
      vertex(px, py, 0);
    }
    endShape(CLOSE);

    // Add highlights
    stroke(255, 100, 100, 0.5);
    strokeWeight(2);
    beginShape();
    for (let j = 0; j < orbit.segments; j++) {
      let angle = map(j, 0, orbit.segments - 1, 0, TWO_PI * 2);
      let radius = orbit.size * 0.8;
      let px = cos(angle) * radius;
      let py = sin(angle) * radius;
      vertex(px, py, 0);
    }
    endShape(CLOSE);

    pop();
  }

  // Add subtle glow effect to core
  push();
  translate(core.pos.x, core.pos.y, core.pos.z);
  noStroke();
  fill(10, 90, 100, 0.2);
  sphere(core.radius * 1.5);
  pop();
}
