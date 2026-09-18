let cube;
let splines = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();

  // Create the central glowing cube
  cube = createGraphics(200, 200, WEBGL);
  cube.noStroke();
  cube.fill(255, 100, 0, 200);
  cube.sphere(80);

  // Create orbiting splines
  for (let i = 0; i < 12; i++) {
    splines.push({
      angle: i * TWO_PI / 12,
      radius: 150 + random(-30, 30),
      speed: random(0.005, 0.01),
      segments: []
    });
  }

  // Initialize spline segments
  for (let s of splines) {
    for (let i = 0; i < 20; i++) {
      s.segments.push({
        x: cos(s.angle + i * 0.5) * s.radius,
        y: sin(s.angle + i * 0.5) * s.radius,
        z: random(-30, 30),
        size: random(3, 8)
      });
    }
  }
}

function draw() {
  background(20);
  time += 0.01;

  // Center the scene
  translate(0, 0, -300);

  // Rotate the entire scene
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.2);

  // Draw the central glowing cube
  push();
  rotateZ(time * 0.5);
  texture(cube);
  sphere(100);
  pop();

  // Draw orbiting splines
  for (let s of splines) {
    s.angle += s.speed;
    let x = cos(s.angle) * s.radius;
    let y = sin(s.angle) * s.radius;
    let z = sin(time + s.angle) * 20;

    push();
    translate(x, y, z);
    rotateZ(-s.angle);

    // Draw segments of the spline
    for (let seg of s.segments) {
      fill(200, 150, 50); // Tarnished copper color
      noStroke();
      sphere(seg.size);
    }

    pop();
  }
}
