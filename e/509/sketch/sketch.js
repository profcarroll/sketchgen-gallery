let shapes = [];
let time = 0;
let colorOffset = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  for (let i = 0; i < 500; i++) {
    shapes.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-200, 200),
      size: random(10, 50),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  colorMode(HSB, 360, 100, 100, 1);
  time += 0.01;
  colorOffset += 0.5;

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    s.angle += s.speed;
    s.x += sin(s.angle) * 0.2;
    s.y += cos(s.angle) * 0.2;
    s.z += sin(time * 0.5) * 0.1;

    let pulse = sin(time + i * 0.1) * 0.5 + 0.5;
    let size = s.size * (1 + pulse * 0.5);

    push();
    translate(s.x, s.y, s.z);
    rotateX(time * 0.2);
    rotateY(time * 0.3);
    
    let hue = (i * 5 + colorOffset) % 360;
    fill(hue, 80, 90, 0.7);
    
    // Draw complex geometric shape
    for (let j = 0; j < 5; j++) {
      rotateZ(time * 0.1);
      box(size * (j * 0.2 + 0.5));
    }
    pop();
  }

  // Warp effect
  let warp = sin(time * 0.7) * 0.3;
  for (let i = 0; i < shapes.length; i += 10) {
    let s = shapes[i];
    push();
    translate(s.x, s.y, s.z);
    rotateX(warp);
    rotateY(warp * 0.5);
    fill(200, 80, 90, 0.3);
    sphere(s.size * 0.5);
    pop();
  }
}
