let planes = [];
let time = 0;
const numPlanes = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize origami planes with random positions and rotations
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-200, 200),
      rx: random(TWO_PI),
      ry: random(TWO_PI),
      rz: random(TWO_PI),
      size: random(100, 200),
      color: color(random(360), 80, 90),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera animation
  let camX = sin(time * 0.2) * 300;
  let camY = cos(time * 0.15) * 200;
  camera(0, 0, 400 + sin(time * 0.1) * 100, 0, 0, 0, 0, 1, 0);
  rotateX(sin(time * 0.05) * 0.2);
  rotateY(time * 0.01);

  // Draw and animate planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    push();
    
    // Apply transformations
    translate(p.x, p.y, p.z);
    rotateX(p.rx + sin(time * p.speed) * 0.5);
    rotateY(p.ry + cos(time * p.speed) * 0.3);
    rotateZ(p.rz + sin(time * p.speed * 1.2) * 0.4);

    // Color and transparency
    fill(p.color, 0.8);
    
    // Draw plane as a quad (origami paper shape)
    beginShape();
    vertex(-p.size/2, -p.size/2, 0);
    vertex(p.size/2, -p.size/2, 0);
    vertex(p.size/2, p.size/2, 0);
    vertex(-p.size/2, p.size/2, 0);
    endShape(CLOSE);

    // Update rotations for continuous motion
    p.rx += sin(time * p.speed) * 0.01;
    p.ry += cos(time * p.speed) * 0.01;
    p.rz += sin(time * p.speed * 1.2) * 0.01;

    pop();
  }

  time += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
