let planes = [];
let pulses = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create geometric planes
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    let size = random(100, 300);
    planes.push({x, y, z, size});
  }

  // Create pulsing waves
  for (let i = 0; i < 50; i++) {
    pulses.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(80, 120)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.3) * 200;
  let cy = cos(time * 0.2) * 150;
  let cz = sin(time * 0.1) * 300;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);

  // Draw planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(time * 0.2 + plane.x * 0.001);
    rotateY(time * 0.1 + plane.y * 0.001);
    noFill();
    stroke(80, 100, 60, 0.7);
    strokeWeight(1);
    box(plane.size);
    pop();
  }

  // Draw pulsing waves
  for (let pulse of pulses) {
    pulse.radius += pulse.speed;
    if (pulse.radius > pulse.maxRadius) {
      pulse.radius = 0;
      pulse.x = random(-width/2, width/2);
      pulse.y = random(-height/2, height/2);
      pulse.z = random(-300, 300);
      pulse.maxRadius = random(100, 300);
    }

    push();
    translate(pulse.x, pulse.y, pulse.z);
    noFill();
    stroke(pulse.hue, 100, 80, 0.5);
    strokeWeight(2);
    ellipse(0, 0, pulse.radius * 2);
    pop();
  }

  // Draw crystalline reflections
  for (let i = 0; i < 300; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);

    push();
    translate(x, y, z);
    rotateX(time * 0.1 + i * 0.01);
    rotateY(time * 0.05 + i * 0.01);
    noFill();
    stroke(80, 100, 90, 0.3);
    strokeWeight(0.5);
    box(random(10, 30));
    pop();
  }
}
